---
name: beatstack-git-deploy
description: Git and Render workflow for BeatStack — dev branch commits, PR to main, GitHub remote, and env vars on Render. Use when pushing code, opening PRs, deploying, or configuring env on Render.
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

## Render (producción)
- Web Service: **beatstack** — https://beatstack-1vba.onrender.com — Blueprint en `render.yaml`
- Repo: `https://github.com/mauricioabh/beatstack`
- **Production** → rama **main** (auto-deploy en cada push/merge a `main`)
- Build: `npm install && npm run build`
- Start: `npm run start`
- Plan recomendado: **starter** (sin spin-down del free tier)
- Variables en Render Dashboard (Environment):
  - `GEMINI_API_KEY` — server-side, IA (Describe song, Evaluate, Lyrics)
  - `NEXT_PUBLIC_SITE_URL` — URL canónica pública (ej. `https://beatstack.onrender.com` o dominio custom)
  - Opcional: `OMNI_ALLOW_PREVIEW_INDEX=true` en previews no-main

Render inyecta `RENDER_EXTERNAL_URL` y `RENDER_GIT_BRANCH`; `lib/seo/site.ts` los usa si falta `NEXT_PUBLIC_SITE_URL`.

## Comandos útiles
```bash
git checkout dev
git push origin dev
gh pr create --base main --head dev --title "..." --body "..."
```

Regla detallada: `.cursor/rules/Convenciones-de-Git.mdc`.
