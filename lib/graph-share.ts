import LZString from "lz-string";
import { z } from "zod";
import type { GraphPreset } from "@/lib/types";
import { NODE_TYPES } from "@/lib/types";

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

const sharedGraphSchema = z.object({
  nodes: z.array(sunoNodeSchema),
  edges: z.array(sunoEdgeSchema),
});

export const GRAPH_URL_PARAM = "graph";

export function encodeGraphToUrlParam(graph: GraphPreset): string {
  const json = JSON.stringify(graph);
  return LZString.compressToBase64(json);
}

export function decodeGraphFromUrlParam(encoded: string): GraphPreset | null {
  try {
    const json = LZString.decompressFromBase64(encoded);
    if (!json) return null;
    const parsed: unknown = JSON.parse(json);
    const result = sharedGraphSchema.safeParse(parsed);
    if (!result.success) return null;
    return {
      nodes: result.data.nodes,
      edges: result.data.edges,
    } as GraphPreset;
  } catch {
    return null;
  }
}

export function buildShareUrl(graph: GraphPreset): string {
  const url = new URL(window.location.href);
  url.searchParams.set(GRAPH_URL_PARAM, encodeGraphToUrlParam(graph));
  return url.toString();
}

export function clearGraphUrlParam(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(GRAPH_URL_PARAM);
  window.history.replaceState(null, "", url.toString());
}
