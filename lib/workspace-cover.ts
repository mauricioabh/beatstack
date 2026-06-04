import type { CSSProperties } from "react";
import type { Workspace } from "@/lib/workspaces";

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Seed used to paint the workspace thumbnail (custom, or derived from content). */
export function getWorkspaceCoverSeed(workspace: Workspace): string {
  if (workspace.coverSeed) return workspace.coverSeed;
  const firstPrompt = workspace.items[0]?.stylePrompt?.trim();
  if (firstPrompt) return firstPrompt;
  return workspace.name;
}

/** Layered mesh gradient — deterministic per seed, more visual depth than a flat gradient. */
export function coverStyleFromSeed(seed: string): CSSProperties {
  const h = hashString(seed);
  const hue1 = h % 360;
  const hue2 = (h * 7 + 41) % 360;
  const hue3 = (h * 13 + 97) % 360;
  const hue4 = (h * 3 + 200) % 360;

  return {
    backgroundColor: `hsl(${hue2} 40% 14%)`,
    backgroundImage: [
      `radial-gradient(ellipse 90% 70% at 15% 20%, hsl(${hue1} 85% 62% / 0.95), transparent 55%)`,
      `radial-gradient(ellipse 75% 85% at 85% 75%, hsl(${hue3} 75% 48% / 0.9), transparent 50%)`,
      `radial-gradient(ellipse 55% 45% at 55% 40%, hsl(${hue4} 70% 55% / 0.45), transparent 60%)`,
      `linear-gradient(155deg, hsl(${hue1} 55% 28% / 0.5) 0%, hsl(${hue2} 50% 18%) 100%)`,
    ].join(", "),
  };
}

export function newCoverSeed(): string {
  return `cover_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
