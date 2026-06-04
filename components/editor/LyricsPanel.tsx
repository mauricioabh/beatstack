"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LyricsHighlightEditor } from "@/components/editor/LyricsHighlightEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LYRICS_LANGUAGES,
  LYRICS_STRUCTURE_OPTIONS,
  LYRICS_TONES,
  type LyricsLanguage,
  type LyricsStructureKey,
  type LyricsTone,
} from "@/lib/lyrics-constants";
import { generateLyrics } from "@/lib/lyrics-client";
import {
  readLyricsPanelOpen,
  writeLyricsPanelOpen,
} from "@/lib/lyrics-panel";
import { useEditorStore } from "@/lib/store";

export function LyricsPanel() {
  const computedPrompt = useEditorStore((s) => s.computedPrompt);
  const lyricsTheme = useEditorStore((s) => s.lyricsTheme);
  const lyricsLanguage = useEditorStore((s) => s.lyricsLanguage);
  const lyricsTone = useEditorStore((s) => s.lyricsTone);
  const lyricsStructure = useEditorStore((s) => s.lyricsStructure);
  const generatedLyrics = useEditorStore((s) => s.generatedLyrics);
  const setLyricsField = useEditorStore((s) => s.setLyricsField);
  const setGeneratedLyrics = useEditorStore((s) => s.setGeneratedLyrics);
  const clearLyrics = useEditorStore((s) => s.clearLyrics);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeRows, setThemeRows] = useState(2);

  const hasStyleContext = computedPrompt.trim().length > 0;

  useEffect(() => {
    setOpen(readLyricsPanelOpen());
  }, []);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      writeLyricsPanelOpen(next);
      return next;
    });
  };

  const runGeneration = async () => {
    const trimmedTheme = lyricsTheme.trim();
    if (!trimmedTheme) {
      toast.error("Describe what the song is about");
      return;
    }

    setLoading(true);
    try {
      const generated = await generateLyrics({
        theme: trimmedTheme,
        language: lyricsLanguage as LyricsLanguage,
        tone: lyricsTone as LyricsTone,
        structure: lyricsStructure as LyricsStructureKey,
        stylePrompt: computedPrompt.trim() || undefined,
      });
      setGeneratedLyrics(generated);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate lyrics";
      if (message.includes("GEMINI") || message.includes("not configured")) {
        toast.error(
          "Lyrics AI is not set up. Add GEMINI_API_KEY to .env.local and restart the dev server.",
        );
      } else if (
        message.includes("busy") ||
        message.includes("rate limit") ||
        message.includes("provider")
      ) {
        toast.error(message);
      } else {
        toast.error("Failed to generate lyrics. Try again.");
      }
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
        aria-controls="lyrics-generator-panel"
      >
        Lyrics generator
        {open ? (
          <ChevronUp className="size-4 shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="size-4 shrink-0" aria-hidden />
        )}
      </button>

      {open ? (
        <div
          id="lyrics-generator-panel"
          className="max-h-[min(70vh,28rem)] overflow-y-auto border-t px-4 pb-3 pt-2"
        >
          <div className="space-y-3">
            <Textarea
              value={lyricsTheme}
              onChange={(event) =>
                setLyricsField("lyricsTheme", event.target.value)
              }
              placeholder="What is the song about? (e.g. summer road trip, a breakup at dawn)"
              rows={themeRows}
              onFocus={() => setThemeRows(4)}
              onBlur={() => {
                if (!lyricsTheme.trim()) setThemeRows(2);
              }}
              className="resize-none text-sm"
              disabled={loading}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="lyrics-language" className="text-xs">
                  Language
                </Label>
                <Select
                  value={lyricsLanguage}
                  onValueChange={(value) =>
                    setLyricsField("lyricsLanguage", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="lyrics-language" className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LYRICS_LANGUAGES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lyrics-tone" className="text-xs">
                  Poetic tone
                </Label>
                <Select
                  value={lyricsTone}
                  onValueChange={(value) => setLyricsField("lyricsTone", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="lyrics-tone" className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LYRICS_TONES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lyrics-structure" className="text-xs">
                  Structure
                </Label>
                <Select
                  value={lyricsStructure}
                  onValueChange={(value) =>
                    setLyricsField("lyricsStructure", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="lyrics-structure" className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LYRICS_STRUCTURE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Language, tone, and structure apply when you generate.
            </p>

            <div className="space-y-1">
              <Button
                type="button"
                size="sm"
                disabled={loading || !lyricsTheme.trim()}
                onClick={() => void runGeneration()}
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                Generate lyrics ✨
              </Button>
              {hasStyleContext && (
                <p className="text-xs text-muted-foreground">
                  Using your current style prompt as context
                </p>
              )}
            </div>

            <LyricsHighlightEditor
              value={generatedLyrics}
              onChange={setGeneratedLyrics}
              disabled={loading}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || !lyricsTheme.trim()}
                onClick={() => void runGeneration()}
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="size-3.5" />
                )}
                Regenerate 🔄
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || !generatedLyrics}
                onClick={clearLyrics}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
