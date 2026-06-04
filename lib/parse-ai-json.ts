export function extractJsonFromAiText(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = /^```(?:json)?\s*([\s\S]*?)```$/i.exec(trimmed);
  const candidate = fenceMatch ? fenceMatch[1]!.trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object in response");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as unknown;
}
