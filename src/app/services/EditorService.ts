
function isAppNodeCreated(nodes: any[]): boolean {
  return nodes.some((node) => node.type === "app");
}

export const EditorService = {
  isAppNodeCreated
};