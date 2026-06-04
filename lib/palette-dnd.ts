import { NODE_TYPES, type NodeType } from "@/lib/types";

export const DRAG_NODE_TYPE_KEY = "application/suno-node-type";

let draggingNodeType: NodeType | null = null;

export function setPaletteDragNodeType(type: NodeType): void {
  draggingNodeType = type;
}

export function clearPaletteDragNodeType(): void {
  draggingNodeType = null;
}

export function readDroppedNodeType(dataTransfer: DataTransfer): NodeType | null {
  const fromCustom = dataTransfer.getData(DRAG_NODE_TYPE_KEY);
  const fromPlain = dataTransfer.getData("text/plain");
  const candidate = fromCustom || fromPlain || draggingNodeType;
  if (!candidate) return null;
  return NODE_TYPES.includes(candidate as NodeType) ? (candidate as NodeType) : null;
}
