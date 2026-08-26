"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

export function useConversations(workspaceId: string) {
	const trpc = useTRPC();
	return useQuery({
		...trpc.chat.list.queryOptions({ workspaceId }),
		enabled: Boolean(workspaceId),
	});
}

export function useConversationMessages(
	workspaceId: string,
	conversationId: string | null,
) {
	const trpc = useTRPC();
	return useQuery({
		...trpc.chat.messages.queryOptions({
			workspaceId,
			conversationId: conversationId ?? "",
		}),
		enabled: Boolean(workspaceId && conversationId),
	});
}

export function useCreateConversation(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(
		trpc.chat.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.chat.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}

export function useDeleteConversation(workspaceId: string) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	return useMutation(
		trpc.chat.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.chat.list.queryKey({ workspaceId }),
				});
			},
		}),
	);
}