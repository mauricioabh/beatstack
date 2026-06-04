/** Grid step — matches React Flow Background gap in Editor.tsx */
export const EDITOR_SNAP_GRID: [number, number] = [20, 20];

export const SNAP_TO_GRID_STORAGE_KEY = "beatstack-snap-to-grid";

export function snapPositionToGrid(position: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const [gridX, gridY] = EDITOR_SNAP_GRID;
  return {
    x: Math.round(position.x / gridX) * gridX,
    y: Math.round(position.y / gridY) * gridY,
  };
}

export function loadSnapToGridPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SNAP_TO_GRID_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function persistSnapToGridPreference(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SNAP_TO_GRID_STORAGE_KEY, String(enabled));
  } catch {
    /* ignore */
  }
}
