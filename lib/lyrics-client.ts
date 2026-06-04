import type { LyricsGenerationInput } from "@/lib/lyrics-prompts";

export async function generateLyrics(
  input: LyricsGenerationInput,
): Promise<string> {
  const res = await fetch("/api/lyrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as { text?: string; error?: string };

  if (!res.ok) {
    const err = data.error ?? "Lyrics request failed";
    throw new Error(err);
  }

  if (!data.text) {
    throw new Error("Empty lyrics response");
  }

  return data.text;
}
