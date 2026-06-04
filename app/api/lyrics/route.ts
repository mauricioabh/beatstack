import { NextResponse } from "next/server";
import {
  LYRICS_LANGUAGES,
  LYRICS_STRUCTURE_KEYS,
  LYRICS_TONES,
  type LyricsLanguage,
  type LyricsStructureKey,
  type LyricsTone,
} from "@/lib/lyrics-constants";
import {
  LYRICS_GENERATOR_SYSTEM_PROMPT,
  buildLyricsUserPrompt,
} from "@/lib/lyrics-prompts";
import {
  geminiErrorMessage,
  generateGeminiTextWithFallback,
  normalizeGeminiApiKey,
} from "@/lib/server-gemini";

type LyricsRequestBody = {
  theme?: string;
  language?: string;
  tone?: string;
  structure?: string;
  stylePrompt?: string;
};

function isLyricsLanguage(value: string): value is LyricsLanguage {
  return (LYRICS_LANGUAGES as readonly string[]).includes(value);
}

function isLyricsTone(value: string): value is LyricsTone {
  return (LYRICS_TONES as readonly string[]).includes(value);
}

function isLyricsStructure(value: string): value is LyricsStructureKey {
  return (LYRICS_STRUCTURE_KEYS as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const apiKey = normalizeGeminiApiKey(process.env.GEMINI_API_KEY);
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: LyricsRequestBody;
  try {
    body = (await request.json()) as LyricsRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const theme = body.theme?.trim();
  const language = body.language?.trim();
  const tone = body.tone?.trim();
  const structure = body.structure?.trim();

  if (!theme) {
    return NextResponse.json({ error: "theme is required" }, { status: 400 });
  }

  if (!language || !isLyricsLanguage(language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  if (!tone || !isLyricsTone(tone)) {
    return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  }

  if (!structure || !isLyricsStructure(structure)) {
    return NextResponse.json({ error: "Invalid structure" }, { status: 400 });
  }

  const userPrompt = buildLyricsUserPrompt({
    theme,
    language,
    tone,
    structure,
    stylePrompt: body.stylePrompt,
  });

  const result = await generateGeminiTextWithFallback({
    apiKey,
    systemPrompt: LYRICS_GENERATOR_SYSTEM_PROMPT,
    userPrompt,
    maxOutputTokens: 1500,
    temperature: 0.8,
  });

  if (!result.ok) {
    console.error("Gemini lyrics API error:", result.status, result.detail);
    const message = geminiErrorMessage(result.status, result.detail);
    const httpStatus =
      result.status === 429 ? 429 : result.status === 503 ? 503 : 502;
    return NextResponse.json({ error: message }, { status: httpStatus });
  }

  return NextResponse.json({ text: result.text });
}
