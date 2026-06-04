import type { NodeType } from "@/lib/types";
import {
  bpmDataSchema,
  customDataSchema,
  eraDataSchema,
  genreDataSchema,
  instrumentsDataSchema,
  moodDataSchema,
  structureDataSchema,
  vocalsDataSchema,
} from "@/lib/types";
import { z } from "zod";

export const NODE_CONFIGS = {
  genre: {
    options: [
      "pop",
      "rock",
      "hip-hop",
      "electronic",
      "jazz",
      "classical",
      "reggaeton",
      "cumbia",
      "metal",
      "folk",
      "R&B",
      "lofi",
      "ambient",
      "drill",
      "trap",
      "bossa nova",
      "flamenco",
    ],
    default: "pop",
  },
  mood: {
    options: [
      "melancholic",
      "energetic",
      "happy",
      "dark",
      "romantic",
      "aggressive",
      "dreamy",
      "nostalgic",
      "chill",
      "epic",
      "mysterious",
      "uplifting",
      "sad",
      "intense",
    ],
    default: "energetic",
  },
  instruments: {
    type: "tags" as const,
    suggestions: [
      "acoustic guitar",
      "electric guitar",
      "bass",
      "drums",
      "piano",
      "synthesizer",
      "violin",
      "trumpet",
      "saxophone",
      "808",
      "hi-hats",
      "strings",
    ],
    default: [] as string[],
  },
  bpm: {
    min: 60,
    max: 200,
    default: 120,
    step: 1,
  },
  vocals: {
    gender: {
      options: [
        "male vocals",
        "female vocals",
        "duet",
        "choir",
        "no vocals",
        "whispered",
        "falsetto",
        "raspy",
      ],
      default: "female vocals",
    },
    style: {
      options: [
        "clean",
        "distorted",
        "auto-tune",
        "layered",
        "harmonized",
        "spoken word",
      ],
      default: "clean",
    },
  },
  structure: {
    options: [
      "[Verse][Chorus][Verse][Chorus][Bridge][Chorus]",
      "[Intro][Verse][Chorus][Outro]",
      "[Verse][Pre-Chorus][Chorus][Verse][Pre-Chorus][Chorus]",
      "[Chorus][Verse][Chorus]",
      "instrumental",
    ],
    default: "[Verse][Chorus][Verse][Chorus][Bridge][Chorus]",
  },
  era: {
    options: [
      "80s",
      "90s",
      "2000s",
      "modern",
      "vintage",
      "retro",
      "contemporary",
      "70s",
      "classic",
    ],
    default: "modern",
  },
  custom: {
    type: "text" as const,
    placeholder: "e.g. lo-fi beats, heavy reverb, distorted bass",
    default: "",
  },
} as const;

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  genre: "Genre",
  mood: "Mood",
  instruments: "Instruments",
  bpm: "BPM",
  vocals: "Vocals",
  structure: "Structure",
  era: "Era",
  custom: "Custom",
};

/** Small palette swatches in the node list */
export const NODE_TYPE_DOT_COLORS: Record<NodeType, string> = {
  genre: "bg-violet-500",
  mood: "bg-rose-500",
  instruments: "bg-amber-500",
  bpm: "bg-cyan-500",
  vocals: "bg-pink-500",
  structure: "bg-emerald-500",
  era: "bg-indigo-500",
  custom: "bg-slate-500",
};

/** Tailwind background classes for node headers (light + dark) */
export const NODE_TYPE_COLORS: Record<NodeType, string> = {
  genre: "bg-violet-600 dark:bg-violet-700",
  mood: "bg-rose-600 dark:bg-rose-700",
  instruments: "bg-amber-600 dark:bg-amber-700",
  bpm: "bg-cyan-600 dark:bg-cyan-700",
  vocals: "bg-pink-600 dark:bg-pink-700",
  structure: "bg-emerald-600 dark:bg-emerald-700",
  era: "bg-indigo-600 dark:bg-indigo-700",
  custom: "bg-slate-600 dark:bg-slate-700",
};

export const nodeDataSchemas: Record<NodeType, z.ZodType> = {
  genre: genreDataSchema,
  mood: moodDataSchema,
  instruments: instrumentsDataSchema,
  bpm: bpmDataSchema,
  vocals: vocalsDataSchema,
  structure: structureDataSchema,
  era: eraDataSchema,
  custom: customDataSchema,
};

export function getDefaultNodeData(type: NodeType): Record<string, unknown> {
  switch (type) {
    case "genre":
      return { label: NODE_TYPE_LABELS.genre, genre: NODE_CONFIGS.genre.default };
    case "mood":
      return { label: NODE_TYPE_LABELS.mood, mood: NODE_CONFIGS.mood.default };
    case "instruments":
      return {
        label: NODE_TYPE_LABELS.instruments,
        instruments: [...NODE_CONFIGS.instruments.default],
      };
    case "bpm":
      return { label: NODE_TYPE_LABELS.bpm, bpm: NODE_CONFIGS.bpm.default };
    case "vocals":
      return {
        label: NODE_TYPE_LABELS.vocals,
        gender: NODE_CONFIGS.vocals.gender.default,
        style: NODE_CONFIGS.vocals.style.default,
      };
    case "structure":
      return {
        label: NODE_TYPE_LABELS.structure,
        structure: NODE_CONFIGS.structure.default,
      };
    case "era":
      return { label: NODE_TYPE_LABELS.era, era: NODE_CONFIGS.era.default };
    case "custom":
      return {
        label: NODE_TYPE_LABELS.custom,
        text: NODE_CONFIGS.custom.default,
      };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
