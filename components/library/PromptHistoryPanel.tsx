"use client";

import { useCallback, useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/format-relative-time";
import {
  clearPromptHistory,
  deletePromptHistoryEntry,
  loadPromptHistory,
} from "@/lib/prompt-history";
import type { PromptHistoryEntry } from "@/lib/types";

export function PromptHistoryPanel() {
  const [entries, setEntries] = useState<PromptHistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setEntries(loadPromptHistory());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdated = () => refresh();
    window.addEventListener("beatstack:prompt-history-updated", onUpdated);
    return () =>
      window.removeEventListener("beatstack:prompt-history-updated", onUpdated);
  }, [refresh]);

  const copyEntry = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const removeEntry = (id: string) => {
    setEntries(deletePromptHistoryEntry(id));
    window.dispatchEvent(new Event("beatstack:prompt-history-updated"));
  };

  const handleClearAll = () => {
    setEntries(clearPromptHistory());
    window.dispatchEvent(new Event("beatstack:prompt-history-updated"));
    toast.success("History cleared");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <History className="size-5" />
          Prompt history
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Last 20 generated prompts. Click to copy.
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1 pr-3">
        {entries.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No history yet. Build a prompt on the canvas.
          </p>
        ) : (
          <ul className="max-w-2xl space-y-2 pb-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="group flex gap-2 rounded-lg border bg-card p-2"
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left text-sm"
                  onClick={() => void copyEntry(entry.prompt)}
                >
                  <p className="line-clamp-3 font-mono text-xs leading-relaxed">
                    {entry.prompt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(entry.createdAt)}
                  </p>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 opacity-70 group-hover:opacity-100"
                  aria-label="Delete entry"
                  onClick={() => removeEntry(entry.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      <Button
        type="button"
        variant="outline"
        className="mt-4 w-fit"
        disabled={entries.length === 0}
        onClick={handleClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}
