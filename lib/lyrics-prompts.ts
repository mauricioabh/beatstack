import { LYRICS_STRUCTURE_OPTIONS } from "@/lib/lyrics-constants";
import type {
  LyricsLanguage,
  LyricsStructureKey,
  LyricsTone,
} from "@/lib/lyrics-constants";

export const LYRICS_GENERATOR_SYSTEM_PROMPT = `You are a professional songwriter specialized in writing lyrics for AI music generation with Suno AI.
Your lyrics must follow these rules:
Write exclusively in the language specified. Do not mix languages.
Use simple, evocative, imagistic language. Avoid clichés and generic phrases.
Lines must be SHORT — 4 to 8 syllables per line is ideal for Suno synthesis.
Use the exact structure tags provided, each on its own line, with no other text on that line.
The [Chorus] must be highly repetitive and memorable — short repeated lines work best (see: "Marea de sal / marea de sal / me vuelve a llamar").
The [Bridge] must contrast emotionally or thematically with the chorus.
[Verse] lines should be poetic and narrative. [Pre-Chorus] should build tension.
Total length: 250 to 400 words maximum.
The theme, mood and style come from the user's inputs.
If a style prompt is provided, use it to inform the sonic and emotional world of the lyrics.
Respond ONLY with the lyrics. No title, no explanations, no preamble, no post-amble.`;

export type LyricsGenerationInput = {
  theme: string;
  language: LyricsLanguage;
  tone: LyricsTone;
  structure: LyricsStructureKey;
  stylePrompt?: string;
};

function formatStructureLabel(structure: LyricsStructureKey): string {
  const option = LYRICS_STRUCTURE_OPTIONS.find((item) => item.value === structure);
  return option?.label ?? structure;
}

export function buildLyricsUserPrompt(input: LyricsGenerationInput): string {
  const stylePrompt = input.stylePrompt?.trim() || "not specified";

  return [
    `Theme: ${input.theme}`,
    `Language: ${input.language}`,
    `Tone: ${input.tone}`,
    `Structure: ${formatStructureLabel(input.structure)}`,
    `Style prompt: ${stylePrompt}`,
    "Write the lyrics now.",
  ].join("\n");
}
