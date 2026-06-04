import { WorkspaceDetail } from "@/components/library/WorkspaceDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkspaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <WorkspaceDetail workspaceId={id} />;
}
