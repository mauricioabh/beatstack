"use client";

import { Suspense, useState } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { EvaluatePromptButton } from "@/components/editor/PromptEvaluateDialog";
import { SaveToWorkspace } from "@/components/editor/SaveToWorkspace";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResizableHeight } from "@/lib/use-resizable-height";
import { useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STYLE_PLACEHOLDER =
  "Connect and configure nodes to generate your prompt";
const LYRICS_PLACEHOLDER = "Generate lyrics above to preview them here";

const OUTPUT_PANEL_HEIGHT_KEY = "beatstack_output_panel_height";
const DEFAULT_HEIGHT = 112;
const MIN_HEIGHT = 96;
const MAX_HEIGHT = 560;

export function OutputPanel() {
  const computedPrompt = useEditorStore((s) => s.computedPrompt);
  const generatedLyrics = useEditorStore((s) => s.generatedLyrics);
  const [activeTab, setActiveTab] = useState("style");
  const { height, onResizePointerDown } = useResizableHeight({
    storageKey: OUTPUT_PANEL_HEIGHT_KEY,
    defaultHeight: DEFAULT_HEIGHT,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

  const hasPrompt = computedPrompt.trim().length > 0;
  const hasLyrics = generatedLyrics.trim().length > 0;
  const canCopyAll = hasPrompt && hasLyrics;

  const copyPrompt = async () => {
    if (!computedPrompt) {
      toast.error("Nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(computedPrompt);
      toast.success("Prompt copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const exportTxt = () => {
    if (!computedPrompt) {
      toast.error("Nothing to export");
      return;
    }
    const blob = new Blob([computedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suno-prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as suno-prompt.txt");
  };

  const copyAllForSuno = async () => {
    if (!canCopyAll) return;
    const payload = `${computedPrompt}\n\n${generatedLyrics}`;
    try {
      await navigator.clipboard.writeText(payload);
      toast.success("Copied! Paste both fields into Suno.");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className="relative flex shrink-0 flex-col border-t border-l-[3px] border-l-[#7C3AED] bg-muted/20"
      style={{ height }}
    >
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize style prompt and lyrics panel"
        title="Drag to resize"
        onPointerDown={onResizePointerDown}
        className="absolute -top-1.5 left-0 right-0 z-10 flex h-3 cursor-ns-resize items-center justify-center touch-none"
      >
        <span className="h-1 w-12 rounded-full bg-border transition-colors hover:bg-muted-foreground/50" />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="flex items-center justify-between border-b px-3 py-1.5">
          <TabsList variant="line" className="h-auto gap-3 bg-transparent p-0">
            <TabsTrigger
              value="style"
              className="px-0 pb-1 text-sm font-bold uppercase tracking-wide data-[state=active]:text-foreground"
            >
              Style prompt
            </TabsTrigger>
            <TabsTrigger
              value="lyrics"
              className="px-0 pb-1 text-sm font-bold uppercase tracking-wide data-[state=active]:text-foreground"
            >
              Lyrics
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <Suspense fallback={null}>
              <SaveToWorkspace />
            </Suspense>
            {canCopyAll && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => void copyAllForSuno()}
              >
                Copy all for Suno 📋
              </Button>
            )}
            {activeTab === "style" && (
              <>
                <EvaluatePromptButton
                  prompt={computedPrompt}
                  disabled={!hasPrompt}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyPrompt}
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={exportTxt}
                >
                  <Download className="size-3.5" />
                  Export .txt
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="style" className="mt-0 min-h-0 flex-1 overflow-y-auto p-3">
          {hasPrompt ? (
            <p
              key={computedPrompt}
              className={cn(
                "font-mono text-[14px] leading-relaxed text-foreground",
                "animate-in fade-in slide-in-from-bottom-1 duration-300",
              )}
            >
              {computedPrompt}
            </p>
          ) : (
            <p className="font-mono text-[14px] leading-relaxed text-muted-foreground">
              {STYLE_PLACEHOLDER}
            </p>
          )}
        </TabsContent>

        <TabsContent value="lyrics" className="mt-0 min-h-0 flex-1 overflow-y-auto p-3">
          {hasLyrics ? (
            <pre
              key={generatedLyrics}
              className={cn(
                "font-mono text-[14px] leading-relaxed whitespace-pre-wrap text-foreground",
                "animate-in fade-in slide-in-from-bottom-1 duration-300",
              )}
            >
              {generatedLyrics}
            </pre>
          ) : (
            <p className="font-mono text-[14px] leading-relaxed text-muted-foreground">
              {LYRICS_PLACEHOLDER}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
