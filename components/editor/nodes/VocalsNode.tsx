"use client";

import type { NodeProps } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BaseNode } from "@/components/editor/nodes/BaseNode";
import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import type { VocalsNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function VocalsNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as VocalsNodeData;

  return (
    <BaseNode id={id} type="vocals" title={nodeData.label} selected={selected}>
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground">Gender</Label>
        <Select
          value={nodeData.gender}
          onValueChange={(gender) => updateNodeData(id, { gender })}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NODE_CONFIGS.vocals.gender.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground">Style</Label>
        <Select
          value={nodeData.style}
          onValueChange={(style) => updateNodeData(id, { style })}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NODE_CONFIGS.vocals.style.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </BaseNode>
  );
}
