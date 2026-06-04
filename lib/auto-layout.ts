import { snapPositionToGrid } from "@/lib/editor-grid";
import type { NodeType } from "@/lib/types";

const COLS = 3;
const COL_WIDTH = 280;
const ROW_HEIGHT = 140;
const ORIGIN = { x: 80, y: 80 };

export function positionForGridIndex(index: number): { x: number; y: number } {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return snapPositionToGrid({
    x: ORIGIN.x + col * COL_WIDTH,
    y: ORIGIN.y + row * ROW_HEIGHT,
  });
}

export function layoutIndexForNewTypes(
  existingTypes: NodeType[],
  newTypes: NodeType[],
): Map<NodeType, { x: number; y: number }> {
  const positions = new Map<NodeType, { x: number; y: number }>();
  const occupied = new Set(existingTypes);
  let index = existingTypes.length;

  for (const type of newTypes) {
    if (occupied.has(type)) continue;
    positions.set(type, positionForGridIndex(index));
    occupied.add(type);
    index += 1;
  }

  return positions;
}
