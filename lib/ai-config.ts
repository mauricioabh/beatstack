import { z } from "zod";
import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import { NODE_TYPES, type NodeType } from "@/lib/types";

const genreOptions = NODE_CONFIGS.genre.options as unknown as [
  string,
  ...string[],
];
const moodOptions = NODE_CONFIGS.mood.options as unknown as [
  string,
  ...string[],
];
const structureOptions = NODE_CONFIGS.structure.options as unknown as [
  string,
  ...string[],
];
const eraOptions = NODE_CONFIGS.era.options as unknown as [
  string,
  ...string[],
];
const vocalGenderOptions = NODE_CONFIGS.vocals.gender.options as unknown as [
  string,
  ...string[],
];
const vocalStyleOptions = NODE_CONFIGS.vocals.style.options as unknown as [
  string,
  ...string[],
];

export const aiNodeConfigSchema = z
  .object({
    genre: z.enum(genreOptions).optional(),
    mood: z.enum(moodOptions).optional(),
    instruments: z.array(z.string()).optional(),
    bpm: z.number().min(60).max(200).optional(),
    vocals: z
      .object({
        gender: z.enum(vocalGenderOptions).optional(),
        style: z.enum(vocalStyleOptions).optional(),
      })
      .optional(),
    structure: z.enum(structureOptions).optional(),
    era: z.enum(eraOptions).optional(),
    custom: z.string().optional(),
  });

export type AiNodeConfig = z.infer<typeof aiNodeConfigSchema>;

export function parseAiNodeConfig(raw: unknown): AiNodeConfig {
  return aiNodeConfigSchema.parse(raw);
}

export function configKeysToNodeTypes(config: AiNodeConfig): NodeType[] {
  const types: NodeType[] = [];
  if (config.genre !== undefined) types.push("genre");
  if (config.mood !== undefined) types.push("mood");
  if (config.instruments !== undefined) types.push("instruments");
  if (config.bpm !== undefined) types.push("bpm");
  if (config.vocals !== undefined) types.push("vocals");
  if (config.structure !== undefined) types.push("structure");
  if (config.era !== undefined) types.push("era");
  if (config.custom !== undefined) types.push("custom");
  return types.filter((t) => NODE_TYPES.includes(t));
}

export const promptEvaluationSchema = z.object({
  score: z.number().min(1).max(10),
  strengths: z.array(z.string()),
  suggestions: z.array(z.string()),
  improved_prompt: z.string(),
});

export type PromptEvaluation = z.infer<typeof promptEvaluationSchema>;

export function parsePromptEvaluation(raw: unknown): PromptEvaluation {
  return promptEvaluationSchema.parse(raw);
}
