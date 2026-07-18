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

  private formatName = (name: string) => {
    const lowercased = name.toLowerCase();
    const formatted = lowercased.replace(/\s/g, "");
    return formatted;
  };

  exportAppDto(): CreateAppDto {
    const appNode = this.nodes.find((n) => n.type === "app");
    const appName = this.formatName(appNode?.data.name);

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
          const containerPath = vNode.data?.containerPath || "";
          const localPath = vNode.data?.localPath || "";
          const vType = vNode.data?.type || "volume";

         return vType === "bind"
          ? { path: `${localPath}:${containerPath}` }
          : { path: `/:${containerPath}`, size: vNode.data?.size || "1GB" };
        });
        
        const networks = this.nodes
          .filter((n) => connectedIds.includes(n.id) && n.type === "network")
          .map((netNode) => ({
            name: this.formatName(netNode.data.name),
            driver: netNode.data.driver,
            address: netNode.data.address,
            mask: netNode.data.mask,
            gateway: netNode.data.gateway,
          }));
  
        return {
          name: this.formatName(svc.data?.name),
          image: svc.data?.image || "",
          ports: Array.isArray(svc.data?.ports)
            ? svc.data.ports
            : typeof svc.data?.ports === "string" && svc.data?.ports.length
            ? svc.data.ports.split(",").map((p: string) => p.trim())
            : [],
          labels: Array.isArray(svc.data?.labels) ? svc.data.labels.map((l: string) => l.trim()) : [],
          volumes: volumes,
          networks,
          environment: svc.data?.environment || {},
                    
          // Comando (CMD) de Docker
          command: svc.data?.command || null,
          
          // Política de reinicio (ej: "unless-stopped", "always")
          restart_policy: svc.data?.restartPolicy || "unless-stopped",

          // Array de archivos/scripts de arranque cargados. Estructura: [{ name: string, content: string, type: string }]
          startup_scripts: svc.data?.startupScripts || []

        } as any;
      });
      
    const payload: CreateAppDto = {
      name: appName,
      services,
      hosts: appNode?.data?.hosts ?? [""],
      current_scale: appNode?.data?.actuales ?? 1,
      environment: appNode?.data?.environment ?? {},
      min_scale: appNode?.data?.minimas ?? 1,
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
