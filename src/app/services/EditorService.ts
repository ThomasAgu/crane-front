import { rules } from "../../lib/helper/EditorRules";

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

export const EditorService = {
  isAppNodeCreated,
  isNodeValid,
  getAllowedAddTypesForTarget
};