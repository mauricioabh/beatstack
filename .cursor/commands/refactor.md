---
name: /refactor
description: Mejora calidad del código sin cambiar comportamiento observable
category: workflow
---

# /refactor — Refactor

## Antes

1. Lee `.cursor/rules/beatstack-context.mdc` y `Convenciones-de-codigo.mdc`
2. Analiza el módulo objetivo
3. Plan: problemas actuales, cambios propuestos, archivos afectados
4. Espera aprobación

## Válido en BeatStack

- Extraer lógica de nodos a helpers en `lib/`
- Mejorar tipado Zod / inferencias
- Simplificar selectores Zustand
- Componentes UI más pequeños (sin cambiar UX)

## Reglas

- El prompt ensamblado y los presets deben comportarse igual
- Un commit atómico por cambio lógico
- Bugs encontrados → reportar, corregir con `/fix`
