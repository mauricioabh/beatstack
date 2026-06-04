---
name: /fix
description: Diagnostica y corrige un bug de manera sistemática
category: workflow
---

# /fix — Corregir un bug

## 1. Entender

- Síntoma (UI del editor, ensamblado del prompt, presets, drag & drop)
- Capa: React Flow, Zustand, `assemblePrompt`, nodo concreto, shadcn

## 2. Reproducir

```powershell
npm run dev
npm run lint
npm run build
```

## 3. Corregir

- Cambio mínimo; no refactorizar de más
- Si toca `lib/prompt.ts` o `lib/store.ts`, verificar grafos con y sin ciclo, nodos sueltos y `structure` al final

## 4. Verificar

- Copiar prompt desde `OutputPanel` y comprobar orden esperado
- Guardar/cargar preset si el bug afecta persistencia
