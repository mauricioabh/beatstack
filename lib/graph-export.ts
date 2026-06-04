import { z } from "zod";
import { NODE_TYPES } from "@/lib/types";
import type { ExportedGraphFile } from "@/lib/types";

const nodeTypeSchema = z.enum(NODE_TYPES);

const sunoNodeSchema = z
  .object({
    id: z.string(),
    type: nodeTypeSchema,
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const sunoEdgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
  })
  .passthrough();

export const exportedGraphFileSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  nodes: z.array(sunoNodeSchema),
  edges: z.array(sunoEdgeSchema),
});

export function parseExportedGraphFile(
  raw: unknown,
): ExportedGraphFile | null {
  const result = exportedGraphFileSchema.safeParse(raw);
  if (!result.success) return null;
  return {
    name: result.data.name,
    createdAt: result.data.createdAt,
    nodes: result.data.nodes,
    edges: result.data.edges,
  } as ExportedGraphFile;
}

export function buildExportPayload(
  nodes: ExportedGraphFile["nodes"],
  edges: ExportedGraphFile["edges"],
  name = "beatstack-graph",
): ExportedGraphFile {
  return {
    name,
    createdAt: new Date().toISOString(),
    nodes,
    edges,
  };
}

export function downloadJsonFile(payload: ExportedGraphFile): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${payload.name.replace(/\s+/g, "-").toLowerCase() || "beatstack-graph"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
