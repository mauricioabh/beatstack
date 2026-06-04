---
name: /ship
description: Verifica, commitea y abre PR con los cambios actuales
category: workflow
---

# /ship — Verificar y publicar cambios

## 1. Estado

```powershell
git status
git diff
```

## 2. Calidad

```powershell
npm run lint
npm run build
```

## 3. Rama

```powershell
git checkout -b feat/<nombre>
```

## 4. Commit

Convencional: `tipo(scope): descripción` (ver `Convenciones-de-Git.mdc`)

```powershell
git add .
git commit -m "feat(editor): descripción"
```

## 5. Push y PR

```powershell
git push -u origin HEAD
gh pr create
```

En features grandes, correr `/post-implementation` antes.
