# BeatStack

Editor visual de **prompts para Suno**: conecta nodos (género, mood, BPM, voces, etc.) en un canvas y el texto final se ensambla automáticamente según el orden de las conexiones.

## Stack

- **Next.js 16** (App Router)
- **@xyflow/react** — canvas del editor
- **Zustand** — estado del grafo
- **Zod** — validación por tipo de nodo
- **shadcn/ui** + **Tailwind CSS 4**
- **next-themes** — tema claro/oscuro
- **@ducanh2912/next-pwa** — instalable como PWA (solo en producción)

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Funciones con IA (opcional)

Las funciones **Describe your song** y **Evaluate prompt** usan Google Gemini vía `app/api/ai/route.ts`.

Crea `.env.local` en la raíz del proyecto:

```env
GEMINI_API_KEY=tu_clave_de_google_ai_studio
```

Sin esta variable, el editor funciona con normalidad; solo fallan las acciones de IA.

## Uso del editor

### Canvas y nodos

1. Arrastra un tipo de nodo desde la paleta izquierda (o haz clic para colocarlo en el centro).
2. Solo puede haber **un nodo de cada tipo** en el canvas.
3. Conecta salida → entrada para definir el **orden** de los segmentos del prompt.
4. Los nodos **structure** siempre se añaden al final del prompt, independientemente del grafo.
5. Elimina nodos o aristas con `Delete` / `Backspace`.

Tipos de nodo: `genre`, `mood`, `instruments`, `bpm`, `vocals`, `structure`, `era`, `custom`.

### Panel de salida

En la parte inferior se muestra el prompt ensamblado en tiempo real. Acciones:

- **Copy** — copiar al portapapeles
- **Export .txt** — descargar `suno-prompt.txt`
- **Evaluate prompt** — evaluación con IA (puntuación, fortalezas, sugerencias y prompt mejorado)

### Describe your song (IA)

Panel colapsable sobre el canvas. Escribe una descripción en inglés o español y pulsa **Configure nodes** para que Gemini:

- Cree nodos que falten en el canvas
- Rellene sus valores según la descripción
- Posicione los nodos nuevos con auto-layout

### Barra de herramientas

| Acción | Descripción |
|--------|-------------|
| **Presets** | Guardar, cargar y eliminar grafos en `localStorage` |
| **History** | Últimos 20 prompts generados (clic para copiar) |
| **Randomize** | Valores aleatorios en todos los nodos |
| **Export JSON** | Backup del grafo completo (nodos + aristas) |
| **Import JSON** | Restaurar un grafo exportado |
| **Share** | Copia un enlace con el grafo comprimido en la URL |
| **Help** | Atajos y guía rápida |
| **Theme** | Claro / oscuro / sistema |

### Atajos de teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+S` / `⌘S` | Abrir panel de presets para guardar |
| `Ctrl+Z` / `⌘Z` | Deshacer último cambio en el grafo |

### Compartir por URL

**Share** genera un enlace con el parámetro `?graph=…` (JSON comprimido con LZ-String). Al abrir el enlace:

- Si el canvas está vacío, el grafo se carga automáticamente.
- Si ya hay nodos, se pide confirmación antes de reemplazar.

### Controles del canvas

- **Minimap** — botón inferior derecho (preferencia en `localStorage`)
- **Fit view** — ajustar zoom al contenido
- Barra de estado inferior: cuenta nodos/conexiones y muestra si hay cambios sin guardar en la sesión local

## Persistencia local

| Clave | Contenido |
|-------|-----------|
| `suno-prompt-builder-presets` | Presets nombrados (grafos) |
| `beatstack-prompt-history` | Historial de prompts (máx. 20) |
| `beatstack-canvas-autosave` | Huella del grafo para indicador "Saved" |
| `beatstack-show-minimap` | Visibilidad del minimapa |
| `beatstack_ai_panel_open` | Panel de IA expandido/colapsado |
| `beatstack-snap-to-grid` | Preferencia de snap (interna) |
| `beatstack_hint_dismissed` | Hint de primera visita |
| `theme` | Tema claro/oscuro |

Los presets y el historial **no se sincronizan** entre dispositivos ni usuarios.

## PWA

En build de producción (`npm run build && npm start`), la app es instalable desde el navegador gracias a `manifest.json` y el service worker de `next-pwa`. En desarrollo la PWA está desactivada.

## Estructura del proyecto

```
app/
  layout.tsx, page.tsx, globals.css
  api/ai/route.ts       — proxy a Gemini (server-side)
components/
  editor/               — Editor, Toolbar, nodos, paneles
  ui/                   — shadcn
lib/
  prompt.ts             — ensamblado del prompt (orden topológico)
  store.ts              — Zustand: grafo, undo, presets, IA
  types.ts              — tipos de nodo y schemas Zod
  nodeConfigs.ts        — defaults y opciones por nodo
  graph-share.ts        — compartir por URL
  graph-export.ts       — export/import JSON
  prompt-history.ts     — historial de prompts
  ai-config.ts          — schemas de respuesta IA
  ai-client.ts          — cliente del route handler
```

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servir build
npm run lint     # ESLint
```

## Documentación para agentes

Ver [AGENTS.md](./AGENTS.md), `.cursor/rules/` y `.cursor/skills/`.

## Fuera de alcance actual

- Integración directa con la API de Suno para generar audio
- Base de datos, autenticación o sync en la nube
- Restauración automática del canvas al recargar (solo indicador de estado local)
