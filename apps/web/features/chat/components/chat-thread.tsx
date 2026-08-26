"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
	ChevronDown,
	Globe,
	Plus,
	Send,
	Square,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { env } from "~/env";
import {
	useConversationMessages,
	useDeleteConversation,
} from "../hooks/use-conversation";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

type ConversationMeta = {
	id: string;
	title: string | null;
	updatedAt: string | Date;
};

function formatTime(value: string | Date) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(String(value)));
}

function getApiBase() {
	return (env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
}

function toUIMessages(
	dbMessages: { id: string; role: string; content: string }[] | undefined,
) {
	if (!dbMessages) return [];
	return dbMessages.map((message) => ({
		id: message.id,
		role: message.role.toLowerCase() as "user" | "assistant",
		parts: [{ type: "text" as const, text: message.content }],
	}));
}

export function ChatThread({
	workspaceId,
	getToken,
	conversations,
}: {
	workspaceId: string;
	getToken: () => Promise<string | null>;
	conversations: ConversationMeta[];
}) {
	const [selectedId, setSelectedId] = useState<string | null>(
		conversations[0]?.id ?? null,
	);
	const [webSearch, setWebSearch] = useState(false);
	const [composer, setComposer] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const selectedConversation = useMemo(
		() => conversations.find((item) => item.id === selectedId) ?? null,
		[conversations, selectedId],
	);

	const historyQuery = useConversationMessages(workspaceId, selectedId);
	const historyMessages = useMemo(
		() => toUIMessages(historyQuery.data as never),
		[historyQuery.data],
	);

	const deleteConversation = useDeleteConversation(workspaceId);
	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const transport = useMemo(() => {
		return new DefaultChatTransport({
			api: `${getApiBase()}/workspace/${workspaceId}/chat`,
			headers: async (): Promise<Record<string, string>> => {
				const token = await getToken();
				return token ? { Authorization: `Bearer ${token}` } : {};
			},
			body: () => ({
				conversationId: selectedId ?? undefined,
				webSearch,
			}),
			credentials: "include",
			fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
				const response = await fetch(input, init);
				const conversationId = response.headers.get("x-conversation-id");
				if (conversationId && conversationId !== selectedId) {
					setTimeout(() => setSelectedId(conversationId), 0);
				}
				return response;
			},
		});
	}, [workspaceId, selectedId, webSearch, getToken]);

	const {
		messages,
		sendMessage,
		status,
		stop,
		setMessages,
		error,
	} = useChat({
		id: selectedId ?? "new-chat",
		transport,
		onFinish: async () => {
			await queryClient.invalidateQueries({
				queryKey: trpc.chat.list.queryKey({ workspaceId }),
			});
		},
	} as never);

	useEffect(() => {
		if (historyMessages.length > 0) {
			setMessages(historyMessages as never);
		} else if (!selectedId) {
			setMessages([]);
		}
	}, [historyMessages, selectedId, setMessages]);

	useEffect(() => {
		if (!selectedId && conversations[0]) {
			setSelectedId(conversations[0].id);
		}
	}, [conversations, selectedId]);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [messages]);

	const isStreaming = status === "streaming" || status === "submitted";
	const hasHistoryPending = historyQuery.isPending && Boolean(selectedId);

	function handleSend() {
		const text = composer.trim();
		if (!text || isStreaming) return;
		sendMessage({ text } as never);
		setComposer("");
		requestAnimationFrame(() => textareaRef.current?.focus());
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex shrink-0 items-center justify-between gap-2 border-b border-border pb-3">
				<div className="flex min-w-0 items-center gap-2">
					<span className="truncate text-sm font-semibold">
						{selectedConversation?.title ?? "New chat"}
					</span>
					{conversations.length > 1 && (
						<div className="relative">
							<select
								className="h-7 max-w-40 truncate rounded-lg border border-input bg-background px-2 pr-6 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
								value={selectedId ?? ""}
								onChange={(event) => setSelectedId(event.target.value || null)}
							>
								<option value="">New chat</option>
								{conversations.map((item) => (
									<option key={item.id} value={item.id}>
										{item.title ?? "Untitled"} · {formatTime(item.updatedAt)}
									</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
						</div>
					)}
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<Button
						aria-label="New chat"
						onClick={() => {
							setSelectedId(null);
							setMessages([]);
						}}
						size="icon-sm"
						variant="ghost"
					>
						<Plus />
					</Button>
					{selectedId && (
						<Button
							aria-label="Delete conversation"
							onClick={() => {
								if (!selectedId) return;
								if (!window.confirm("Delete this conversation?")) return;
								deleteConversation.mutate(
									{ workspaceId, conversationId: selectedId },
									{
										onSuccess: () => {
											setSelectedId(null);
											setMessages([]);
										},
									},
								);
							}}
							size="icon-sm"
							variant="ghost"
						>
							<Trash2 />
						</Button>
					)}
					<label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium has-[input:checked]:border-sky-500/30 has-[input:checked]:bg-sky-500/10 has-[input:checked]:text-sky-600 dark:has-[input:checked]:text-sky-300">
						<input
							checked={webSearch}
							className="sr-only"
							onChange={(event) => setWebSearch(event.target.checked)}
							type="checkbox"
						/>
						<Globe className="size-3.5" />
						Web
					</label>
				</div>
			</div>

			<div
				ref={listRef}
				className="min-h-0 flex-1 overflow-y-auto pr-1 pt-3"
			>
				{hasHistoryPending ? (
					<div className="flex h-full items-center justify-center">
						<Spinner />
					</div>
				) : messages.length === 0 ? (
					<div className="grid h-full place-items-center p-6 text-center">
						<div className="max-w-sm">
							<p className="text-sm font-medium">Ask your notebook anything</p>
							<p className="mt-1 text-xs leading-5 text-muted-foreground">
								Answers are grounded in your sources. Add citations and web results when available.
							</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-4 pb-2">
						{(messages as unknown as {
							id: string;
							role: string;
							parts?: { type: string; text?: string }[];
							content?: string;
						}[]).map((typed) => {
							const isUser = typed.role === "user";
							const text =
								typed.parts
									?.filter((part) => part.type === "text")
									.map((part) => part.text ?? "")
									.join("") ??
								typed.content ??
								"";
							return (
								<div
									className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
									key={typed.id}
								>
									<div
										className={`max-w-[85%] rounded-2xl border px-3 py-2.5 text-sm leading-6 ${
											isUser
												? "border-foreground bg-foreground text-background"
												: "border-border bg-muted/40"
										}`}
									>
										{isUser ? (
											<p className="whitespace-pre-wrap break-words">{text}</p>
										) : (
											<div className="prose prose-sm dark:prose-invert max-w-none break-words">
												<Streamdown>{text}</Streamdown>
											</div>
										)}
									</div>
								</div>
							);
						})}
						{isStreaming && (
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Spinner className="size-3" />
								Thinking...
							</div>
						)}
					</div>
				)}
				{error && (
					<div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
						{error.message}
					</div>
				)}
			</div>

			<div className="shrink-0 border-t border-border bg-card pt-3">
				<div className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
					<textarea
						ref={textareaRef}
						className="max-h-28 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
						placeholder="Ask a question or create something"
						rows={1}
						value={composer}
						onChange={(event) => {
							setComposer(event.target.value);
							event.target.style.height = "auto";
							event.target.style.height = `${Math.min(event.target.scrollHeight, 112)}px`;
						}}
						onKeyDown={handleKeyDown}
					/>
					{isStreaming ? (
						<Button
							aria-label="Stop generating"
							onClick={() => stop()}
							size="icon"
							variant="secondary"
						>
							<Square className="size-4" />
						</Button>
					) : (
						<Button
							aria-label="Send message"
							disabled={!composer.trim()}
							onClick={handleSend}
							size="icon"
						>
							<Send className="size-4" />
						</Button>
					)}
				</div>
				<p className="mt-2 text-center text-[11px] text-muted-foreground">
					Grounded in your sources. Web search {webSearch ? "on" : "off"}.
				</p>
			</div>
		</div>
	);
}