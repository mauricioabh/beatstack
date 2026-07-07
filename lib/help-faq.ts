export type HelpFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Last content review for AEO freshness signals. */
export const HELP_FAQ_LAST_UPDATED = "2026-07-06";

/** Single source for in-app Help dialog, /help page, and FAQPage JSON-LD. */
export const HELP_FAQ_ITEMS: HelpFaqItem[] = [
  {
    id: "add-nodes",
    question: "How do I add nodes to the canvas?",
    answer:
      "Drag a node type from the left palette onto the canvas, or click a palette item to place it at the center. BeatStack allows only one node of each type per canvas, so duplicate types are blocked automatically. Available types include genre, mood, instruments, BPM, vocals, structure, era, and custom.",
  },
  {
    id: "connect-nodes",
    question: "How does prompt segment order work?",
    answer:
      "Connect each node's output port to another node's input port to define the order of Suno prompt segments. BeatStack assembles the final text by following the topological order of those connections from start to end. Structure nodes are always appended at the end of the prompt, regardless of where they sit in the graph.",
  },
  {
    id: "ai-configure",
    question: "How do I auto-configure nodes with AI?",
    answer:
      'Open the "Describe your song" panel above the canvas, type a song description in English or Spanish, and click Configure nodes. Gemini creates missing nodes, fills their values from your description, and auto-layouts new nodes on the canvas. This feature requires GEMINI_API_KEY configured on the server; without it, the rest of the editor still works.',
  },
  {
    id: "presets-share",
    question: "How do I save or share my graph?",
    answer:
      "Use Presets in the top bar to save locally. Share copies a URL with your graph encoded in the query string.",
  },
  {
    id: "workspace",
    question: "How do I save generations to a workspace?",
    answer:
      "Save generations to a workspace from the output panel. Workspaces live in your browser library.",
  },
  {
    id: "randomize",
    question: "What does Randomize do?",
    answer:
      "Randomize picks random values for every node on the canvas to explore new prompt combinations quickly.",
  },
  {
    id: "export-import",
    question: "How do I back up a graph?",
    answer:
      "Export / Import JSON downloads or restores the full node graph, including positions and connections.",
  },
  {
    id: "shortcut-save",
    question: "What does Ctrl+S (or ⌘S) do?",
    answer: "Opens the presets sheet so you can save the current graph.",
  },
  {
    id: "shortcut-undo",
    question: "What does Ctrl+Z (or ⌘Z) do?",
    answer: "Undoes the last graph change (add, remove, connect, drag, delete, randomize, or AI apply).",
  },
];
