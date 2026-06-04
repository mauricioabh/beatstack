import type { CSSProperties } from "react";
import { coverStyleFromSeed } from "@/lib/workspace-cover";

/** Deterministic thumbnail style from a string seed (workspace items, etc.). */
export function gradientStyleFromString(seed: string): CSSProperties {
  return coverStyleFromSeed(seed);
}
