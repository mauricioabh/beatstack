"use client";

import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
} from "@xyflow/react";
import { create } from "zustand";
import { assemblePrompt } from "@/lib/prompt";
import { getDefaultNodeData } from "@/lib/nodeConfigs";
import type {
  NodeType,
  PresetsMap,
  SunoEdge,
  SunoNode,
} from "@/lib/types";
import {
  loadSnapToGridPreference,
  snapPositionToGrid,
} from "@/lib/editor-grid";
import { PRESETS_STORAGE_KEY } from "@/lib/types";
import type { AiNodeConfig } from "@/lib/ai-config";
import { layoutIndexForNewTypes } from "@/lib/auto-layout";
import { hasNodeTypeOnCanvas } from "@/lib/graph-utils";
import { BEATSTACK_EDGE_STYLE } from "@/lib/edge-style";
import {
  PULSE_DURATION_MS,
  randomizeAllNodes,
} from "@/lib/randomize";

const MAX_UNDO_STACK = 50;
const EDGE_ANIMATION_MS = 800;
const LYRICS_STORAGE_KEY = "beatstack_lyrics";

type GraphSnapshot = {
  nodes: SunoNode[];
  edges: SunoEdge[];
};

let edgeAnimationTimer: ReturnType<typeof setTimeout> | undefined;

function cloneGraphSnapshot(nodes: SunoNode[], edges: SunoEdge[]): GraphSnapshot {
  return {
    nodes: structuredClone(nodes),
    edges: structuredClone(edges),
  };
}

function scheduleEdgeAnimation(
  set: (partial: Partial<EditorState>) => void,
): void {
  set({ edgesAnimating: true });
  if (edgeAnimationTimer) clearTimeout(edgeAnimationTimer);
  edgeAnimationTimer = setTimeout(() => {
    set({ edgesAnimating: false });
  }, EDGE_ANIMATION_MS);
}

function loadPresetsFromStorage(): PresetsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PresetsMap;
  } catch {
    return {};
  }
}

function persistPresets(presets: PresetsMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
}

function loadGeneratedLyricsFromStorage(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(LYRICS_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function persistGeneratedLyrics(lyrics: string): void {
  if (typeof window === "undefined") return;
  try {
    if (lyrics.trim()) {
      localStorage.setItem(LYRICS_STORAGE_KEY, lyrics);
    } else {
      localStorage.removeItem(LYRICS_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

function recomputePrompt(nodes: SunoNode[], edges: SunoEdge[]): string {
  return assemblePrompt(nodes, edges);
}

let nodeIdCounter = 0;

function generateNodeId(): string {
  nodeIdCounter += 1;
  return `node_${Date.now()}_${nodeIdCounter}`;
}

function syncNodeIdCounter(nodes: SunoNode[]): void {
  for (const node of nodes) {
    const match = /_(\d+)$/.exec(node.id);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!Number.isNaN(num) && num >= nodeIdCounter) {
        nodeIdCounter = num;
      }
    }
  }
}

type LyricsField =
  | "lyricsTheme"
  | "lyricsLanguage"
  | "lyricsTone"
  | "lyricsStructure";

type EditorState = {
  nodes: SunoNode[];
  edges: SunoEdge[];
  computedPrompt: string;
  presets: PresetsMap;
  snapToGrid: boolean;
  edgesAnimating: boolean;
  undoStack: GraphSnapshot[];
  pulsingNodeIds: string[];
  lyricsTheme: string;
  lyricsLanguage: string;
  lyricsTone: string;
  lyricsStructure: string;
  generatedLyrics: string;
  setSnapToGrid: (enabled: boolean) => void;
  pushUndo: () => void;
  undo: () => void;
  canUndo: () => boolean;
  onNodesChange: (changes: NodeChange<SunoNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<SunoEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeDragStart: () => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => boolean;
  updateNodeData: (id: string, patch: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => boolean;
  deletePreset: (name: string) => void;
  refreshPresets: () => void;
  setGraph: (nodes: SunoNode[], edges: SunoEdge[]) => void;
  replaceGraph: (nodes: SunoNode[], edges: SunoEdge[]) => void;
  randomizeGraph: () => void;
  applyAiConfiguration: (config: AiNodeConfig) => void;
  triggerNodePulse: (nodeIds: string[]) => void;
  setLyricsField: (field: LyricsField, value: string) => void;
  setGeneratedLyrics: (lyrics: string) => void;
  clearLyrics: () => void;
  loadWorkspaceItem: (payload: {
    nodes: SunoNode[];
    edges: SunoEdge[];
    lyrics: string;
  }) => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],
  computedPrompt: "",
  presets: {},
  snapToGrid: loadSnapToGridPreference(),
  edgesAnimating: false,
  undoStack: [],
  pulsingNodeIds: [],
  lyricsTheme: "",
  lyricsLanguage: "Spanish",
  lyricsTone: "metaphorical",
  lyricsStructure: "Standard",
  generatedLyrics: loadGeneratedLyricsFromStorage(),

  setLyricsField: (field, value) => {
    set({ [field]: value });
  },

  setGeneratedLyrics: (lyrics) => {
    persistGeneratedLyrics(lyrics);
    set({ generatedLyrics: lyrics });
  },

  clearLyrics: () => {
    persistGeneratedLyrics("");
    set({ generatedLyrics: "" });
  },

  loadWorkspaceItem: ({ nodes, edges, lyrics }) => {
    get().replaceGraph(nodes, edges);
    get().setGeneratedLyrics(lyrics);
  },

  triggerNodePulse: (nodeIds) => {
    set({ pulsingNodeIds: nodeIds });
    setTimeout(() => {
      if (get().pulsingNodeIds.length > 0) {
        set({ pulsingNodeIds: [] });
      }
    }, PULSE_DURATION_MS);
  },

  pushUndo: () => {
    const { nodes, edges, undoStack } = get();
    const snapshot = cloneGraphSnapshot(nodes, edges);
    set({
      undoStack: [...undoStack.slice(-(MAX_UNDO_STACK - 1)), snapshot],
    });
  },

  undo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return;
    const snapshot = undoStack[undoStack.length - 1]!;
    set({
      undoStack: undoStack.slice(0, -1),
      nodes: structuredClone(snapshot.nodes),
      edges: structuredClone(snapshot.edges),
      computedPrompt: recomputePrompt(snapshot.nodes, snapshot.edges),
    });
    scheduleEdgeAnimation(set);
  },

  canUndo: () => get().undoStack.length > 0,

  setSnapToGrid: (enabled) => {
    set((state) => {
      if (!enabled) {
        return { snapToGrid: false };
      }
      const nodes = state.nodes.map((node) => ({
        ...node,
        position: snapPositionToGrid(node.position),
      }));
      return {
        snapToGrid: true,
        nodes,
        computedPrompt: recomputePrompt(nodes, state.edges),
      };
    });
  },

  onNodesChange: (changes) => {
    const shouldUndo = changes.some(
      (c) => c.type === "remove" || c.type === "add",
    );
    if (shouldUndo) get().pushUndo();

    set((state) => {
      const nodes = applyNodeChanges(changes, state.nodes) as SunoNode[];
      scheduleEdgeAnimation(set);
      return {
        nodes,
        computedPrompt: recomputePrompt(nodes, state.edges),
      };
    });
  },

  onEdgesChange: (changes) => {
    const shouldUndo = changes.some((c) => c.type === "remove");
    if (shouldUndo) get().pushUndo();

    set((state) => {
      const edges = applyEdgeChanges(changes, state.edges) as SunoEdge[];
      scheduleEdgeAnimation(set);
      return {
        edges,
        computedPrompt: recomputePrompt(state.nodes, edges),
      };
    });
  },

  onConnect: (connection) => {
    get().pushUndo();
    set((state) => {
      const edges = addEdge(
        {
          ...connection,
          id: `edge_${connection.source}_${connection.target}`,
          animated: true,
          style: BEATSTACK_EDGE_STYLE,
        },
        state.edges,
      ) as SunoEdge[];
      scheduleEdgeAnimation(set);
      return {
        edges,
        computedPrompt: recomputePrompt(state.nodes, edges),
      };
    });
  },

  onNodeDragStart: () => {
    get().pushUndo();
  },

  addNode: (type, position) => {
    if (hasNodeTypeOnCanvas(get().nodes, type)) {
      return false;
    }

    get().pushUndo();
    const id = generateNodeId();
    const data = getDefaultNodeData(type);
    const snappedPosition = get().snapToGrid
      ? snapPositionToGrid(position)
      : position;
    const newNode = {
      id,
      type,
      position: snappedPosition,
      data,
    } as SunoNode;

    set((state) => {
      const nodes = [...state.nodes, newNode];
      scheduleEdgeAnimation(set);
      return {
        nodes,
        computedPrompt: recomputePrompt(nodes, state.edges),
      };
    });
    return true;
  },

  updateNodeData: (id, patch) => {
    set((state) => {
      const nodes = state.nodes.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          data: { ...node.data, ...patch },
        } as SunoNode;
      });
      return {
        nodes,
        computedPrompt: recomputePrompt(nodes, state.edges),
      };
    });
  },

  deleteNode: (id) => {
    get().pushUndo();
    set((state) => {
      const nodes = state.nodes.filter((n) => n.id !== id);
      const edges = state.edges.filter(
        (e) => e.source !== id && e.target !== id,
      );
      scheduleEdgeAnimation(set);
      return {
        nodes,
        edges,
        computedPrompt: recomputePrompt(nodes, edges),
      };
    });
  },

  savePreset: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { nodes, edges } = get();
    const presets = {
      ...get().presets,
      [trimmed]: { nodes, edges, savedAt: Date.now() },
    };
    persistPresets(presets);
    set({ presets });
  },

  loadPreset: (name) => {
    const preset = get().presets[name];
    if (!preset) return false;
    get().pushUndo();
    syncNodeIdCounter(preset.nodes);
    const snapToGrid = get().snapToGrid;
    const nodes = snapToGrid
      ? preset.nodes.map((node) => ({
          ...node,
          position: snapPositionToGrid(node.position),
        }))
      : preset.nodes;
    set({
      nodes,
      edges: preset.edges,
      computedPrompt: recomputePrompt(nodes, preset.edges),
    });
    scheduleEdgeAnimation(set);
    return true;
  },

  deletePreset: (name) => {
    const presets = { ...get().presets };
    delete presets[name];
    persistPresets(presets);
    set({ presets });
  },

  refreshPresets: () => {
    set({ presets: loadPresetsFromStorage() });
  },

  setGraph: (nodes, edges) => {
    get().pushUndo();
    syncNodeIdCounter(nodes);
    set({
      nodes,
      edges,
      computedPrompt: recomputePrompt(nodes, edges),
    });
    scheduleEdgeAnimation(set);
  },

  replaceGraph: (nodes, edges) => {
    syncNodeIdCounter(nodes);
    const snapToGrid = get().snapToGrid;
    const resolvedNodes = snapToGrid
      ? nodes.map((node) => ({
          ...node,
          position: snapPositionToGrid(node.position),
        }))
      : nodes;
    set({
      nodes: resolvedNodes,
      edges,
      computedPrompt: recomputePrompt(resolvedNodes, edges),
    });
    scheduleEdgeAnimation(set);
  },

  randomizeGraph: () => {
    const { nodes, edges } = get();
    if (nodes.length === 0) return;
    get().pushUndo();
    const randomized = randomizeAllNodes(nodes);
    set({
      nodes: randomized,
      computedPrompt: recomputePrompt(randomized, edges),
    });
    get().triggerNodePulse(randomized.map((n) => n.id));
    scheduleEdgeAnimation(set);
  },

  applyAiConfiguration: (config) => {
    get().pushUndo();
    const state = get();
    let nodes = [...state.nodes];
    let edges = [...state.edges];

    const desiredTypes = (
      [
        config.genre !== undefined ? "genre" : null,
        config.mood !== undefined ? "mood" : null,
        config.instruments !== undefined ? "instruments" : null,
        config.bpm !== undefined ? "bpm" : null,
        config.vocals !== undefined ? "vocals" : null,
        config.structure !== undefined ? "structure" : null,
        config.era !== undefined ? "era" : null,
        config.custom !== undefined ? "custom" : null,
      ] as const
    ).filter((t): t is NodeType => t !== null);

    const missing = desiredTypes.filter(
      (t) => !hasNodeTypeOnCanvas(nodes, t),
    );
    const positions = layoutIndexForNewTypes(
      nodes.map((n) => n.type),
      missing,
    );

    for (const type of missing) {
      const id = generateNodeId();
      const data = getDefaultNodeData(type);
      const position = positions.get(type) ?? { x: 80, y: 80 };
      const snappedPosition = state.snapToGrid
        ? snapPositionToGrid(position)
        : position;
      nodes.push({
        id,
        type,
        position: snappedPosition,
        data,
      } as SunoNode);
    }

    nodes = nodes.map((node) => {
      switch (node.type) {
        case "genre":
          if (config.genre !== undefined) {
            return { ...node, data: { ...node.data, genre: config.genre } };
          }
          break;
        case "mood":
          if (config.mood !== undefined) {
            return { ...node, data: { ...node.data, mood: config.mood } };
          }
          break;
        case "instruments":
          if (config.instruments !== undefined) {
            return {
              ...node,
              data: { ...node.data, instruments: config.instruments },
            };
          }
          break;
        case "bpm":
          if (config.bpm !== undefined) {
            return { ...node, data: { ...node.data, bpm: config.bpm } };
          }
          break;
        case "vocals":
          if (config.vocals) {
            return {
              ...node,
              data: {
                ...node.data,
                ...(config.vocals.gender !== undefined
                  ? { gender: config.vocals.gender }
                  : {}),
                ...(config.vocals.style !== undefined
                  ? { style: config.vocals.style }
                  : {}),
              },
            };
          }
          break;
        case "structure":
          if (config.structure !== undefined) {
            return {
              ...node,
              data: { ...node.data, structure: config.structure },
            };
          }
          break;
        case "era":
          if (config.era !== undefined) {
            return { ...node, data: { ...node.data, era: config.era } };
          }
          break;
        case "custom":
          if (config.custom !== undefined) {
            return { ...node, data: { ...node.data, text: config.custom } };
          }
          break;
      }
      return node;
    }) as SunoNode[];

    set({
      nodes,
      edges,
      computedPrompt: recomputePrompt(nodes, edges),
    });
    get().triggerNodePulse(nodes.map((n) => n.id));
    scheduleEdgeAnimation(set);
  },
}));
