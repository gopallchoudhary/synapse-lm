"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

export function useArtifacts(workspaceId: string) {
	const trpc = useTRPC();

	return useQuery({
		...trpc.artifact.list.queryOptions({ workspaceId }),
		enabled: Boolean(workspaceId),
		refetchInterval: (query) => {
			const data = query.state.data as
				| { status: string }[]
				| undefined;
			if (!data) return false;
			const hasPending = data.some(
				(artifact) =>
					artifact.status === "PENDING" || artifact.status === "PROCESSING",
			);
			return hasPending ? 4000 : false;
		},
	});
}

export function useArtifact(
	workspaceId: string,
	artifactId: string | null,
) {
	const trpc = useTRPC();

	return useQuery({
		...trpc.artifact.get.queryOptions({
			workspaceId,
			artifactId: artifactId ?? "",
		}),
		enabled: Boolean(workspaceId && artifactId),
	});
}

export function useCreateArtifact(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.artifact.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.artifact.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useDeleteArtifact(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.artifact.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.artifact.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}