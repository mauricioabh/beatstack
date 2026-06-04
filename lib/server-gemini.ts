/** gemini-2.0-flash was shut down 2026-06-01. Override primary via GEMINI_MODEL. */
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";

/** Tried in order when the primary model is busy or unavailable. */
const GEMINI_FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
] as const;

const RETRYABLE_STATUSES = new Set([503, 429]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGeminiModelId(): string {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  return fromEnv || DEFAULT_GEMINI_MODEL;
}

export function getGeminiModelCandidates(primary?: string): string[] {
  const first = primary ?? getGeminiModelId();
  const rest = GEMINI_FALLBACK_MODELS.filter((m) => m !== first);
  return [first, ...rest];
}

export function normalizeGeminiApiKey(
  key: string | undefined,
): string | undefined {
  if (!key) return undefined;
  let trimmed = key.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed || undefined;
}

export type GeminiGenerateParams = {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens?: number;
  temperature?: number;
  model?: string;
};

export type GeminiGenerateResult =
  | { ok: true; text: string; model: string }
  | { ok: false; status: number; detail: string };

/** User-facing message; technical detail stays in server logs. */
export function geminiErrorMessage(status: number, detail: string): string {
  try {
    const parsed = JSON.parse(detail) as {
      error?: { message?: string; status?: string };
    };
    const msg = parsed.error?.message ?? "";
    const lower = msg.toLowerCase();

    if (
      status === 503 ||
      parsed.error?.status === "UNAVAILABLE" ||
      lower.includes("high demand") ||
      lower.includes("overloaded")
    ) {
      return "Gemini is busy right now. Wait a few seconds and try again.";
    }

    if (
      status === 429 ||
      parsed.error?.status === "RESOURCE_EXHAUSTED" ||
      lower.includes("quota") ||
      lower.includes("rate limit")
    ) {
      if (lower.includes("limit: 0") || lower.includes("free_tier")) {
        return "This AI model has no free quota. Set GEMINI_MODEL=gemini-2.5-flash-lite in .env.local and restart.";
      }
      return "Gemini rate limit reached. Wait a minute and try again.";
    }

    if (status === 404 || lower.includes("not found")) {
      return "AI model not available. Set GEMINI_MODEL=gemini-2.5-flash-lite in .env.local and restart.";
    }

    if (
      status === 400 &&
      (lower.includes("api key") || lower.includes("api_key_invalid"))
    ) {
      return "Invalid GEMINI_API_KEY. Check .env.local and restart the dev server.";
    }

    if (lower.includes("deprecated") || lower.includes("shut down")) {
      return "AI model was retired. Set GEMINI_MODEL=gemini-2.5-flash-lite in .env.local and restart.";
    }
  } catch {
    /* not JSON */
  }

  return "AI provider request failed";
}

export async function generateGeminiText(
  params: GeminiGenerateParams,
): Promise<GeminiGenerateResult> {
  const model = params.model ?? getGeminiModelId();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(params.apiKey)}`;

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: params.systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: params.userPrompt }] }],
      generationConfig: {
        maxOutputTokens: params.maxOutputTokens ?? 1000,
        temperature: params.temperature ?? 0.7,
      },
    }),
  });

  if (!geminiRes.ok) {
    const detail = await geminiRes.text();
    return { ok: false, status: geminiRes.status, detail };
  }

  const data = (await geminiRes.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    return { ok: false, status: 502, detail: "Empty AI response" };
  }

  return { ok: true, text, model };
}

/** Retry once on 503/429, then try fallback models. */
export async function generateGeminiTextWithFallback(
  params: Omit<GeminiGenerateParams, "model"> & { model?: string },
): Promise<GeminiGenerateResult> {
  const models = getGeminiModelCandidates(params.model);
  let last: GeminiGenerateResult = {
    ok: false,
    status: 502,
    detail: "No models tried",
  };

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await generateGeminiText({ ...params, model });
      if (result.ok) {
        if (model !== models[0]) {
          console.info(`Gemini succeeded with fallback model: ${model}`);
        }
        return result;
      }
      last = result;
      if (result.status === 503 && attempt === 0) {
        await sleep(2500);
        continue;
      }
      break;
    }
    if (!RETRYABLE_STATUSES.has(last.status) && last.status !== 404) {
      break;
    }
  }

  return last;
}
