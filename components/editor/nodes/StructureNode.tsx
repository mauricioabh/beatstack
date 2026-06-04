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
import type { StructureNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function StructureNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as StructureNodeData;

  return (
    <BaseNode
      id={id}
      type="structure"
      title={nodeData.label}
      selected={selected}
    >
      <Select
        value={nodeData.structure}
        onValueChange={(structure) => updateNodeData(id, { structure })}
      >
        <SelectTrigger className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {NODE_CONFIGS.structure.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseNode>
  );
}
