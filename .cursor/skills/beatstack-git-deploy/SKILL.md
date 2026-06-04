---
name: beatstack-git-deploy
description: Git and Vercel workflow for BeatStack — dev branch commits, PR to main, GitHub remote, and GEMINI_API_KEY on Vercel. Use when pushing code, opening PRs, deploying, or configuring env on Vercel.
---

# BeatStack — Git y despliegue

## GitHub
- Repo público: https://github.com/mauricioabh/beatstack
- Rama por defecto en GitHub: **dev**

## Flujo local → remoto → producción
1. Rama de trabajo local: **dev** (o `feat/*` / `fix/*` desde `dev`).
2. Commit y push: `git push origin dev` — **no** push a `main`.
3. Release: PR en GitHub **dev → main**; merge solo cuando esté listo para producción.
4. `feat/*` y `fix/*`: PR hacia **dev**, no hacia `main`.

## Vercel
- Proyecto: `mauricioabhs-projects/beatstack` (dashboard: https://vercel.com/mauricioabhs-projects/beatstack)
- Repo Git conectado: `https://github.com/mauricioabh/beatstack`
- **Production** → rama **main** (Vercel la elige si existe; no confundir con la rama por defecto de GitHub, que es `dev`).
- **Preview** → pushes y PRs en `dev` y otras ramas que no sean `main`.
- Variable de entorno requerida en Vercel (Production, Preview, Development): `GEMINI_API_KEY` (solo server-side; ver `.env.example`).

## Comandos útiles
```bash
git checkout dev
git push origin dev
gh pr create --base main --head dev --title "..." --body "..."
vercel env ls
```

Regla detallada: `.cursor/rules/Convenciones-de-Git.mdc`.
