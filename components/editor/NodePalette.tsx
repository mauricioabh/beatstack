"use client";

import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { NODE_TYPE_DOT_COLORS, NODE_TYPE_LABELS } from "@/lib/nodeConfigs";
import { getUsedNodeTypes } from "@/lib/graph-utils";
import {
  clearPaletteDragNodeType,
  DRAG_NODE_TYPE_KEY,
  setPaletteDragNodeType,
} from "@/lib/palette-dnd";
import { useEditorStore } from "@/lib/store";
import { NODE_TYPES, type NodeType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NodePalette() {
  const { screenToFlowPosition } = useReactFlow();
  const nodes = useEditorStore((s) => s.nodes);
  const addNode = useEditorStore((s) => s.addNode);
  const usedTypes = getUsedNodeTypes(nodes);
  const onDragStart = (event: React.DragEvent, type: NodeType) => {
    if (usedTypes.has(type)) {
      event.preventDefault();
      return;
    }
    setPaletteDragNodeType(type);
    event.dataTransfer.setData(DRAG_NODE_TYPE_KEY, type);
    event.dataTransfer.setData("text/plain", type);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    clearPaletteDragNodeType();
  };

  const addNodeAtCanvasCenter = (type: NodeType) => {
    if (usedTypes.has(type)) {
      toast.message("Only one node per type on the canvas");
      return;
    }
    const pane = document.querySelector(".react-flow__pane");
    const bounds = pane?.getBoundingClientRect();
    const x = bounds
      ? bounds.left + bounds.width / 2
      : window.innerWidth / 2;
    const y = bounds
      ? bounds.top + bounds.height / 2
      : window.innerHeight / 2;
    addNode(type, screenToFlowPosition({ x, y }));
  };

  const tryAddType = (type: NodeType) => {
    if (usedTypes.has(type)) return;
    addNodeAtCanvasCenter(type);
  };

  return (
    <aside className="flex w-48 shrink-0 flex-col border-r bg-muted/30">
      <div className="border-b px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nodes
        </h2>
        <p className="text-[10px] text-muted-foreground">
          Drag or click to add
        </p>
      </div>
      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NODE_TYPES.map((type) => {
          const isUsed = usedTypes.has(type);
          return (
          <li key={type}>
            <div
              draggable={!isUsed}
              role="button"
              tabIndex={isUsed ? -1 : 0}
              aria-disabled={isUsed}
              title={
                isUsed
                  ? `${NODE_TYPE_LABELS[type]} is already on the canvas`
                  : undefined
              }
              onDragStart={(e) => onDragStart(e, type)}
              onDragEnd={onDragEnd}
              onClick={() => tryAddType(type)}
              onKeyDown={(e) => {
                if (isUsed) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  tryAddType(type);
                }
              }}
              className={cn(
                "rounded-md border border-border bg-card px-2 py-2 text-sm shadow-sm transition-shadow",
                isUsed
                  ? "cursor-not-allowed opacity-45"
                  : "cursor-grab hover:shadow-md active:cursor-grabbing",
              )}
            >
              <span
                className={cn(
                  "mr-2 inline-block size-2 rounded-full",
                  NODE_TYPE_DOT_COLORS[type],
                )}
              />
              {NODE_TYPE_LABELS[type]}
            </div>
          </li>
          );
        })}
      </ul>
    </aside>
  );
}
