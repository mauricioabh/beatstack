export const PRODUCT_NAME = "BeatStack";

export const DEFAULT_DESCRIPTION =
  "Node-based visual editor for composing Suno AI music prompts. Connect genre, mood, BPM, and structure nodes into shareable, exportable prompt graphs.";

/** Absolute OG image URL path (served by app/opengraph-image.tsx). */
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const render = process.env.RENDER_EXTERNAL_URL?.trim();
  if (render) return render.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

/** Production branch on Render; preview / non-main deploys should not be indexed. */
export const PRODUCTION_GIT_BRANCH = "main";

export function isPreviewDeployment(): boolean {
  if (process.env.VERCEL_ENV === "preview") return true;

  const renderBranch = process.env.RENDER_GIT_BRANCH?.trim();
  if (renderBranch && renderBranch !== PRODUCTION_GIT_BRANCH) return true;

  return false;
}

/** Block indexing on preview deployments unless explicitly overridden. */
export function allowSearchIndexing(): boolean {
  if (process.env.OMNI_ALLOW_PREVIEW_INDEX === "true") return true;
  return !isPreviewDeployment();
}
