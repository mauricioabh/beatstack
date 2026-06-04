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
import type { MoodNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function MoodNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as MoodNodeData;

  return (
    <BaseNode id={id} type="mood" title={nodeData.label} selected={selected}>
      <Select
        value={nodeData.mood}
        onValueChange={(mood) => updateNodeData(id, { mood })}
      >
        <SelectTrigger className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {NODE_CONFIGS.mood.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseNode>
  );
}
