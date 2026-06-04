import type { NodeType, SunoNode } from "@/lib/types";

export function hasNodeTypeOnCanvas(
  nodes: SunoNode[],
  type: NodeType,
): boolean {
  return nodes.some((node) => node.type === type);
}

export function getUsedNodeTypes(nodes: SunoNode[]): Set<NodeType> {
  const used = new Set<NodeType>();
  for (const node of nodes) {
    if (node.type) used.add(node.type as NodeType);
  }
  return used;
}
