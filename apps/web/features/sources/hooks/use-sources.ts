"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { env } from "~/env";
import { useTRPC } from "~/trpc/client";

export function useSources(workspaceId: string) {
	const trpc = useTRPC();

	return useQuery({
		...trpc.source.list.queryOptions({ workspaceId }),
		enabled: Boolean(workspaceId),
	});
}

export function useCreateTextSource(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.source.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.source.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useImportWebsite(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.source.importWebsite.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.source.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useImportYoutube(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.source.importYoutube.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.source.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useDeleteSource(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.source.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.source.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useReprocessSource(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.source.reprocess.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.source.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useUploadPdf(workspaceId: string) {
	const { getToken } = useAuth();
	const queryClient = useQueryClient();
	const trpc = useTRPC();

	return useMutation({
		mutationFn: async (input: { file: File; title?: string }) => {
			const token = await getToken();
			const formData = new FormData();
			formData.append("file", input.file);
			if (input.title?.trim()) {
				formData.append("title", input.title.trim());
			}

			const baseUrl = (env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
				.replace(/\/trpc\/?$/, "");

			const response = await fetch(
				`${baseUrl}/workspace/${workspaceId}/sources/upload`,
				{
					method: "POST",
					headers: token ? { authorization: `Bearer ${token}` } : {},
					body: formData,
					credentials: "include",
				},
			);

			if (!response.ok) {
					const message = await response
						.json()
						.then((body: { message?: string; error?: string }) => body.message ?? body.error)
					.catch(() => undefined);
				throw new Error(
					message ?? "PDF upload failed. Try a file under 10MB.",
				);
			}

			return (await response.json()) as { id: string };
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: trpc.source.list.queryKey({ workspaceId }),
			});
		},
	});
}
