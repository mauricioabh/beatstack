import { NextResponse } from "next/server";
import {
  geminiErrorMessage,
  generateGeminiTextWithFallback,
  normalizeGeminiApiKey,
} from "@/lib/server-gemini";

type AiRequestBody = {
  systemPrompt?: string;
  userPrompt?: string;
};

export async function POST(request: Request) {
  const apiKey = normalizeGeminiApiKey(process.env.GEMINI_API_KEY);
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: AiRequestBody;
  try {
    body = (await request.json()) as AiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const systemPrompt = body.systemPrompt?.trim();
  const userPrompt = body.userPrompt?.trim();

  if (!systemPrompt || !userPrompt) {
    return NextResponse.json(
      { error: "systemPrompt and userPrompt are required" },
      { status: 400 },
    );
  }

  const result = await generateGeminiTextWithFallback({
    apiKey,
    systemPrompt,
    userPrompt,
    maxOutputTokens: 1000,
    temperature: 0.7,
  });

  if (!result.ok) {
    console.error("Gemini API error:", result.status, result.detail);
    const message = geminiErrorMessage(result.status, result.detail);
    const httpStatus =
      result.status === 429 ? 429 : result.status === 503 ? 503 : 502;
    return NextResponse.json({ error: message }, { status: httpStatus });
  }

  return NextResponse.json({ text: result.text });
}
