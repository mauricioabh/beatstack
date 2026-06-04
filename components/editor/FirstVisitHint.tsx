"use client";

import { useCallback, useEffect, useState } from "react";
import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { hasPriorSessionData } from "@/components/editor/CanvasStatusBar";

const HINT_DISMISSED_KEY = "beatstack_hint_dismissed";

export function FirstVisitHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_DISMISSED_KEY)) return;
      if (hasPriorSessionData()) return;
      setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(HINT_DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <Panel position="top-center" className="!mt-8 !max-w-md">
      <div className="rounded-lg border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm leading-relaxed text-foreground">
          👋 Drag nodes from the left panel · Connect them to set prompt order ·
          Configure each node&apos;s values
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-3"
          onClick={dismiss}
        >
          Got it
        </Button>
      </div>
    </Panel>
  );
}
