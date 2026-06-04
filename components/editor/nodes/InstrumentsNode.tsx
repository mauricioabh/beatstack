"use client";

import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "@/components/editor/nodes/BaseNode";
import { TagInput } from "@/components/editor/nodes/TagInput";
import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import type { InstrumentsNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function InstrumentsNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as InstrumentsNodeData;

  return (
    <BaseNode
      id={id}
      type="instruments"
      title={nodeData.label}
      selected={selected}
    >
      <TagInput
        tags={nodeData.instruments}
        suggestions={NODE_CONFIGS.instruments.suggestions}
        onChange={(instruments) => updateNodeData(id, { instruments })}
      />
    </BaseNode>
  );
}
