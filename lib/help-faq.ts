export type HelpFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Single source for in-app Help dialog, /help page, and FAQPage JSON-LD. */
export const HELP_FAQ_ITEMS: HelpFaqItem[] = [
  {
    id: "add-nodes",
    question: "How do I add nodes to the canvas?",
    answer:
      "Drag node types from the left palette onto the canvas. You can place one node of each type per canvas.",
  },
  {
    id: "connect-nodes",
    question: "How does prompt segment order work?",
    answer:
      "Connect output ports to input ports on other nodes. The assembled Suno prompt follows the topological order of those connections.",
  },
  {
    id: "ai-configure",
    question: "How do I auto-configure nodes with AI?",
    answer:
      'Use "Describe your song" in the AI panel to fill node values from a text description. Requires GEMINI_API_KEY on the server.',
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
