"use client";

import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "@/components/editor/nodes/BaseNode";
import { Input } from "@/components/ui/input";
import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import type { CustomNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function CustomNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as CustomNodeData;

  return (
    <BaseNode id={id} type="custom" title={nodeData.label} selected={selected}>
      <Input
        value={nodeData.text}
        onChange={(e) => updateNodeData(id, { text: e.target.value })}
        placeholder={NODE_CONFIGS.custom.placeholder}
        className="h-8 text-xs"
      />
    </BaseNode>
  );
}
