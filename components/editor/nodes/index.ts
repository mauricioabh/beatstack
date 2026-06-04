import type { NodeTypes } from "@xyflow/react";
import { GenreNode } from "@/components/editor/nodes/GenreNode";
import { MoodNode } from "@/components/editor/nodes/MoodNode";
import { InstrumentsNode } from "@/components/editor/nodes/InstrumentsNode";
import { BpmNode } from "@/components/editor/nodes/BpmNode";
import { VocalsNode } from "@/components/editor/nodes/VocalsNode";
import { StructureNode } from "@/components/editor/nodes/StructureNode";
import { EraNode } from "@/components/editor/nodes/EraNode";
import { CustomNode } from "@/components/editor/nodes/CustomNode";

export const nodeTypes: NodeTypes = {
  genre: GenreNode,
  mood: MoodNode,
  instruments: InstrumentsNode,
  bpm: BpmNode,
  vocals: VocalsNode,
  structure: StructureNode,
  era: EraNode,
  custom: CustomNode,
};
