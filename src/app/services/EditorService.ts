import { get } from "http";
import { rules } from "../../lib/helper/EditorRules";
import { Edge } from "reactflow";

function isAppNodeCreated(nodes: any[]): boolean {
  return nodes.some((node) => node.type === "app");
}


// Validates if the current node's connections adhere to the defined rules.
function isNodeValid(nodes: any[], currentNode: any): boolean {
  const nodeType = currentNode.type;
  return rules.some((rule) => {
    if (rule.type === nodeType) {
      const connectedNodes = nodes.filter((node) =>
        currentNode.edges?.some((edge: any) => edge.source === node.id || edge.target === node.id)
      );
      return connectedNodes.every((connectedNode) =>
        rule.possibleConnectionTypes.includes(connectedNode.type)
      );
    }
  });
}

// Returns the list of node types that can be added connected to the given target node.
// Filters out "app" if an app already exists in the graph.
function getAllowedAddTypesForTarget(nodes: any[], targetNode: any): string[] {
  if (!targetNode) return [];

  const rule = rules.find((r) => r.type === targetNode.type);
  if (!rule || !Array.isArray(rule.possibleConnectionTypes)) return [];

  const allowed = [...rule.possibleConnectionTypes];

  // globally disallow adding another 'app' if one exists
  if (isAppNodeCreated(nodes)) {
    const idx = allowed.indexOf("app");
    if (idx !== -1) allowed.splice(idx, 1);
  }

  return allowed;
}

function getNetworkNamesBySelectedNode(selectedNode: any, edges: Edge[], nodes: any[]): string[] {
  if (!selectedNode) return [];
  //1. Get edges connected to the selected node
  const connectedEdges = edges.filter((edge: Edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  //2  From edges connected Get nodes where id is in edge and type is network
  const networkIds = connectedEdges.map((edge: Edge) => {
    const networkNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
    return networkNodeId;
  });
  //3  Return names of networks
  const networkNames = nodes
    .filter((node) => networkIds.includes(node.id) && node.type === "network")
    .map((networkNode) => networkNode.data || networkNode.id);

  return networkNames;
}

function getVolumeNamesBySelectedNode(selectedNode: any, edges: Edge[], nodes: any[]): string[] {
  if (!selectedNode) return [];
  //1. Get edges connected to the selected node
 const connectedEdges = edges.filter((edge: Edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  //2  From edges connected Get nodes where id is in edge and type is volume
  const volumeIds = connectedEdges.map((edge: Edge) => {
  const volumeNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
    return volumeNodeId;
  });
  //3  Return names of volumes
  const volumeNames = nodes
    .filter((node) => volumeIds.includes(node.id) && node.type === "volume")
    .map((volumeNode) => volumeNode.data || volumeNode.id);
  
  return volumeNames;
}

function getServicesConnectedToApp(selectedNode: any, edges: Edge[], nodes: any[]): string[] {
  if (!selectedNode) return [];
  //1. Get edges connected to the selected node
  const connectedEdges = edges.filter((edge: Edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  //2  From edges connected Get nodes where id is in edge and type is service
  const serviceIds = connectedEdges.map((edge: Edge) => {
    const serviceNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
    return serviceNodeId;
  });
  //3  Return names of services
  const serviceNames = nodes
    .filter((node) => serviceIds.includes(node.id) && node.type === "service")
    .map((serviceNode) => serviceNode.data || serviceNode.id);
  
  return serviceNames;
}

export const EditorService = {
  isAppNodeCreated,
  isNodeValid,
  getAllowedAddTypesForTarget,
  getNetworkNamesBySelectedNode,
  getVolumeNamesBySelectedNode,
  getServicesConnectedToApp
};