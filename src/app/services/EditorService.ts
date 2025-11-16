import { Node, Edge } from "reactflow";
import { rules } from "../../lib/helper/EditorRules";
import { dockerDefaults } from "../../lib/helper/DockerDefaults";
import { CreateAppDto } from "../../lib/dto/AppDto";

class EditorStateService {
  private nodes: Node[] = [];
  private edges: Edge[] = [];

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

  updateState(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  getNodeById(nodeId: string) {
    return this.nodes.find((n) => n.id === nodeId);
  }

  // merge partial data into node.data and update internal nodes array
  setNodeData(nodeId: string, partialData: Record<string, any>) {
    const idx = this.nodes.findIndex((n) => n.id === nodeId);
    if (idx === -1) return;
    const node = this.nodes[idx];
    this.nodes[idx] = {
      ...node,
      data: {
        ...(node.data || {}),
        ...partialData,
      },
    };
  }

  applyImageDefaultsToNode(nodeId: string, imageName: string) {
    const defaults = dockerDefaults[imageName];
    if (!defaults) return { nodes: this.nodes, edges: this.edges };

    const node = this.getNodeById(nodeId);
    if (!node) return { nodes: this.nodes, edges: this.edges };

    node.data = {
      ...(node.data || {}),
      image: imageName,
    };

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

  private getConnectedNodeDataByType(
    selectedNode: Node,
    targetType: string
  ): any[] {
    if (!selectedNode) return [];

    const connectedEdges = this.edges.filter(
      (edge) =>
        edge.source === selectedNode.id || edge.target === selectedNode.id
    );

    const neighborIds = connectedEdges.map((edge) =>
      edge.source === selectedNode.id ? edge.target : edge.source
    );

    return this.nodes
      .filter(
        (node) => neighborIds.includes(node.id) && node.type === targetType
      )
      .map((connectedNode) => connectedNode.data);
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

  private formatAppName = (name: String) => {
    const lowercased = name.toLowerCase();
    const formatted = lowercased.replace(/\s/g, "");
    return formatted;
  };

  exportAppDto(): CreateAppDto {
    const appNode = this.nodes.find((n) => n.type === "app");
    const appName = this.formatAppName(appNode?.data.name);

    const services = this.nodes
      .filter((n) => n.type === "service")
      .map((svc) => {
        const connectedEdges = this.edges.filter(
          (e) => e.source === svc.id || e.target === svc.id
        );
        const connectedIds = connectedEdges.map((e) =>
          e.source === svc.id ? e.target : e.source
        );

        const volumes = this.nodes
          .filter((n) => connectedIds.includes(n.id) && n.type === "volume")
          .map((vNode) => {
            const containerPath = vNode.data?.containerPath || "/data";
            const localPath = vNode.data?.localPath || "/";
            return `${localPath}:${containerPath}`;
          });

        const networks = this.nodes
          .filter((n) => connectedIds.includes(n.id) && n.type === "network")
          .map(
            (net) =>
              net.data?.name || net.data?.address || net.id || "net-crane"
          );

        return {
          name: svc.data?.image || "",
          image: svc.data?.image || "",
          ports: Array.isArray(svc.data?.ports)
            ? svc.data.ports
            : typeof svc.data?.ports === "string" && svc.data?.ports.length
            ? svc.data.ports.split(",").map((p: string) => p.trim())
            : [],
          labels: Array.isArray(svc.data?.labels) ? svc.data.labels : [],
          volumes: volumes,
          networks,
        } as any;
      });

    const payload: CreateAppDto = {
      name: appName,
      services,
      hosts: appNode?.data?.hosts ?? [""],
      current_scale: appNode?.data?.actuales ?? 1,
      min_scale: appNode?.data?.minimas ?? 0,
      max_scale: appNode?.data?.maximas ?? 2,
      user_id: appNode?.data?.user_id ?? null,
    };

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
