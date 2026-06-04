import type { CSSProperties } from "react";

/** Suno graph edge stroke — violet-600 (#7C3AED) at 60% opacity */
export const BEATSTACK_EDGE_STYLE: CSSProperties = {
  stroke: "rgba(124, 58, 237, 0.6)",
  strokeWidth: 2,
};

export function withBeatstackEdgeStyle<T extends { style?: CSSProperties }>(
  edge: T,
): T & { animated: true; style: CSSProperties } {
  return {
    ...edge,
    animated: true,
    style: { ...BEATSTACK_EDGE_STYLE, ...edge.style },
  };
}
