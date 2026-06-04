import type { Metadata } from "next";
import { Editor } from "@/components/editor/Editor";
import { GRAPH_URL_PARAM } from "@/lib/graph-share";
import { buildPageMetadata } from "@/lib/seo/metadata";

const CREATE_DESCRIPTION =
  "Build Suno music prompts with a visual node graph. Connect genre, mood, BPM, vocals, and structure nodes; share and export your graph.";

type CreatePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: CreatePageProps): Promise<Metadata> {
  const params = await searchParams;
  const graphParam = params[GRAPH_URL_PARAM];
  const hasSharedGraph =
    (typeof graphParam === "string" && graphParam.length > 0) ||
    (Array.isArray(graphParam) && graphParam.some((v) => v.length > 0));

  return buildPageMetadata({
    title: "Create",
    description: CREATE_DESCRIPTION,
    pathname: "/create",
    noIndex: hasSharedGraph,
  });
}

export default function CreatePage() {
  return <Editor />;
}
