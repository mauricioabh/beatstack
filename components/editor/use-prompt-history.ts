"use client";

import { useEffect, useRef } from "react";
import { addPromptHistoryEntry } from "@/lib/prompt-history";
import { useEditorStore } from "@/lib/store";

const DEBOUNCE_MS = 1000;

export function usePromptHistory() {
  const computedPrompt = useEditorStore((s) => s.computedPrompt);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const trimmed = computedPrompt.trim();
      if (!trimmed) return;
      addPromptHistoryEntry(trimmed);
      window.dispatchEvent(new Event("beatstack:prompt-history-updated"));
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [computedPrompt]);
}
