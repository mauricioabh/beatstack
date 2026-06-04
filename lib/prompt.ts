import type { SunoEdge, SunoNode } from "@/lib/types";

function formatNodeSegment(node: SunoNode): string | null {
  switch (node.type) {
    case "genre":
      return node.data.genre;
    case "mood":
      return node.data.mood;
    case "instruments": {
      const tags = node.data.instruments;
      if (!tags.length) return null;
      return tags.join(", ");
    }
    case "bpm":
      return `${node.data.bpm} BPM`;
    case "vocals": {
      const { gender, style } = node.data;
      if (gender === "no vocals") return gender;

      const parts: string[] = [];
      if (gender.endsWith(" vocals")) {
        parts.push(gender.slice(0, -" vocals".length));
      } else {
        parts.push(gender);
      }
      if (style !== "clean") {
        parts.push(style);
      }
      parts.push("vocals");

      return parts.join(" ");
    }
    case "structure":
      return node.data.structure;
    case "era":
      return node.data.era;
    case "custom": {
      const text = node.data.text.trim();
      return text.length > 0 ? text : null;
    }
    default: {
      const _exhaustive: never = node;
      return _exhaustive;
    }
  }
}

/**
 * Kahn topological sort. Falls back to creation order if cycle detected.
 */
function topologicalOrder(nodes: SunoNode[], edges: SunoEdge[]): string[] {
  const nodeIds = nodes.map((n) => n.id);
  const idSet = new Set(nodeIds);
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  for (const edge of edges) {
    if (!idSet.has(edge.source) || !idSet.has(edge.target)) continue;
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const id of nodeIds) {
    if ((inDegree.get(id) ?? 0) === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    sorted.push(current);

    for (const neighbor of adjacency.get(current) ?? []) {
      const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, nextDegree);
      if (nextDegree === 0) queue.push(neighbor);
    }
  }

  if (sorted.length !== nodeIds.length) {
    return nodeIds;
  }

  return sorted;
}

export function assemblePrompt(nodes: SunoNode[], edges: SunoEdge[]): string {
  if (nodes.length === 0) return "";

  const connectedIds = new Set<string>();
  for (const edge of edges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }

  const connectedNodes = nodes.filter((n) => connectedIds.has(n.id));
  const disconnectedNodes = nodes.filter((n) => !connectedIds.has(n.id));

  const topoIds = topologicalOrder(connectedNodes, edges);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  const orderedNodes: SunoNode[] = [];

  for (const id of topoIds) {
    const node = nodeById.get(id);
    if (node && connectedIds.has(id)) orderedNodes.push(node);
  }

  for (const node of disconnectedNodes) {
    orderedNodes.push(node);
  }

  const structureNodes: SunoNode[] = [];
  const otherNodes: SunoNode[] = [];

  for (const node of orderedNodes) {
    if (node.type === "structure") {
      structureNodes.push(node);
    } else {
      otherNodes.push(node);
    }
  }

  const segments: string[] = [];

  for (const node of otherNodes) {
    const segment = formatNodeSegment(node);
    if (segment) segments.push(segment);
  }

  for (const node of structureNodes) {
    const segment = formatNodeSegment(node);
    if (segment) segments.push(segment);
  }

  return segments.join(", ");
}
