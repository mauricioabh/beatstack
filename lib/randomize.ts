import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import type { NodeType, SunoNode } from "@/lib/types";

export const RANDOM_CUSTOM_DESCRIPTORS = [
  "heavy reverb",
  "lo-fi texture",
  "pitch-shifted",
  "granular synthesis",
  "tape saturation",
  "sidechain compression",
  "vinyl crackle",
  "stereo widening",
  "distorted bass",
  "ethereal pads",
] as const;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function pickRandomMany<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const result: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]!);
  }
  return result;
}

function randomBpm(): number {
  const steps = (180 - 70) / 10 + 1;
  const step = Math.floor(Math.random() * steps);
  return 70 + step * 10;
}

export function randomizeNodeData(type: SunoNode["type"]): Record<string, unknown> {
  switch (type) {
    case "genre":
      return { genre: pickRandom(NODE_CONFIGS.genre.options) };
    case "mood":
      return { mood: pickRandom(NODE_CONFIGS.mood.options) };
    case "instruments":
      return {
        instruments: pickRandomMany(
          NODE_CONFIGS.instruments.suggestions,
          2 + Math.floor(Math.random() * 2),
        ),
      };
    case "bpm":
      return { bpm: randomBpm() };
    case "vocals":
      return {
        gender: pickRandom(NODE_CONFIGS.vocals.gender.options),
        style: pickRandom(NODE_CONFIGS.vocals.style.options),
      };
    case "structure":
      return { structure: pickRandom(NODE_CONFIGS.structure.options) };
    case "era":
      return { era: pickRandom(NODE_CONFIGS.era.options) };
    case "custom":
      return { text: pickRandom(RANDOM_CUSTOM_DESCRIPTORS) };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function randomizeAllNodes(nodes: SunoNode[]): SunoNode[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      ...randomizeNodeData(node.type),
    },
  })) as SunoNode[];
}

export const PULSE_DURATION_MS = 600;
