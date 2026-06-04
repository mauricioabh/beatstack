---
name: /post-implementation
description: Checklist de cierre después de implementar cualquier cambio
category: workflow
---

# /post-implementation — Checklist de cierre

## 1. Documentación

| Si cambió... | Actualizar... |
|--------------|---------------|
| Nuevo tipo de nodo | `AGENTS.md` o README si es feature visible |
| Nuevo command | `.cursor/commands/README.md` + `AGENTS.md` |
| `package.json` deps | README si afecta setup |

## 2. Calidad

```powershell
npm run lint
npm run build
```

## 3. Residuos

- Sin `console.log` de debug
- Sin secretos en código

## 4. Smoke test manual

- Añadir nodos, conectar, copiar prompt
- Guardar y cargar preset
- Tema claro/oscuro si tocaste estilos

## 5. Ship

- `/ship` para commit y PR
