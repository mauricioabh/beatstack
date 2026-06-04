"use client";

import type { NodeProps } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseNode } from "@/components/editor/nodes/BaseNode";
import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import type { GenreNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function GenreNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as GenreNodeData;

  return (
    <BaseNode id={id} type="genre" title={nodeData.label} selected={selected}>
      <Select
        value={nodeData.genre}
        onValueChange={(genre) => updateNodeData(id, { genre })}
      >
        <SelectTrigger className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {NODE_CONFIGS.genre.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseNode>
  );
}
