import type { Metadata } from "next";
import { WorkspaceDetail } from "@/components/library/WorkspaceDetail";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type WorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: WorkspacePageProps): Promise<Metadata> {
  const { id } = await params;
  return buildPageMetadata({
    title: "Workspace",
    description: `BeatStack workspace ${id}. Private browser-local library view.`,
    pathname: `/library/workspaces/${id}`,
    noIndex: true,
  });
}

export default async function WorkspaceDetailPage({ params }: WorkspacePageProps) {
  const { id } = await params;
  return <WorkspaceDetail workspaceId={id} />;
}
