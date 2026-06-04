---
name: omni-visibility-engine
description: >-
  Omni-Visibilidad para Next.js App Router — SEO técnico (Metadata API),
  OpenGraph/Twitter, Schema.org JSON-LD (SoftwareApplication, FAQPage),
  robots/sitemap con bots de IA, y HTML semántico para GEO/RAG. Usar al
  crear o editar app/layout.tsx, app/**/page.tsx, app/robots.ts,
  app/sitemap.ts, lib/seo/**, lib/help-faq.ts, o al añadir páginas públicas.
---

# Omni-Visibility Engine

Estrategia obligatoria para SaaS en este workspace: **indexable (SEO)**, **compartible (OG/Twitter)** y **citables por LLMs (GEO/AEO)**.

## Triggers

Aplicar cuando:

- Se añade, renombra o borra una ruta bajo `app/` (excepto `app/api/**`).
- Se modifica `metadata`, `generateMetadata`, o layouts de segmento.
- Se crea ayuda, marketing, changelog o docs públicos.
- El usuario menciona SEO, GEO, AEO, RAG, schema, robots, sitemap, Open Graph.

**Cierre:** checklist §8 antes de terminar.

## Principios (Next.js 16)

1. **Server-first:** metadata y JSON-LD en Server Components / exports de layout/page. FAQ pública no solo en dialogs cliente.
2. **Fuente única:** `lib/seo/site.ts`, `lib/seo/metadata.ts` (`buildPageMetadata`), `lib/seo/json-ld.ts`, `lib/seo/routes.ts`.
3. **`metadataBase`** en root vía `rootLayoutMetadata()` + `NEXT_PUBLIC_SITE_URL` (fallback `VERCEL_URL`, dev `localhost:3000`).
4. **No indexar** previews (`VERCEL_ENV=preview`), workspaces privados, URLs con estado sensible (`/create?graph=` usa `generateMetadata` + `GRAPH_URL_PARAM`).
5. **PWA:** conservar `manifest` e icons al extender metadata.

## SEO (Metadata API)

- Root: `rootLayoutMetadata()` en `app/layout.tsx`.
- Cada ruta pública: `buildPageMetadata({ title, description, pathname, noIndex? })`.
- Canonical vía `alternates.canonical` (path relativo; resuelto con `metadataBase`).

## Social

- OG `type: website`, `summary_large_image` en Twitter.
- Imagen: `app/opengraph-image.tsx` (1200×630) — path `/opengraph-image`.
- No usar SVG como única imagen social.

## GEO — JSON-LD

- Layout root: `SoftwareApplication` (`softwareApplicationJsonLd()`).
- `/help`: `FAQPage` desde `HELP_FAQ_ITEMS` (`lib/help-faq.ts`) — mismo texto en DOM y schema.
- Componente: `components/seo/JsonLd.tsx`.

## HTML para RAG

- `AppShell` ya expone `<main>`; páginas públicas usan `<article>`, `<header>`, FAQ con `<section>` + `<dl>`.
- Evitar copy crítico solo en modales cliente.

## Crawlability

- `app/robots.ts`: allow `*`, disallow `/api/`; reglas explícitas `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
- Preview: `disallow: /` si `!allowSearchIndexing()`.
- `app/sitemap.ts`: solo paths en `PUBLIC_SITEMAP_PATHS` (`lib/seo/routes.ts`).

## Env

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap, JSON-LD, OG absolutos |
| `OMNI_ALLOW_PREVIEW_INDEX` | `true` para indexar previews (raro) |

## Checklist §8

- [ ] `metadataBase` + canonical por ruta pública
- [ ] OG + Twitter con imagen real
- [ ] `SoftwareApplication` en root
- [ ] FAQ HTML + `FAQPage` si hay ayuda
- [ ] `robots.ts` + bots IA
- [ ] `sitemap.ts` alineado con rutas
- [ ] `npm run build` limpio
- [ ] `AGENTS.md` actualizado si cambia env o rutas públicas

## Integración BeatStack

- Editor: `"use client"` en `components/editor/`; metadata en `app/create/page.tsx` (`generateMetadata` si hay `?graph=`).
- Help: `lib/help-faq.ts` → dialog + `/help`.
- Workspaces `[id]`: `noIndex: true`, fuera del sitemap.

## Anti-patrones

- FAQ solo en modal sin `/help`.
- Metadata duplicada sin `buildPageMetadata`.
- `noindex` en producción por env mal configurado.
- JSON-LD que contradice el HTML visible.
