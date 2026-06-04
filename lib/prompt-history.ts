import type { PromptHistoryEntry } from "@/lib/types";
import {
  PROMPT_HISTORY_MAX,
  PROMPT_HISTORY_STORAGE_KEY,
} from "@/lib/types";

export function loadPromptHistory(): PromptHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROMPT_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PromptHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistPromptHistory(entries: PromptHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    PROMPT_HISTORY_STORAGE_KEY,
    JSON.stringify(entries.slice(0, PROMPT_HISTORY_MAX)),
  );
}

export function addPromptHistoryEntry(prompt: string): PromptHistoryEntry[] {
  const trimmed = prompt.trim();
  if (!trimmed) return loadPromptHistory();

  const existing = loadPromptHistory();
  if (existing[0]?.prompt === trimmed) return existing;

  const entry: PromptHistoryEntry = {
    id: `hist_${Date.now()}`,
    prompt: trimmed,
    createdAt: Date.now(),
  };

  const next = [entry, ...existing].slice(0, PROMPT_HISTORY_MAX);
  persistPromptHistory(next);
  return next;
}

export function deletePromptHistoryEntry(id: string): PromptHistoryEntry[] {
  const next = loadPromptHistory().filter((e) => e.id !== id);
  persistPromptHistory(next);
  return next;
}

export function clearPromptHistory(): PromptHistoryEntry[] {
  persistPromptHistory([]);
  return [];
}
