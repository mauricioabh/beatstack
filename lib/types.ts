import type { Node, Edge } from "@xyflow/react";
import { z } from "zod";

export const NODE_TYPES = [
  "genre",
  "mood",
  "instruments",
  "bpm",
  "vocals",
  "structure",
  "era",
  "custom",
] as const;

export type NodeType = (typeof NODE_TYPES)[number];

export const genreDataSchema = z.object({
  genre: z.string(),
});

export const moodDataSchema = z.object({
  mood: z.string(),
});

export const instrumentsDataSchema = z.object({
  instruments: z.array(z.string()),
});

export const bpmDataSchema = z.object({
  bpm: z.number().min(60).max(200),
});

export const vocalsDataSchema = z.object({
  gender: z.string(),
  style: z.string(),
});

export const structureDataSchema = z.object({
  structure: z.string(),
});

export const eraDataSchema = z.object({
  era: z.string(),
});

export const customDataSchema = z.object({
  text: z.string(),
});

export type GenreNodeData = z.infer<typeof genreDataSchema> & {
  label: string;
};
export type MoodNodeData = z.infer<typeof moodDataSchema> & { label: string };
export type InstrumentsNodeData = z.infer<typeof instrumentsDataSchema> & {
  label: string;
};
export type BpmNodeData = z.infer<typeof bpmDataSchema> & { label: string };
export type VocalsNodeData = z.infer<typeof vocalsDataSchema> & {
  label: string;
};
export type StructureNodeData = z.infer<typeof structureDataSchema> & {
  label: string;
};
export type EraNodeData = z.infer<typeof eraDataSchema> & { label: string };
export type CustomNodeData = z.infer<typeof customDataSchema> & {
  label: string;
};

export type SunoNodeData =
  | GenreNodeData
  | MoodNodeData
  | InstrumentsNodeData
  | BpmNodeData
  | VocalsNodeData
  | StructureNodeData
  | EraNodeData
  | CustomNodeData;

export type SunoNode =
  | Node<GenreNodeData, "genre">
  | Node<MoodNodeData, "mood">
  | Node<InstrumentsNodeData, "instruments">
  | Node<BpmNodeData, "bpm">
  | Node<VocalsNodeData, "vocals">
  | Node<StructureNodeData, "structure">
  | Node<EraNodeData, "era">
  | Node<CustomNodeData, "custom">;

export type SunoEdge = Edge;

export type GraphPreset = {
  nodes: SunoNode[];
  edges: SunoEdge[];
  savedAt?: number;
};

export type PresetsMap = Record<string, GraphPreset>;

export const PRESETS_STORAGE_KEY = "suno-prompt-builder-presets";

export type PromptHistoryEntry = {
  id: string;
  prompt: string;
  createdAt: number;
};

export const PROMPT_HISTORY_STORAGE_KEY = "beatstack-prompt-history";
export const PROMPT_HISTORY_MAX = 20;

export type ExportedGraphFile = {
  name: string;
  createdAt: string;
  nodes: SunoNode[];
  edges: SunoEdge[];
};
