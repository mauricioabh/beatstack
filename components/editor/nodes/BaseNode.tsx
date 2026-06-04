"use client";

import { Handle, Position, useNodeId, useStore } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NODE_TYPE_COLORS } from "@/lib/nodeConfigs";
import type { NodeType } from "@/lib/types";
import { useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type BaseNodeProps = {
  id: string;
  type: NodeType;
  title: string;
  selected?: boolean;
  children: React.ReactNode;
};

export function stopNodeDrag(e: React.MouseEvent | React.PointerEvent) {
  e.stopPropagation();
}

export function BaseNode({ id, type, title, children, selected }: BaseNodeProps) {
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const pulsing = useEditorStore((s) => s.pulsingNodeIds.includes(id));
  const headerColor = NODE_TYPE_COLORS[type];
  const nodeId = useNodeId() ?? id;
  const isConnected = useStore((state) =>
    state.edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId,
    ),
  );

  return (
    <div
      title={
        isConnected
          ? undefined
          : "Connect this node to define prompt order"
      }
      className={cn(
        "w-[240px] rounded-lg border bg-card shadow-md",
        selected && "ring-2 ring-ring",
        !isConnected && "border-dashed opacity-80",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-t-lg px-2 py-1.5 text-xs font-semibold text-white",
          headerColor,
          pulsing && "animate-pulse",
        )}
      >
        <span className="nodrag">{title}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="nodrag size-6 text-white/90 hover:bg-white/20 hover:text-white"
          onClick={() => deleteNode(id)}
          onMouseDown={stopNodeDrag}
          aria-label={`Delete ${title} node`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <div
        className="space-y-2 p-2"
        onMouseDown={stopNodeDrag}
        onPointerDown={stopNodeDrag}
      >
        {children}
      </div>
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
    </div>
  );
}
