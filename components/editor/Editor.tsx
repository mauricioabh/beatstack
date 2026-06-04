"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Grid3x3, List } from "lucide-react";
import { toast } from "sonner";

import { nodeTypes } from "@/components/editor/nodes";
import { Button } from "@/components/ui/button";
import { NodePalette } from "@/components/editor/NodePalette";
import { OutputPanel } from "@/components/editor/OutputPanel";
import { CanvasEmptyState } from "@/components/editor/CanvasEmptyState";
import { CanvasStatusBar } from "@/components/editor/CanvasStatusBar";
import { FirstVisitHint } from "@/components/editor/FirstVisitHint";
import { GraphShareFromUrl } from "@/components/editor/GraphShareFromUrl";
import { LyricsPanel } from "@/components/editor/LyricsPanel";
import { SongConfigurator } from "@/components/editor/SongConfigurator";
import { CreateToolbar } from "@/components/editor/CreateToolbar";
import { useEditorKeyboard } from "@/components/editor/use-editor-keyboard";
import { usePromptHistory } from "@/components/editor/use-prompt-history";
import {
  clearPaletteDragNodeType,
  readDroppedNodeType,
} from "@/lib/palette-dnd";
import { collapseAiPanel } from "@/lib/ai-panel";
import { BEATSTACK_EDGE_STYLE, withBeatstackEdgeStyle } from "@/lib/edge-style";
import { EDITOR_SNAP_GRID } from "@/lib/editor-grid";
import { useEditorStore } from "@/lib/store";
import type { NodeType } from "@/lib/types";
import { cn } from "@/lib/utils";

const MINIMAP_STORAGE_KEY = "beatstack-show-minimap";

const MINIMAP_NODE_COLORS: Record<NodeType, string> = {
  genre: "#7c3aed",
  mood: "#e11d48",
  instruments: "#d97706",
  bpm: "#0891b2",
  vocals: "#db2777",
  structure: "#059669",
  era: "#4f46e5",
  custom: "#475569",
};

function EditorCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const onNodesChange = useEditorStore((s) => s.onNodesChange);
  const onEdgesChange = useEditorStore((s) => s.onEdgesChange);
  const onConnect = useEditorStore((s) => s.onConnect);
  const onNodeDragStart = useEditorStore((s) => s.onNodeDragStart);
  const addNode = useEditorStore((s) => s.addNode);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const edgesAnimating = useEditorStore((s) => s.edgesAnimating);

  const flowEdges = useMemo(
    () =>
      edges.map((edge) => {
        const styled = withBeatstackEdgeStyle(edge);
        return {
          ...styled,
          className: edgesAnimating
            ? cn(styled.className, "beatstack-edge-animating")
            : styled.className,
        };
      }),
    [edges, edgesAnimating],
  );

  const isCanvasEmpty = nodes.length === 0;

  const [showMinimap, setShowMinimap] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(MINIMAP_STORAGE_KEY) === "true") {
        setShowMinimap(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMinimap = useCallback(() => {
    setShowMinimap((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MINIMAP_STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const handleFitView = useCallback(() => {
    void fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent | React.DragEvent) => {
      event.preventDefault();
      if (!event.dataTransfer) return;
      const type = readDroppedNodeType(event.dataTransfer);
      clearPaletteDragNodeType();
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const wasEmpty = nodes.length === 0;
      const added = addNode(type, position);
      if (!added) {
        toast.message("Only one node per type on the canvas");
        return;
      }
      if (wasEmpty) {
        collapseAiPanel();
      }
    },
    [addNode, nodes.length, screenToFlowPosition],
  );

  const paneDnDCleanupRef = useRef<(() => void) | undefined>(undefined);

  const attachPaneDropListeners = useCallback(() => {
    const pane = reactFlowWrapper.current?.querySelector(".react-flow__pane");
    if (!pane) return;

    const handleDragOver = (event: Event) => {
      event.preventDefault();
      if (event instanceof DragEvent && event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    };

    const handleDrop = (event: Event) => {
      if (event instanceof DragEvent) {
        onDrop(event);
      }
    };

    pane.addEventListener("dragover", handleDragOver);
    pane.addEventListener("drop", handleDrop);
    paneDnDCleanupRef.current = () => {
      pane.removeEventListener("dragover", handleDragOver);
      pane.removeEventListener("drop", handleDrop);
    };
  }, [onDrop]);

  const setupPaneDnD = useCallback(() => {
    paneDnDCleanupRef.current?.();
    attachPaneDropListeners();
  }, [attachPaneDropListeners]);

  useEffect(() => {
    setupPaneDnD();
    return () => paneDnDCleanupRef.current?.();
  }, [setupPaneDnD]);

  return (
    <div
      ref={reactFlowWrapper}
      className="absolute inset-0"
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onInit={setupPaneDnD}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          animated: true,
          style: { ...BEATSTACK_EDGE_STYLE },
        }}
        fitView
        snapToGrid={snapToGrid}
        snapGrid={EDITOR_SNAP_GRID}
        deleteKeyCode={["Backspace", "Delete"]}
        className="h-full w-full bg-background"
        style={{ width: "100%", height: "100%" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          gap={20}
          size={1.5}
          color="var(--muted-foreground)"
          bgColor="var(--background)"
        />
        {isCanvasEmpty && (
          <Panel position="top-center" className="!mt-[18%]">
            <CanvasEmptyState />
          </Panel>
        )}
        <FirstVisitHint />
        <Controls />
        {showMinimap && (
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeColor={(node) =>
              MINIMAP_NODE_COLORS[(node.type as NodeType) ?? "custom"] ??
              "#94a3b8"
            }
            nodeStrokeColor="var(--card)"
            maskColor="rgb(0 0 0 / 0.12)"
            bgColor="var(--card)"
            style={{ width: 140, height: 96 }}
            className="!mb-11 !mr-2 rounded-md border shadow-sm"
          />
        )}
        <Panel position="bottom-right" className="!m-2 flex flex-col gap-1">
          <Button
            type="button"
            variant={showMinimap ? "secondary" : "outline"}
            size="icon-sm"
            aria-label="Toggle minimap"
            aria-pressed={showMinimap}
            title="Toggle minimap"
            onClick={toggleMinimap}
          >
            <Grid3x3 />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Fit view"
            title="Fit view"
            onClick={handleFitView}
          >
            <List />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function Editor() {
  useEditorKeyboard();
  usePromptHistory();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Suspense fallback={null}>
        <GraphShareFromUrl />
      </Suspense>
      <CreateToolbar />
      <CanvasStatusBar />
      <ReactFlowProvider>
        <div className="flex min-h-0 flex-1">
          <NodePalette />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="relative z-20 shrink-0 bg-background">
              <SongConfigurator />
              <LyricsPanel />
            </div>
            <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
              <EditorCanvas />
            </div>
            <OutputPanel />
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
