---
name: xyflow-react-patterns
description: React Flow (@xyflow/react) patterns for BeatStack's node editor — providers, custom nodes, drag-drop palette, store integration, and performance. Use when editing components/editor or graph interactions.
---

# React Flow — BeatStack editor

## Setup

```tsx
import { ReactFlowProvider, ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
```

Wrap app section with `ReactFlowProvider`; canvas uses `useReactFlow()` for `screenToFlowPosition`.

## Custom nodes

- Register map: `const nodeTypes = { genre: GenreNode, ... }`
- Pass to `<ReactFlow nodeTypes={nodeTypes} />`
- Node component receives `NodeProps`; update data via store callbacks, not mutating props in place

## Store wiring

```tsx
const nodes = useEditorStore((s) => s.nodes);
const onNodesChange = useEditorStore((s) => s.onNodesChange);
// use applyNodeChanges / applyEdgeChanges from @xyflow/react inside store
```

## Drag from palette

1. `dragstart` → `dataTransfer.setData(DRAG_NODE_TYPE_KEY, type)`
2. `onDragOver` → `preventDefault`, `dropEffect = "move"`
3. `onDrop` → `screenToFlowPosition({ x: clientX, y: clientY })` → `addNode`

## UX defaults

- `deleteKeyCode={["Backspace", "Delete"]}`
- `fitView` on init with padding
- `proOptions={{ hideAttribution: true }}` if license allows

## Pitfalls

- Do not import React Flow CSS twice
- Avoid storing React Flow `instance` in Zustand unless necessary
- MiniMap and Controls are optional; keep layout responsive (`flex-1` canvas)
