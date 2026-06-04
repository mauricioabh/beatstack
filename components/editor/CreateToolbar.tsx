"use client";

import { useRef, useState } from "react";
import {
  Dices,
  FolderDown,
  FolderUp,
  HelpCircle,
  Library,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { PresetsSheet } from "@/components/editor/PresetsSheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGraphShare } from "@/components/editor/use-graph-share";
import {
  buildExportPayload,
  downloadJsonFile,
  parseExportedGraphFile,
} from "@/lib/graph-export";
import { HELP_FAQ_ITEMS } from "@/lib/help-faq";
import { useEditorStore } from "@/lib/store";
import Link from "next/link";

export function CreateToolbar() {
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const randomizeGraph = useEditorStore((s) => s.randomizeGraph);
  const replaceGraph = useEditorStore((s) => s.replaceGraph);
  const { shareGraph, canShare } = useGraphShare();

  const [helpOpen, setHelpOpen] = useState(false);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const pendingImportRef = useRef<ReturnType<typeof parseExportedGraphFile>>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    if (nodes.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    downloadJsonFile(buildExportPayload(nodes, edges));
    toast.success("Graph exported as JSON");
  };

  const applyImport = () => {
    const data = pendingImportRef.current;
    if (!data) return;
    replaceGraph(data.nodes, data.edges);
    pendingImportRef.current = null;
    setImportConfirmOpen(false);
    toast.success("Graph imported");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const raw: unknown = JSON.parse(await file.text());
      const parsed = parseExportedGraphFile(raw);
      if (!parsed) {
        toast.error("Invalid file format");
        return;
      }

      pendingImportRef.current = parsed;
      if (nodes.length > 0) {
        setImportConfirmOpen(true);
        return;
      }
      applyImport();
    } catch {
      toast.error("Invalid file format");
    }
  };

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b bg-card px-3">
      <PresetsSheet
        trigger={
          <Button type="button" variant="outline" size="sm">
            <Library className="size-3.5" />
            Presets
          </Button>
        }
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => randomizeGraph()}
        disabled={nodes.length === 0}
        title="Randomize all node values"
      >
        <Dices className="size-3.5" />
        Randomize 🎲
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleExportJson}
        disabled={nodes.length === 0}
      >
        <FolderDown className="size-3.5" />
        Export JSON
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <FolderUp className="size-3.5" />
        Import JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />

      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void shareGraph()}
          disabled={!canShare}
          title={
            canShare
              ? "Copy link with current graph"
              : "Add nodes to share your graph"
          }
        >
          <Share2 className="size-3.5" />
          Share
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle className="size-3.5" />
          Help
        </Button>
      </div>

      <Dialog
        open={importConfirmOpen}
        onOpenChange={(open) => {
          setImportConfirmOpen(open);
          if (!open) pendingImportRef.current = null;
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace canvas?</DialogTitle>
            <DialogDescription>
              This will replace your current canvas. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                pendingImportRef.current = null;
                setImportConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={applyImport}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to use</DialogTitle>
            <DialogDescription asChild>
              <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {HELP_FAQ_ITEMS.map((item) => (
                  <li key={item.id}>{item.answer}</li>
                ))}
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Link
              href="/help"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => setHelpOpen(false)}
            >
              Full help page (FAQ)
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
