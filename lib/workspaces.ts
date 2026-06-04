import type { SunoEdge, SunoNode } from "@/lib/types";

export const WORKSPACES_STORAGE_KEY = "beatstack_workspaces";

export type WorkspaceItem = {
  id: string;
  name: string;
  stylePrompt: string;
  lyrics: string;
  nodeGraph: { nodes: SunoNode[]; edges: SunoEdge[] };
  createdAt: number;
};

export type Workspace = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  items: WorkspaceItem[];
  /** Overrides auto cover; use with coverStyleFromSeed / WorkspaceCoverArt. */
  coverSeed?: string;
  /** Custom cover image (data URL), shown instead of generated art. */
  coverImage?: string;
};

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadWorkspaces(): Workspace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Workspace[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistWorkspaces(workspaces: Workspace[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
}

export function notifyWorkspacesUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("beatstack:workspaces-updated"));
}

export function createWorkspace(name: string): Workspace {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Workspace name is required");
  const now = Date.now();
  const workspace: Workspace = {
    id: generateId(),
    name: trimmed,
    createdAt: now,
    updatedAt: now,
    items: [],
  };
  const workspaces = [...loadWorkspaces(), workspace];
  persistWorkspaces(workspaces);
  notifyWorkspacesUpdated();
  return workspace;
}

export function getWorkspace(id: string): Workspace | undefined {
  return loadWorkspaces().find((w) => w.id === id);
}

export function updateWorkspace(workspace: Workspace): void {
  const workspaces = loadWorkspaces().map((w) =>
    w.id === workspace.id ? workspace : w,
  );
  persistWorkspaces(workspaces);
  notifyWorkspacesUpdated();
}

export type WorkspaceCoverPatch = {
  coverSeed?: string;
  coverImage?: string | null;
};

export function setWorkspaceCover(
  workspaceId: string,
  patch: WorkspaceCoverPatch,
): boolean {
  const workspace = getWorkspace(workspaceId);
  if (!workspace) return false;

  const next: Workspace = { ...workspace };
  if (patch.coverSeed !== undefined) {
    if (patch.coverSeed) next.coverSeed = patch.coverSeed;
    else delete next.coverSeed;
  }
  if (patch.coverImage !== undefined) {
    if (patch.coverImage) next.coverImage = patch.coverImage;
    else delete next.coverImage;
  }
  updateWorkspace(next);
  return true;
}

export function deleteWorkspace(id: string): void {
  const workspaces = loadWorkspaces().filter((w) => w.id !== id);
  persistWorkspaces(workspaces);
  notifyWorkspacesUpdated();
}

export function addItemToWorkspace(
  workspaceId: string,
  item: Omit<WorkspaceItem, "id" | "createdAt"> & { id?: string },
): WorkspaceItem | null {
  const workspaces = loadWorkspaces();
  const index = workspaces.findIndex((w) => w.id === workspaceId);
  if (index === -1) return null;

  const now = Date.now();
  const newItem: WorkspaceItem = {
    id: item.id ?? generateId(),
    name: item.name.trim() || "Untitled",
    stylePrompt: item.stylePrompt,
    lyrics: item.lyrics,
    nodeGraph: {
      nodes: structuredClone(item.nodeGraph.nodes),
      edges: structuredClone(item.nodeGraph.edges),
    },
    createdAt: now,
  };

  const workspace = workspaces[index]!;
  workspace.items = [newItem, ...workspace.items];
  workspace.updatedAt = now;
  workspaces[index] = workspace;
  persistWorkspaces(workspaces);
  notifyWorkspacesUpdated();
  return newItem;
}

export function deleteWorkspaceItem(
  workspaceId: string,
  itemId: string,
): boolean {
  const workspaces = loadWorkspaces();
  const index = workspaces.findIndex((w) => w.id === workspaceId);
  if (index === -1) return false;

  const workspace = workspaces[index]!;
  const nextItems = workspace.items.filter((i) => i.id !== itemId);
  if (nextItems.length === workspace.items.length) return false;

  workspace.items = nextItems;
  workspace.updatedAt = Date.now();
  workspaces[index] = workspace;
  persistWorkspaces(workspaces);
  notifyWorkspacesUpdated();
  return true;
}

/** First three words of a prompt for default item name. */
export function defaultItemNameFromPrompt(stylePrompt: string): string {
  const words = stylePrompt.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "Untitled";
  return words.slice(0, 3).join(" ");
}
