"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

export function useWorkspaces() {
  const trpc = useTRPC();

  return useQuery(trpc.workspace.list.queryOptions());
}

export function useWorkspace(workspaceId: string) {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.workspace.get.queryOptions({ workspaceId }),
    enabled: Boolean(workspaceId),
  });
}

export function useCreateWorkspace() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workspace.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.workspace.list.queryKey(),
        });
      },
    }),
  );
}

export function useUpdateWorkspace() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workspace.update.mutationOptions({
      onSuccess: async (workspace) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.get.queryKey({ workspaceId: workspace.id }),
          }),
        ]);
      },
    }),
  );
}

export function useDeleteWorkspace() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workspace.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.workspace.list.queryKey(),
        });
      },
    }),
  );
}
