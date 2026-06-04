"use client";

import { useEffect, useMemo, useState } from "react";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useEditorStore } from "@/lib/store";
import {
  PRESETS_STORAGE_KEY,
  PROMPT_HISTORY_STORAGE_KEY,
} from "@/lib/types";
import { SNAP_TO_GRID_STORAGE_KEY } from "@/lib/editor-grid";

const AUTOSAVE_STORAGE_KEY = "beatstack-canvas-autosave";
const AUTOSAVE_DEBOUNCE_MS = 1500;

type AutosavePayload = {
  fingerprint: string;
  savedAt: number;
};

function graphFingerprint(
  nodes: ReturnType<typeof useEditorStore.getState>["nodes"],
  edges: ReturnType<typeof useEditorStore.getState>["edges"],
): string {
  return JSON.stringify({
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    })),
  });
}

function loadAutosave(): AutosavePayload | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AutosavePayload;
  } catch {
    return null;
  }
}

export function CanvasStatusBar() {
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);

  const fingerprint = useMemo(
    () => graphFingerprint(nodes, edges),
    [nodes, edges],
  );

  const [mounted, setMounted] = useState(false);
  const [savedFingerprint, setSavedFingerprint] = useState(fingerprint);
  const [lastSavedAt, setLastSavedAt] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    const autosave = loadAutosave();
    if (autosave) {
      setSavedFingerprint(autosave.fingerprint);
      setLastSavedAt(autosave.savedAt);
    } else {
      setLastSavedAt(Date.now());
    }
    setMounted(true);
  }, []);

  const isDirty = fingerprint !== savedFingerprint;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const payload: AutosavePayload = {
        fingerprint,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* ignore quota errors */
      }
      setSavedFingerprint(fingerprint);
      setLastSavedAt(payload.savedAt);
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [fingerprint]);

  useEffect(() => {
    if (isDirty) return;
    const interval = window.setInterval(() => setTick((t) => t + 1), 30_000);
    return () => window.clearInterval(interval);
  }, [isDirty, lastSavedAt]);

  return (
    <div className="flex h-6 shrink-0 items-center justify-between bg-muted/15 px-4 text-[11px] text-muted-foreground">
      <span>
        {nodes.length} {nodes.length === 1 ? "node" : "nodes"} · {edges.length}{" "}
        {edges.length === 1 ? "connection" : "connections"}
      </span>
      <span>
        {isDirty ? (
          "Unsaved changes"
        ) : !mounted || lastSavedAt === 0 ? (
          "Saved"
        ) : (
          <>Saved {formatRelativeTime(lastSavedAt)}</>
        )}
      </span>
    </div>
  );
}

export function hasPriorSessionData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem("beatstack_hint_dismissed")) return true;
    if (localStorage.getItem(PRESETS_STORAGE_KEY)) return true;
    if (localStorage.getItem(AUTOSAVE_STORAGE_KEY)) return true;
    if (localStorage.getItem(SNAP_TO_GRID_STORAGE_KEY)) return true;
    if (localStorage.getItem("beatstack-show-minimap")) return true;
    if (localStorage.getItem("beatstack_ai_panel_open")) return true;
    if (localStorage.getItem(PROMPT_HISTORY_STORAGE_KEY)) return true;
    return false;
  } catch {
    return false;
  }
}
