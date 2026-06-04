export const LYRICS_LANGUAGES = [
  "Spanish",
  "English",
  "Portuguese",
  "French",
] as const;

export type LyricsLanguage = (typeof LYRICS_LANGUAGES)[number];

export const LYRICS_TONES = [
  "metaphorical",
  "literal",
  "minimalist",
  "narrative",
  "abstract",
] as const;

export type LyricsTone = (typeof LYRICS_TONES)[number];

export const LYRICS_STRUCTURE_KEYS = [
  "Standard",
  "Simple",
  "Minimal",
  "Instrumental intro",
] as const;

export type LyricsStructureKey = (typeof LYRICS_STRUCTURE_KEYS)[number];

export type LyricsStructureOption = {
  value: LyricsStructureKey;
  label: string;
  sections: string[];
};

export const LYRICS_STRUCTURE_OPTIONS: LyricsStructureOption[] = [
  {
    value: "Standard",
    label:
      "Standard: Verse 1 / Pre-Chorus / Chorus / Verse 2 / Pre-Chorus / Chorus / Bridge / Chorus",
    sections: [
      "Verse 1",
      "Pre-Chorus",
      "Chorus",
      "Verse 2",
      "Pre-Chorus",
      "Chorus",
      "Bridge",
      "Chorus",
    ],
  },
  {
    value: "Simple",
    label: "Simple: Verse 1 / Chorus / Verse 2 / Chorus / Bridge / Chorus",
    sections: ["Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Chorus"],
  },
  {
    value: "Minimal",
    label: "Minimal: Verse 1 / Chorus / Verse 2 / Chorus",
    sections: ["Verse 1", "Chorus", "Verse 2", "Chorus"],
  },
  {
    value: "Instrumental intro",
    label:
      "Instrumental intro: Intro / Verse 1 / Chorus / Verse 2 / Chorus / Bridge / Outro",
    sections: [
      "Intro",
      "Verse 1",
      "Chorus",
      "Verse 2",
      "Chorus",
      "Bridge",
      "Outro",
    ],
  },
];

export const SUNO_LYRICS_CHAR_LIMIT = 3000;

export const LYRICS_TAG_REGEX = /\[[^\]]+\]/g;

export function getLyricsStructureSections(
  structure: LyricsStructureKey,
): string[] {
  const option = LYRICS_STRUCTURE_OPTIONS.find((item) => item.value === structure);
  return option?.sections ?? LYRICS_STRUCTURE_OPTIONS[0].sections;
}
