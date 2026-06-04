"use client";

import { MousePointerClick } from "lucide-react";

export function CanvasEmptyState() {
  return (
    <div
      className="pointer-events-none flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/80 bg-card/60 px-10 py-12 shadow-sm backdrop-blur-sm"
      aria-hidden
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MousePointerClick className="size-7" strokeWidth={1.5} />
      </div>
      <div className="max-w-xs text-center">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          Drag a node to start
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Pick a type from the palette on the left, drag it here, or click to
          place it on the canvas.
        </p>
      </div>
    </div>
  );
}
