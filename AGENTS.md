<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BeatStack — guía para agentes

Editor visual de **prompts para Suno**: nodos conectados en un canvas; el texto se ensambla en `lib/prompt.ts`.

## Stack

Next.js 16 · @xyflow/react · Zustand · Zod · shadcn/ui · Tailwind 4 · Gemini (opcional) · PWA · localStorage

## Funcionalidades del producto

### Core (grafo y prompt)

- 8 tipos de nodo (`lib/types.ts`); máximo uno de cada tipo en canvas (`hasNodeTypeOnCanvas`)
- Ensamblado topológico en `lib/prompt.ts`; nodos `structure` siempre al final
- Prompt recalculado en vivo en `store.ts` → `computedPrompt`
- Paleta drag-and-drop + clic (`lib/palette-dnd.ts`, `NodePalette.tsx`)

### Persistencia y portabilidad

| Feature | Archivos | Notas |
|---------|----------|-------|
| Presets | `store.ts`, `PresetsSheet.tsx` | `PRESETS_STORAGE_KEY`; incluye `savedAt` |
| Historial de prompts | `prompt-history.ts`, `use-prompt-history.ts`, `HistorySheet.tsx` | Debounce 1s; máx. 20 entradas |
| Export/import JSON | `graph-export.ts`, `Toolbar.tsx` | Schema Zod `exportedGraphFileSchema` |
| Compartir URL | `graph-share.ts`, `use-graph-share.ts`, `GraphShareFromUrl.tsx` | LZ-String + param `graph` |
| Autosave indicator | `CanvasStatusBar.tsx` | Solo fingerprint; **no restaura** el grafo |

### IA (requiere `GEMINI_API_KEY`)

| Feature | Archivos | Notas |
|---------|----------|-------|
| Configurar nodos desde texto | `SongConfigurator.tsx`, `ai-config.ts`, `ai-prompts.ts` | `applyAiConfiguration` en store |
| Evaluar prompt | `PromptEvaluateDialog.tsx` | Score 1–10, sugerencias, prompt mejorado |
| API route | `app/api/ai/route.ts` | Gemini (`gemini-2.5-flash` por defecto, `GEMINI_MODEL`); clave solo server-side |
| Cliente | `lib/ai-client.ts` | POST a `/api/ai` |
| Parseo JSON de IA | `lib/parse-ai-json.ts` | Extrae JSON de respuestas con texto extra |

### UX del editor

- Undo (`Ctrl+Z`): stack de 50 snapshots; `pushUndo` en add/remove/connect/drag/delete/randomize/IA
- Randomize: `lib/randomize.ts` + animación pulse en nodos
- Atajo `Ctrl+S`: abre presets con foco en guardar (`use-editor-keyboard.ts`)
- Tema claro/oscuro (`theme-provider`, `theme-toggle`)
- Minimap toggle, fit view, empty state, first-visit hint
- Animación de aristas al cambiar el grafo (`edgesAnimating`)
- Panel IA colapsable con estado en `beatstack_ai_panel_open` (`lib/ai-panel.ts`)
- Help dialog en `CreateToolbar.tsx`; FAQ indexable en `/help` (`lib/help-faq.ts`)

### PWA

- `next.config.ts` + `@ducanh2912/next-pwa` (disabled en dev)
- `public/manifest.json`, iconos en `public/icons/`

## Reglas del proyecto (`.cursor/rules/`)

| Regla | Cuándo |
|-------|--------|
| `beatstack-context.mdc` | Siempre — contexto y estructura |
| `Convenciones-de-codigo.mdc` | Siempre — TS, editor, guardrails |
| `Convenciones-de-Git.mdc` | Commits y ramas |
| `powershell-commands.mdc` | Terminal en Windows |
| `ui-user-facing.mdc` | Texto en `app/` y `components/` |
| `omni-visibility.mdc` | Cambios en `app/`, `lib/seo/`, FAQ indexable |
| `xyflow-editor.mdc` | Canvas, store, prompt |

## Commands (`.cursor/commands/`)

- `/fix` — bugs
- `/new-feature` — features con plan
- `/refactor` — refactor sin cambiar UX del prompt
- `/add-node-type` — nuevo nodo en el grafo
- `/post-implementation` — checklist pre-commit
- `/ship` — lint, build, commit, PR

## Skills (`.cursor/skills/`)

| Skill | Uso |
|-------|-----|
| `beatstack-prompt-graph` | Tipos, ensamblado, presets, store, IA, share |
| `xyflow-react-patterns` | Canvas y nodos React Flow |
| `nextjs-app-router-patterns` | App Router / Server vs Client |
| `omni-visibility-engine` | SEO, OG/Twitter, JSON-LD, robots/sitemap, GEO/RAG |
| `shadcn-ui-patterns` | Componentes shadcn |
| `ui-shadcn-tailwind` | Layout, a11y, estados UI |

## Hooks

`pre-tool-call.js` bloquea comandos destructivos y avisa al editar `lib/prompt.ts`, `lib/store.ts`, `lib/types.ts`, `lib/nodeConfigs.ts`.

## Archivos críticos

- `lib/prompt.ts` — orden y formato del prompt Suno
- `lib/store.ts` — grafo, undo, presets, randomize, `applyAiConfiguration`
- `lib/types.ts` — `NODE_TYPES`, schemas Zod, claves localStorage
- `app/api/ai/route.ts` — proxy Gemini (no exponer API key al cliente)
- `lib/graph-share.ts` — encoding/decoding de grafos en URL

## Variables de entorno

| Variable | Requerida | Uso |
|----------|-----------|-----|
| `GEMINI_API_KEY` | Solo para IA | Route handlers `/api/ai`, `/api/lyrics` |
| `NEXT_PUBLIC_SITE_URL` | Prod (recomendado) | Canonical, sitemap, OG, JSON-LD (`lib/seo/site.ts`); si falta, fallback `RENDER_EXTERNAL_URL` |
| `OMNI_ALLOW_PREVIEW_INDEX` | No | `true` indexa deployments preview (Render branch ≠ `main`, Vercel preview) |

## Fuera de scope (por ahora)

- API de Suno para generar música
- Base de datos, auth, sync en nube
- Redo (`Ctrl+Shift+Z`) — no implementado
- UI para toggle snap-to-grid — preferencia existe en store pero sin control visible

## Origen de esta configuración

Copiada y adaptada desde proyectos en `C:\Projects` (`cursor-project-setup`, `tekae`, `labby-dabby`, `mangatrack`).
