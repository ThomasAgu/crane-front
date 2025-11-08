import { Node, Edge } from "reactflow";
import { rules } from "../../lib/helper/EditorRules";
import { dockerDefaults } from "../../lib/helper/DockerDefaults";
import { CreateAppDto } from "../../lib/dto/AppDto";
class EditorStateService {
  private nodes: Node[] = [];
  private edges: Edge[] = [];

  setNodes(nodes: Node[]) {
    this.nodes = nodes;
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }

  setEdges(edges: Edge[]) {
    this.edges = edges;
  }

  updateState(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  isAppNodeCreated(): boolean {
    return this.nodes.some((node) => node.type === "app");
  }

  getNodeById(nodeId: string) {
    return this.nodes.find(n => n.id === nodeId);
  }

  // merge partial data into node.data and update internal nodes array
  setNodeData(nodeId: string, partialData: Record<string, any>) {
    const idx = this.nodes.findIndex(n => n.id === nodeId);
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

  // apply known docker image defaults (ports, volumes, networks) to node data
  applyImageDefaultsToNode(nodeId: string, imageName: string) {
    const defaults = dockerDefaults[imageName];
    if (!defaults) return { nodes: this.nodes, edges: this.edges };

    const node = this.getNodeById(nodeId);
    if (!node) return { nodes: this.nodes, edges: this.edges };

    // Apply ports and image to node data
    node.data = {
      ...(node.data || {}),
      image: imageName,
      //ports: defaults.ports ?? node.data?.ports,
    };

    // Helper to find existing node by type + predicate
    const findNode = (type: string, pred: (n: Node) => boolean) =>
      this.nodes.find((n) => n.type === type && pred(n));

    // Create helper to add node
    const createNode = (type: string, data: Record<string, any>, position?: { x: number; y: number }) => {
      const id = `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const nodeName = data.name || this.getNodeNewNamesByType(type);
      const newNode: Node = {
        id,
        type,
        data: { ...(data || {}), name: nodeName },
        position: position || { x: (node.position?.x || 0) + 120, y: (node.position?.y || 0) + (this.nodes.length % 200) },
      } as any;
      this.nodes.push(newNode);
      return newNode;
    };

    // Ensure volumes exist and connect
    
    /*if (Array.isArray(defaults.volumes)) {
      defaults.volumes.forEach((vol: string) => {
        // try to find a volume with same containerPath or name
        let volNode = findNode("volume", (n) =>
          (n.data?.containerPath && n.data.containerPath === vol) || (n.data?.name && n.data.name === vol)
        );

        if (!volNode) {
          volNode = createNode("volume", { containerPath: vol, localPath: "", size: 20 });
        }

        // add edge if not exists (service -> volume)
        const existsEdge = this.edges.some((e) => (e.source === nodeId && e.target === volNode!.id) || (e.source === volNode!.id && e.target === nodeId));
        if (!existsEdge) {
          this.edges.push({ id: `e-${Date.now()}-${Math.floor(Math.random() * 1000)}`, source: nodeId, target: volNode.id, type: "default" } as any);
        }
      });
    }*/

    // Ensure networks exist and connect
    /*if (Array.isArray(defaults.networks)) {
      defaults.networks.forEach((netName: string) => {
        let netNode = findNode("network", (n) => (n.data?.name && n.data.name === netName) || (n.data?.address && n.data.address === netName));
        if (!netNode) {
          netNode = createNode("network", { address: "", mask: 24 });
        }

        const existsEdge = this.edges.some((e) => (e.source === nodeId && e.target === netNode!.id) || (e.source === netNode!.id && e.target === nodeId));
        if (!existsEdge) {
          this.edges.push({ id: `e-${Date.now()}-${Math.floor(Math.random() * 1000)}`, source: nodeId, target: netNode.id, type: "default" } as any);
        }
      });
    }*/

    return { nodes: this.nodes, edges: this.edges };
  }

  getNodeNewNamesByType(type: string): string {
    const prefix = type.charAt(0).toUpperCase() + type.slice(1);
    const existingNodes = this.nodes.filter((n) => n.type === type);
    const existingNames = existingNodes.map((n) => (n.data?.name ? String(n.data.name) : ""));
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
          this.edges.some((edge) => edge.source === node.id || edge.target === node.id)
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

  getNetworkDataBySelectedNode(selectedNode: Node): string[] {
    if (!selectedNode) return [];

    
    const connectedEdges = this.edges.filter((edge) => 
      edge.source === selectedNode.id || edge.target === selectedNode.id
    );

    const networkIds = connectedEdges.map((edge) => 
      edge.source === selectedNode.id ? edge.target : edge.source
    );
  
    return this.nodes
      .filter((node) => networkIds.includes(node.id) && node.type === "network")
      .map((networkNode) => networkNode.data);
  }

  getVolumeNamesBySelectedNode(selectedNode: Node): string[] {
    if (!selectedNode) return [];
    
    const connectedEdges = this.getEdges().filter((edge) => 
      edge.source === selectedNode.id || edge.target === selectedNode.id
    );

    const volumeIds = connectedEdges.map((edge) => 
      edge.source === selectedNode.id ? edge.target : edge.source
    );

    return this.nodes
      .filter((node) => volumeIds.includes(node.id) && node.type === "volume")
      .map((volumeNode) => volumeNode.data);
  }

  getServicesConnectedToApp(selectedNode: Node): string[] {
    if (!selectedNode) return [];
    
    const connectedEdges = this.edges.filter((edge) => 
      edge.source === selectedNode.id || edge.target === selectedNode.id
    );

    const serviceIds = connectedEdges.map((edge) => 
      edge.source === selectedNode.id ? edge.target : edge.source
    );

    return this.nodes
      .filter((node) => serviceIds.includes(node.id) && node.type === "service")
      .map((serviceNode) => serviceNode.data);
  }

  // Build a CreateAppDto from current nodes/edges
  exportAppDto(): CreateAppDto {
    const appNode = this.nodes.find((n) => n.type === "app");
    const appName = appNode?.data?.name || "Generated App";

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
          .map((net) => net.data?.name || net.data?.address || net.id);

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
    debugger
    const payload: CreateAppDto = {
      name: appName,
      services,
      hosts: appNode?.data?.hosts ?? [''],
      current_scale: appNode?.data?.actuales ?? 1,
      min_scale: appNode?.data?.minimas ?? 0,
      max_scale: appNode?.data?.maximas ?? 2,
      user_id: appNode?.data?.user_id ?? null,
    };

    return payload;
  }

  // Generate a simple Makefile that posts the JSON payload to API (editable)
  generateMakefileFromApp(appDto: CreateAppDto, apiUrl = "http://localhost:8000/api/apps"): string {
    const json = JSON.stringify(appDto, null, 2);
    // Produce a Makefile with a 'deploy' target that posts the JSON using curl
    return [
      "# Auto-generated Makefile",
      "",
      "APP_JSON := $(PWD)/generated_app.json",
      "",
      "write-json:",
      "\t@cat > $(APP_JSON) <<'JSON'",
      json.split("\n").map((l) => `\t${l}`).join("\n"),
      "\tJSON",
      "",
      "deploy: write-json",
      `\t@echo "Deploying $(APP_JSON) to ${apiUrl}"`,
      `\t@curl -s -X POST -H "Content-Type: application/json" --data-binary @$(APP_JSON) ${apiUrl} | jq . || echo "curl failed"`,
      "",
      ".PHONY: write-json deploy",
    ].join("\n");
  }
}

export const editorService = new EditorStateService();