"use client";

import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "@/components/editor/nodes/BaseNode";
import { Slider } from "@/components/ui/slider";
import { NODE_CONFIGS } from "@/lib/nodeConfigs";
import type { BpmNodeData } from "@/lib/types";
import { useEditorStore } from "@/lib/store";

export function BpmNode({ id, data, selected }: NodeProps) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const nodeData = data as BpmNodeData;
  const { min, max, step } = NODE_CONFIGS.bpm;

  return (
    <BaseNode id={id} type="bpm" title={nodeData.label} selected={selected}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>BPM</span>
        <span className="font-medium text-foreground">{nodeData.bpm}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[nodeData.bpm]}
        onValueChange={([bpm]) => {
          if (bpm !== undefined) updateNodeData(id, { bpm });
        }}
      />
    </BaseNode>
  );
}
