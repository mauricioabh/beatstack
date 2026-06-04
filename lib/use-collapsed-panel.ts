"use client";

import { useCallback, useEffect, useState } from "react";

export function useCollapsedPanel(storageKey: string) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(storageKey) === "true");
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [storageKey]);

  return { collapsed, toggle };
}
