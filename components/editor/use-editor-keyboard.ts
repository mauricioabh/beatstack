"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/lib/store";

export const OPEN_SAVE_PRESET_EVENT = "beatstack:open-save-preset";

export function useEditorKeyboard() {
  const undo = useEditorStore((s) => s.undo);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent(OPEN_SAVE_PRESET_EVENT));
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        if (event.shiftKey) return;
        if (isEditable) return;
        event.preventDefault();
        if (useEditorStore.getState().canUndo()) {
          undo();
          toast.message("Undone");
        }
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo]);
}
