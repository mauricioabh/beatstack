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
import { CollapsiblePanel, usePanelCollapsed } from "@/components/ui/collapsible-panel";
import { useEditorStore } from "@/lib/store";
import { NODE_TYPES, type NodeType } from "@/lib/types";
import { cn } from "@/lib/utils";

const NODE_PALETTE_COLLAPSE_KEY = "beatstack_node_palette_collapsed";

function NodePaletteContent() {
  const { screenToFlowPosition } = useReactFlow();
  const nodes = useEditorStore((s) => s.nodes);
  const addNode = useEditorStore((s) => s.addNode);
  const collapsed = usePanelCollapsed();
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
    <>
      {!collapsed && (
        <div className="border-b px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nodes
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Drag or click to add
          </p>
        </div>
      )}
      <ul
        className={cn(
          "flex flex-1 flex-col overflow-y-auto",
          collapsed ? "gap-1.5 p-1.5 pt-10" : "gap-1 p-2",
        )}
      >
        {NODE_TYPES.map((type) => {
          const isUsed = usedTypes.has(type);
          const label = NODE_TYPE_LABELS[type];
          return (
            <li key={type}>
              <div
                draggable={!isUsed}
                role="button"
                tabIndex={isUsed ? -1 : 0}
                aria-disabled={isUsed}
                aria-label={label}
                title={
                  isUsed ? `${label} is already on the canvas` : label
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
                  "rounded-md border border-border bg-card text-sm shadow-sm transition-shadow",
                  collapsed
                    ? "flex items-center justify-center px-0 py-2.5"
                    : "px-2 py-2",
                  isUsed
                    ? "cursor-not-allowed opacity-45"
                    : "cursor-grab hover:shadow-md active:cursor-grabbing",
                )}
              >
                <span
                  className={cn(
                    "inline-block size-2.5 rounded-full",
                    NODE_TYPE_DOT_COLORS[type],
                    !collapsed && "mr-2",
                  )}
                />
                {!collapsed && label}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function NodePalette() {
  return (
    <CollapsiblePanel
      storageKey={NODE_PALETTE_COLLAPSE_KEY}
      ariaLabel="node palette"
      expandedClassName="w-48"
      collapsedClassName="w-12"
      panelClassName="bg-muted/30"
    >
      <NodePaletteContent />
    </CollapsiblePanel>
  );
}
