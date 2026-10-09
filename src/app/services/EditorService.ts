import { Node, Edge } from "reactflow";
import { rules } from "../../lib/helper/EditorRules";
import { dockerDefaults } from "../../lib/helper/DockerDefaults";
import type { CreateAppDto } from "../../lib/dto/AppDto";
import type { AlertCreateDto, AlertDto } from "../../lib/dto/AlertDto";
import type { ServiceDto } from "../../lib/dto/ServiceDto";

class EditorStateService {
  private nodes: Node[] = [];
  private edges: Edge[] = [];
  private alerts: AlertCreateDto[] = [];

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }

  setNodes(nodes: Node[]) {
    this.nodes = nodes;
  }

  setEdges(edges: Edge[]) {
    this.edges = edges;
  }

  getAlerts() {
    return this.alerts;
  }

  setAlerts(alerts: (AlertCreateDto | AlertDto)[]) {
    this.alerts = alerts.map((alert) => ({
      alert: alert.alert,
      expr: alert.expr,
      for_time: String(alert.for_time),
      severity: alert.severity,
      summary: alert.summary,
      description: alert.description,
      firing_action: alert.firing_action,
      resolved_action: alert.resolved_action,
    }));
  }

  clearAlerts() {
    this.alerts = [];
  }

  updateState(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  getNodeById(nodeId: string) {
    return this.nodes.find((n) => n.id === nodeId);
  }

  getNodeByServiceName(serviceName: string) {
    const normalizedName = this.formatName(serviceName || "");
    return this.nodes.find(
      (node) => node.type === "service" && this.formatName(node.data?.name || "") === normalizedName
    );
  }

  getServiceNodeByIndex(index: number) {
    return this.nodes.filter((node) => node.type === "service")[index];
  }

  getAppNode() {
    return this.nodes.find((node) => node.type === "app");
  }

  setNodeData(nodeId: string, partialData: Record<string, any>) {
    this.nodes = this.nodes.map((node) => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        data: {
          ...(node.data || {}),
          ...partialData,
        },
      };
    });
  }

  applyImageDefaultsToNode(nodeId: string, imageName: string) {
    const defaults = dockerDefaults[imageName];
    if (!defaults) return { nodes: this.nodes, edges: this.edges };

    this.nodes = this.nodes.map((node) => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        data: {
          ...(node.data || {}),
          image: imageName,
          ...defaults, 
          environment: {
            ...(node.data?.environment || {}),
            ...(defaults.environment || {}),
          }
        },
      };
    });

    return { nodes: this.nodes, edges: this.edges };
  }

  getNodeNewNamesByType(type: string): string {
    const prefix = type.charAt(0).toUpperCase() + type.slice(1);
    const existingNodes = this.nodes.filter((n) => n.type === type);
    const existingNames = existingNodes.map((n) =>
      n.data?.name ? String(n.data.name) : ""
    );
    let counter = 1;
    let newName = `${prefix} ${counter}`;
    while (existingNames.includes(newName)) {
      counter++;
      newName = `${prefix} ${counter}`;
    }
    return newName;
  }

  isNodeValid(currentNode: Node): boolean {
    const nodeType = currentNode.type;
    return rules.some((rule) => {
      if (rule.type === nodeType) {
        const connectedNodes = this.nodes.filter((node) =>
          this.edges.some(
            (edge) => edge.source === node.id || edge.target === node.id
          )
        );
        return connectedNodes.every((connectedNode: any) =>
          rule.possibleConnectionTypes.includes(connectedNode.type)
        );
      }
    });
  }

  getAllowedAddTypesForTarget(targetNode: Node): string[] {
    if (!targetNode) return [];

    const rule = rules.find((r) => r.type === targetNode.type);
    if (!rule || !Array.isArray(rule.possibleConnectionTypes)) return [];

    const allowed = [...rule.possibleConnectionTypes];

    if (this.isAppNodeCreated()) {
      const idx = allowed.indexOf("app");
      if (idx !== -1) allowed.splice(idx, 1);
    }

    return allowed;
  }

  isValidEdgeConnection(sourceId: string, targetId: string): boolean {
    const sourceNode = this.getNodeById(sourceId);
    const targetNode = this.getNodeById(targetId);

    if (!sourceNode || !targetNode) return false;

    const rule = rules.find((r) => r.type === sourceNode.type);
    if (!rule) return false;

    return rule.possibleConnectionTypes.includes(targetNode.type?? "");
  }

  private getConnectedNodeDataByType(
    selectedNode: Node,
    targetType: string
  ): any[] {
    if (!selectedNode) return [];

    return this.getConnectedNodes(selectedNode)
      .filter((node) => node.type === targetType)
      .map((node) => node.data);
  }

  private getConnectedNodes(selectedNode: Node): Node[] {
    const connectedEdges = this.edges.filter(
      (edge) =>
        edge.source === selectedNode.id || edge.target === selectedNode.id
    );

    const neighborIds = connectedEdges.map((edge) =>
      edge.source === selectedNode.id ? edge.target : edge.source
    );

    return this.nodes.filter((node) => neighborIds.includes(node.id));
  }

  getNetworkDataBySelectedNode(selectedNode: Node): any[] {
    return this.getConnectedNodeDataByType(selectedNode, "network");
  }

  getVolumeNamesBySelectedNode(selectedNode: Node): any[] {
    return this.getConnectedNodeDataByType(selectedNode, "volume");
  }

  getServicesConnectedToApp(selectedNode: Node): any[] {
    return this.getConnectedNodeDataByType(selectedNode, "service");
  }

  private formatName = (name: string) => {
    const lowercased = name.toLowerCase();
    const formatted = lowercased.replace(/\s/g, "");
    return formatted;
  };

  private exportServiceDto(serviceNode: Node): ServiceDto {
    const connectedNodes = this.getConnectedNodes(serviceNode);
    const volumes = connectedNodes
      .filter((node) => node.type === "volume")
      .map((volumeNode) => {
        const containerPath = volumeNode.data?.containerPath || "";
        const localPath = volumeNode.data?.localPath || "";
        const volumeType = volumeNode.data?.type || "volume";

        return {
          path: volumeType === "bind"
            ? `${localPath}:${containerPath}`
            : containerPath,
        };
      });

    const networks = connectedNodes
      .filter((node) => node.type === "network")
      .map((networkNode) => ({
        name: this.formatName(String(networkNode.data?.name ?? "")),
        driver: networkNode.data?.driver,
        address: networkNode.data?.address,
        mask: networkNode.data?.mask,
        gateway: networkNode.data?.gateway,
      }));

    const ports = serviceNode.data?.ports;
    const labels = serviceNode.data?.labels;

    return {
      name: this.formatName(String(serviceNode.data?.name ?? "")),
      image: serviceNode.data?.image || "",
      ports: Array.isArray(ports)
        ? ports
        : typeof ports === "string" && ports.length
          ? ports.split(",").map((port: string) => port.trim())
          : [],
      labels: Array.isArray(labels)
        ? labels.map((label: string) => label.trim())
        : [],
      volumes,
      networks,
      environment: serviceNode.data?.environment || {},
      command: serviceNode.data?.command || null,
      restart_policy: serviceNode.data?.restartPolicy || "unless-stopped",
      startup_scripts: serviceNode.data?.startupScripts || [],
    };
  }

  exportAppDto(): CreateAppDto {
    const appNode = this.nodes.find((n) => n.type === "app");
    const appName = this.formatName(String(appNode?.data?.name ?? ""));
    const services = this.nodes
      .filter((node) => node.type === "service")
      .map((serviceNode) => this.exportServiceDto(serviceNode));
      
    const payload: CreateAppDto = {
      name: appName,
      services,
      hosts: appNode?.data?.hosts ?? [""],
      current_scale: appNode?.data?.actuales ?? 1,
      environment: appNode?.data?.environment ?? {},
      min_scale: appNode?.data?.minimas ?? 1,
      max_scale: appNode?.data?.maximas ?? 2,
      user_id: appNode?.data?.user_id ?? null,
      is_template: false,
    };

    if (this.alerts.length > 0) {
      payload.alerts = this.alerts;
    }

    return payload;
  }

  isAppNodeCreated(): boolean {
    return this.nodes.some((node) => node.type === "app");
  }

  generateMakefileFromApp(
    appDto: CreateAppDto,
  ): string {
    const json = JSON.stringify(appDto, null, 2);
    return [
      json
        .split("\n")
        .map((l) => `\t${l}`)
        .join("\n"),
    ].join("\n");
  }
}

export const editorService = new EditorStateService();
