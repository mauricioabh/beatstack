export const AI_PANEL_STORAGE_KEY = "beatstack_ai_panel_open";

export const AI_PANEL_CHANGE_EVENT = "beatstack:ai-panel-change";

export function readAiPanelOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AI_PANEL_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeAiPanelOpen(open: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AI_PANEL_STORAGE_KEY, String(open));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(
    new CustomEvent(AI_PANEL_CHANGE_EVENT, { detail: { open } }),
  );
}

export function collapseAiPanel(): void {
  writeAiPanelOpen(false);
}
