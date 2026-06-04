"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OPEN_SAVE_PRESET_EVENT } from "@/components/editor/use-editor-keyboard";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { assemblePrompt } from "@/lib/prompt";
import { useEditorStore } from "@/lib/store";

export const OPEN_PRESETS_SHEET_EVENT = "beatstack:open-presets-sheet";

type PresetsSheetProps = {
  trigger?: React.ReactNode;
};

export function PresetsSheet({ trigger }: PresetsSheetProps) {
  const presets = useEditorStore((s) => s.presets);
  const savePreset = useEditorStore((s) => s.savePreset);
  const loadPreset = useEditorStore((s) => s.loadPreset);
  const deletePreset = useEditorStore((s) => s.deletePreset);
  const refreshPresets = useEditorStore((s) => s.refreshPresets);

  const [open, setOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const saveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshPresets();
  }, [refreshPresets, open]);

  const openWithSaveFocus = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => saveInputRef.current?.focus());
  }, []);

  useEffect(() => {
    const onSaveShortcut = () => openWithSaveFocus();
    const onOpenSheet = () => setOpen(true);
    window.addEventListener(OPEN_SAVE_PRESET_EVENT, onSaveShortcut);
    window.addEventListener(OPEN_PRESETS_SHEET_EVENT, onOpenSheet);
    return () => {
      window.removeEventListener(OPEN_SAVE_PRESET_EVENT, onSaveShortcut);
      window.removeEventListener(OPEN_PRESETS_SHEET_EVENT, onOpenSheet);
    };
  }, [openWithSaveFocus]);

  const presetEntries = Object.entries(presets).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const handleSave = () => {
    const name = presetName.trim();
    if (!name) {
      toast.error("Enter a preset name");
      return;
    }
    savePreset(name);
    setPresetName("");
    toast.success(`Saved preset "${name}"`);
  };

  const handleLoad = (name: string) => {
    const ok = loadPreset(name);
    if (ok) {
      toast.success(`Loaded preset "${name}"`);
      setOpen(false);
    } else {
      toast.error("Preset not found");
    }
  };

  const handleDelete = (name: string) => {
    deletePreset(name);
    toast.success(`Deleted preset "${name}"`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Presets</SheetTitle>
          <SheetDescription>
            Saved graphs in your browser. Load or delete anytime.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-2 border-b pb-4">
          <Label htmlFor="preset-save-name">Save current as preset</Label>
          <div className="flex gap-2">
            <Input
              id="preset-save-name"
              ref={saveInputRef}
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="My trap beat"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <Button type="button" size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-3">
          {presetEntries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No presets yet. Save your current graph above.
            </p>
          ) : (
            <ul className="space-y-3 pb-4">
              {presetEntries.map(([name, preset]) => {
                const preview = assemblePrompt(preset.nodes, preset.edges);
                const truncated =
                  preview.length > 80
                    ? `${preview.slice(0, 80)}…`
                    : preview || "(empty prompt)";
                const savedLabel = preset.savedAt
                  ? formatRelativeTime(preset.savedAt)
                  : "unknown time";

                return (
                  <li
                    key={name}
                    className="rounded-lg border bg-card p-3 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{name}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {truncated}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {preset.nodes.length} node
                          {preset.nodes.length === 1 ? "" : "s"} · {savedLabel}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoad(name)}
                        >
                          Load
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete preset ${name}`}
                          onClick={() => handleDelete(name)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
