"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseResizableHeightOptions = {
  storageKey: string;
  defaultHeight: number;
  minHeight: number;
  maxHeight: number;
};

export function useResizableHeight({
  storageKey,
  defaultHeight,
  minHeight,
  maxHeight,
}: UseResizableHeightOptions) {
  const [height, setHeight] = useState(defaultHeight);
  const heightRef = useRef(defaultHeight);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = Number.parseInt(stored, 10);
      if (Number.isFinite(parsed)) {
        const clamped = Math.min(maxHeight, Math.max(minHeight, parsed));
        heightRef.current = clamped;
        setHeight(clamped);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey, minHeight, maxHeight]);

  const persistHeight = useCallback(
    (value: number) => {
      try {
        localStorage.setItem(storageKey, String(value));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const onResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      const startY = event.clientY;
      const startHeight = heightRef.current;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = startY - moveEvent.clientY;
        const next = Math.min(
          maxHeight,
          Math.max(minHeight, startHeight + delta),
        );
        heightRef.current = next;
        setHeight(next);
      };

      const onPointerUp = () => {
        persistHeight(heightRef.current);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [maxHeight, minHeight, persistHeight],
  );

  return { height, onResizePointerDown };
}
