import type { CSSProperties } from "react";

/** Deterministic hue from a string seed (for workspace/item thumbnails). */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function gradientStyleFromString(seed: string): CSSProperties {
  const h = hashString(seed);
  const hue1 = h % 360;
  const hue2 = (h * 7 + 41) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue1} 65% 48%), hsl(${hue2} 60% 32%))`,
  };
}
