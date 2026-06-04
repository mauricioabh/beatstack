"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { callGeminiApi } from "@/lib/ai-client";
import { parseAiNodeConfig } from "@/lib/ai-config";
import { NODE_CONFIGURATOR_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { extractJsonFromAiText } from "@/lib/parse-ai-json";
import { readAiPanelOpen, writeAiPanelOpen } from "@/lib/ai-panel";
import { useEditorStore } from "@/lib/store";

export function SongConfigurator() {
  const applyAiConfiguration = useEditorStore((s) => s.applyAiConfiguration);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [textareaRows, setTextareaRows] = useState(2);

  useEffect(() => {
    setOpen(readAiPanelOpen());
  }, []);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      writeAiPanelOpen(next);
      return next;
    });
  };

  const handleConfigure = async () => {
    const text = description.trim();
    if (!text) {
      toast.error("Describe the song you want to create");
      return;
    }

    setLoading(true);
    try {
      const responseText = await callGeminiApi(
        NODE_CONFIGURATOR_SYSTEM_PROMPT,
        text,
      );
      const parsed = parseAiNodeConfig(extractJsonFromAiText(responseText));
      applyAiConfiguration(parsed);
      toast.success("Nodes configured from your description");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not configure nodes";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0 border-b bg-card">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-controls="describe-song-panel"
      >
        Describe your song
        {open ? (
          <ChevronUp className="size-4 shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="size-4 shrink-0" aria-hidden />
        )}
      </button>

      {open ? (
        <div id="describe-song-panel" className="space-y-2 border-t px-4 pb-3 pt-2">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the song you want to create… (English or Spanish)"
            rows={textareaRows}
            onFocus={() => setTextareaRows(4)}
            onBlur={() => {
              if (!description.trim()) setTextareaRows(2);
            }}
            className="resize-none text-sm"
            disabled={loading}
          />
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => void handleConfigure()}
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            Configure nodes ✨
          </Button>
        </div>
      ) : null}
    </div>
  );
}
