import { Node, Edge } from "reactflow";
import { rules } from "../../lib/helper/EditorRules";
import { dockerDefaults } from "../../lib/helper/DockerDefaults";

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
    if (!defaults) return;
    const node = this.getNodeById(nodeId);
    if (!node) return;

    const merged = {
      ...(node.data || {}),
      image: imageName,
      ports: defaults.ports ?? node.data?.ports,
      volumes: defaults.volumes ?? node.data?.volumes,
      networks: defaults.networks ?? node.data?.networks,
    };

    this.setNodeData(nodeId, merged);
    return { nodes: this.nodes, edges: this.edges };
  }

  getNodeNewNamesByType(type: string): string {
  const existingNodes = this.getNodes().filter(node => node.type === type);
  const existingNames = existingNodes.map((node, index) =>  node.data?.name || `network ${index + 1}`);
  let counter = 1;
  let newName = `${type} ${counter}`;
  
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${type} ${counter}`;
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
}

export const editorService = new EditorStateService();