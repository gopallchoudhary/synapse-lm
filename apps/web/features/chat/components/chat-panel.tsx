"use client";

import { useAuth } from "@clerk/nextjs";
import { Spinner } from "~/components/ui/spinner";
import { useSources } from "~/features/sources/hooks/use-sources";
import { useConversations } from "../hooks/use-conversation";

import { ChatThread } from "./chat-thread";

export function ChatPanel({ workspaceId }: { workspaceId: string }) {
	const { getToken } = useAuth();
	const conversationsQuery = useConversations(workspaceId);
	const sourcesQuery = useSources(workspaceId);

	const readySourcesCount = (sourcesQuery.data ?? []).filter(
		(source) => source.status === "READY",
	).length;

	if (conversationsQuery.isPending) {
		return (
			<div className="flex h-full flex-col">
				<div className="flex h-10 items-center justify-between border-b border-border pb-3">
					<span className="text-sm font-semibold">Chat</span>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<Spinner className="size-6" />
				</div>
			</div>
		);
	}

	if (conversationsQuery.error) {
		return (
			<div className="flex h-full flex-col gap-3">
				<div className="flex items-center justify-between border-b border-border pb-3">
					<span className="text-sm font-semibold">Chat</span>
				</div>
				<div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
					Unable to load conversations: {conversationsQuery.error.message}
				</div>
			</div>
		);
	}

	return (
		<ChatThread
			workspaceId={workspaceId}
			getToken={getToken}
			conversations={conversationsQuery.data ?? []}
			readySourcesCount={readySourcesCount}
		/>
	);
}