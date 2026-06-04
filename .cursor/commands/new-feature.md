---
name: /new-feature
description: Implementa un feature siguiendo convenciones de BeatStack
category: workflow
---

# /new-feature — Nuevo feature

## Antes de escribir código

1. Lee `.cursor/rules/beatstack-context.mdc` y `Convenciones-de-codigo.mdc`
2. Si afecta el canvas, lee `xyflow-editor.mdc`
3. Revisa archivos existentes en `components/editor/` y `lib/`

## Plan obligatorio

Presenta:

- Archivos nuevos y modificados
- Si añade tipo de nodo → checklist de `/add-node-type`
- Si añade persistencia → formato y clave en `localStorage`
- Si añade API/auth/DB → fuera de scope actual; pedir confirmación explícita

Pregunta: "¿Apruebas este plan o hay algo que ajustar?"
Solo procede con aprobación.

## Orden de implementación típico

1. Tipos y schemas (`lib/types.ts`)
2. Lógica pura (`lib/prompt.ts`, `lib/nodeConfigs.ts`)
3. Store Zustand si hace falta (`lib/store.ts`)
4. Componentes de nodo y registro en `nodeTypes`
5. UI (Toolbar, paleta, paneles)
6. `app/` solo si hay nueva ruta o metadata

## Reglas

- TypeScript estricto
- `"use client"` solo donde haga falta
- shadcn vía CLI: `npx shadcn@latest add <component>`
- UI sin jerga técnica (`ui-user-facing.mdc`)

## Al terminar

Resumen de archivos tocados, cómo probar manualmente, y sugerir `/post-implementation`.
