import { WorkspaceDetail } from "@/components/library/WorkspaceDetail";

export const dynamic = "force-dynamic";

type WorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkspaceDetailPage({ params }: WorkspacePageProps) {
  const { id } = await params;
  return <WorkspaceDetail workspaceId={id} />;
}
