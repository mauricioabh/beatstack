---
name: /add-node-type
description: Añade un nuevo tipo de nodo al editor de prompts Suno
category: workflow
---

# /add-node-type — Nuevo tipo de nodo

## Checklist (en orden)

1. **`lib/types.ts`**
   - Añadir literal a `NODE_TYPES`
   - Schema Zod + tipo `*NodeData`
   - Incluir en unión `SunoNodeData` si aplica

2. **`lib/nodeConfigs.ts`**
   - Label, valores por defecto, opciones de UI

3. **`lib/prompt.ts`**
   - Rama en `formatNodeSegment` con formato coherente para Suno
   - Decidir si va al bloque `structure` o al bloque general

4. **`components/editor/nodes/`**
   - `XxxNode.tsx` extendiendo patrón de `BaseNode`
   - Export en `nodes/index.ts` en `nodeTypes`

5. **`components/editor/NodePalette.tsx`**
   - Entrada draggable con el nuevo tipo

6. **`lib/store.ts`**
   - `getDefaultNodeData` / `addNode` si requiere lógica especial

## Verificación

- Nodo suelto y conectado en cadena producen segmento correcto
- Preset guardado restaura datos del nuevo nodo
- `npm run build` sin errores de tipos

## Skill de referencia

`.cursor/skills/beatstack-prompt-graph/SKILL.md`
