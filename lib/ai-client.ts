export async function callGeminiApi(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, userPrompt }),
  });

  const data = (await res.json()) as { text?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "AI request failed");
  }

  if (!data.text) {
    throw new Error("Empty AI response");
  }

  return data.text;
}
