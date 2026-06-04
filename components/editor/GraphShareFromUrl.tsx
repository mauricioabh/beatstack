"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  clearGraphUrlParam,
  decodeGraphFromUrlParam,
  GRAPH_URL_PARAM,
} from "@/lib/graph-share";
import { useEditorStore } from "@/lib/store";

export function GraphShareFromUrl() {
  const searchParams = useSearchParams();
  const nodes = useEditorStore((s) => s.nodes);
  const replaceGraph = useEditorStore((s) => s.replaceGraph);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingGraphRef = useRef<ReturnType<typeof decodeGraphFromUrlParam>>(null);
  const handledParamRef = useRef<string | null>(null);

  const applySharedGraph = useCallback(() => {
    const graph = pendingGraphRef.current;
    if (!graph) return;
    replaceGraph(graph.nodes, graph.edges);
    clearGraphUrlParam();
    pendingGraphRef.current = null;
    setConfirmOpen(false);
    toast.success("Shared graph loaded");
  }, [replaceGraph]);

  const dismissSharedGraph = useCallback(() => {
    clearGraphUrlParam();
    pendingGraphRef.current = null;
    setConfirmOpen(false);
    handledParamRef.current = searchParams.get(GRAPH_URL_PARAM);
  }, [searchParams]);

  useEffect(() => {
    const encoded = searchParams.get(GRAPH_URL_PARAM);
    if (!encoded) {
      handledParamRef.current = null;
      return;
    }
    if (handledParamRef.current === encoded) return;

    const graph = decodeGraphFromUrlParam(encoded);
    if (!graph) {
      handledParamRef.current = encoded;
      clearGraphUrlParam();
      toast.error("Couldn't load shared graph");
      return;
    }

    handledParamRef.current = encoded;
    pendingGraphRef.current = graph;

    if (nodes.length > 0) {
      setConfirmOpen(true);
      return;
    }

    replaceGraph(graph.nodes, graph.edges);
    clearGraphUrlParam();
    pendingGraphRef.current = null;
    toast.success("Shared graph loaded");
  }, [searchParams, nodes.length, replaceGraph]);

  return (
    <Dialog
      open={confirmOpen}
      onOpenChange={(open) => {
        if (!open) dismissSharedGraph();
        else setConfirmOpen(true);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Load shared graph?</DialogTitle>
          <DialogDescription>
            This link contains a shared graph. Loading it will replace your
            current canvas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={dismissSharedGraph}>
            Cancel
          </Button>
          <Button type="button" onClick={applySharedGraph}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
