---
name: beatstack-prompt-graph
description: Domain logic for BeatStack — Suno prompt nodes, Zod schemas, topological assembly, presets in localStorage, and Zustand graph state. Use when changing lib/prompt.ts, lib/types.ts, lib/store.ts, nodeConfigs, or prompt output behavior.
---

# BeatStack — Prompt graph domain

## Mental model

- Each canvas node contributes a **text segment** for Suno.
- **Edges** define order among connected nodes (topological sort).
- **Disconnected** nodes append after connected ones (creation order within group).
- **`structure`** nodes always append **after** all other segments.

## Key files

| File | Responsibility |
|------|----------------|
| `lib/types.ts` | `NODE_TYPES`, Zod schemas, storage keys |
| `lib/prompt.ts` | `assemblePrompt`, `formatNodeSegment`, `topologicalOrder` |
| `lib/nodeConfigs.ts` | Defaults and UI options per type |
| `lib/store.ts` | Graph, undo, presets, randomize, `applyAiConfiguration` |
| `lib/graph-share.ts` | Encode/decode graph in URL param `graph` |
| `lib/graph-export.ts` | JSON export/import with Zod validation |
| `lib/prompt-history.ts` | Last 20 prompts in localStorage |
| `lib/ai-config.ts` | `AiNodeConfig`, `PromptEvaluation` schemas |
| `app/api/ai/route.ts` | Server proxy to Gemini (`GEMINI_API_KEY`) |

## Adding a node type

Follow command `/add-node-type` and keep segment formatting concise (comma-separated style in final prompt).

## Presets

- Shape: `PresetsMap` → name → `{ nodes, edges, savedAt? }`
- Storage: browser `localStorage` only; validate JSON parse errors gracefully (existing pattern in store)
- UI: `PresetsSheet.tsx`; shortcut Ctrl+S dispatches `beatstack:open-save-preset`

## Prompt history

- Key: `PROMPT_HISTORY_STORAGE_KEY` (`beatstack-prompt-history`)
- Max 20 entries; dedupe consecutive identical prompts
- Auto-saved via `usePromptHistory` (1s debounce on `computedPrompt`)

## Graph sharing

- `encodeGraphToUrlParam` / `decodeGraphFromUrlParam` — LZ-String base64
- `GraphShareFromUrl` loads `?graph=` on mount; confirms if canvas non-empty

## AI configuration

- User describes song → Gemini returns JSON matching `aiNodeConfigSchema`
- `applyAiConfiguration`: creates missing node types, patches data, auto-layout via `layoutIndexForNewTypes`
- Validates against `NODE_CONFIGS` enum options (genre, mood, etc.)

## Export/import

- `ExportedGraphFile`: `{ name, createdAt, nodes, edges }`
- Import replaces canvas (`replaceGraph`); confirms if canvas non-empty

## Invariants (do not break silently)

1. Empty graph → empty prompt string
2. Cycle in graph → fallback order (document in UI if you add cycle detection UX)
3. Empty custom text → omit segment
4. `instruments` empty array → omit segment
5. `vocals` "no vocals" → literal segment without style suffix

## Testing without a test suite

Manual matrix:

- Single node of each type
- Chain A→B→C vs reverse edges
- Mixed connected + disconnected
- Two `structure` nodes
- Save preset, reload page, load preset
