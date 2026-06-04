export const LYRICS_PANEL_STORAGE_KEY = "beatstack_lyrics_panel_open";

export function readLyricsPanelOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LYRICS_PANEL_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeLyricsPanelOpen(open: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LYRICS_PANEL_STORAGE_KEY, String(open));
  } catch {
    /* ignore */
  }
}
