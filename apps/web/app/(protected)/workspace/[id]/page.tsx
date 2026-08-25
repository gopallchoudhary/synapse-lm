import { WorkspaceShell } from "~/features/workspaces/components/workspace-shell";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <WorkspaceShell workspaceId={id} />;
}
