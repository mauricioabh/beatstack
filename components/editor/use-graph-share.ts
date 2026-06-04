"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { buildShareUrl } from "@/lib/graph-share";
import { useEditorStore } from "@/lib/store";

export function useGraphShare() {
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);

  const shareGraph = useCallback(async () => {
    if (nodes.length === 0) return;

    const url = buildShareUrl({ nodes, edges });
    window.history.replaceState(null, "", url);

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  }, [nodes, edges]);

  const canShare = nodes.length > 0;

  return { shareGraph, canShare };
}
