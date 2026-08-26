import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
	ArrowUp,
	Bookmark,
	BookmarkCheck,
	Check,
	ChevronDown,
	Copy,
	FileText,
	Globe,
	Plus,
	Sparkles,
	Square,
	ThumbsDown,
	ThumbsUp,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "~/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Spinner } from "~/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { env } from "~/env";
import { useCreateTextSource } from "~/features/sources/hooks/use-sources";
import { cn } from "~/lib/utils";
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

const starterPrompts = [
	{
		label: "Summarize key findings",
		text: "Summarize the key findings and most important takeaways from all available sources.",
		icon: "⚡",
	},
	{
		label: "Explain core concepts",
		text: "Identify and explain the core concepts and definitions discussed in these sources.",
		icon: "🎯",
	},
	{
		label: "Generate review quiz",
		text: "Create a 5-question multiple choice quiz with answer explanations based on these sources.",
		icon: "📝",
	},
	{
		label: "Synthesize viewpoints",
		text: "Compare and contrast the different perspectives, arguments, or methods presented in the materials.",
		icon: "💡",
	},
];

function parseMessageContent(raw: string) {
	const thinkMatch = raw.match(/<think>([\s\S]*?)<\/think>/i);
	if (thinkMatch) {
		const thoughts = thinkMatch[1]?.trim() ?? "";
		const cleanContent = raw.replace(/<think>[\s\S]*?<\/think>/i, "").trim();
		return { thoughts, content: cleanContent };
	}
	return { thoughts: null, content: raw };
}

function formatTime(value: string | Date) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(String(value)));
}

function getApiBase() {
	return (env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
		.replace(/\/trpc\/?$/, "")
		.replace(/\/$/, "");
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
	readySourcesCount,
}: {
	workspaceId: string;
	getToken: () => Promise<string | null>;
	conversations: ConversationMeta[];
	readySourcesCount?: number;
}) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const didInitRef = useRef(false);
	const [webSearch, setWebSearch] = useState(false);
	const [composer, setComposer] = useState("");
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
	const [feedbackState, setFeedbackState] = useState<Record<string, "up" | "down">>({});
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const createTextSource = useCreateTextSource(workspaceId);

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
		if (selectedId && historyMessages.length > 0) {
			setMessages(historyMessages as never);
		} else if (!selectedId) {
			setMessages([]);
		}
	}, [historyMessages, selectedId, setMessages]);

	useEffect(() => {
		if (didInitRef.current) return;
		if (!selectedId && conversations[0]) {
			setSelectedId(conversations[0].id);
			didInitRef.current = true;
		}
	}, [conversations, selectedId]);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [messages]);

	const isStreaming = status === "streaming" || status === "submitted";
	const hasHistoryPending = historyQuery.isPending && Boolean(selectedId);

	function handleCopy(text: string, id: string) {
		void navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	}

	function handleSaveNote(text: string, id: string) {
		const snippet = text.slice(0, 45).replace(/[\n\r]+/g, " ");
		createTextSource.mutate(
			{
				workspaceId,
				type: "TEXT",
				title: `Note: ${snippet}...`,
				content: text,
			},
			{
				onSuccess: () => {
					setSavedNoteId(id);
					setTimeout(() => setSavedNoteId(null), 2500);
				},
			},
		);
	}

	function toggleFeedback(id: string, dir: "up" | "down") {
		setFeedbackState((prev) => ({
			...prev,
			[id]: prev[id] === dir ? (undefined as never) : dir,
		}));
	}

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
					<Tooltip>
						<TooltipTrigger
							render={
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
							}
						/>
						<TooltipContent side="bottom">New chat</TooltipContent>
					</Tooltip>

					{selectedId && (
						<Tooltip>
							<TooltipTrigger
								render={
									<Button
										aria-label="Delete conversation"
										onClick={() => {
											if (!selectedId) return;
											setDeleteConfirmOpen(true);
										}}
										size="icon-sm"
										variant="ghost"
									>
										<Trash2 />
									</Button>
								}
							/>
							<TooltipContent side="bottom">Delete conversation</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>

			<div
				ref={listRef}
				className="min-h-0 flex-1 overflow-y-auto px-3 pt-4 sm:px-6"
			>
				<div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
					{hasHistoryPending ? (
						<div className="flex flex-1 items-center justify-center py-12">
							<Spinner />
						</div>
					) : messages.length === 0 ? (
						<div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
							<div className="max-w-md space-y-4">
								<div className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-foreground ring-1 ring-border/80">
									<Sparkles className="size-6 text-foreground" />
								</div>
								<div>
									<h2 className="text-base font-semibold">Ask your notebook anything</h2>
									<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
										Answers are grounded directly in your sources. Explore summaries, deep dives, or test your knowledge.
									</p>
								</div>
								<div className="grid grid-cols-1 gap-2 pt-2 text-left sm:grid-cols-2">
									{starterPrompts.map((prompt) => (
										<button
											key={prompt.text}
											type="button"
											onClick={() => {
												setComposer(prompt.text);
												requestAnimationFrame(() => textareaRef.current?.focus());
											}}
											className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs transition-all hover:border-foreground/40 hover:bg-muted/50 hover:shadow-xs"
										>
											<span className="text-base leading-none">{prompt.icon}</span>
											<span className="font-medium text-foreground/90">{prompt.label}</span>
										</button>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-6 pb-4">
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

								if (isUser) {
									return (
										<div
											className="flex w-full justify-end"
											key={typed.id}
										>
											<div className="max-w-[85%] rounded-2xl rounded-tr-xs border border-border/40 bg-muted/80 px-4 py-3 text-sm leading-relaxed text-foreground shadow-2xs sm:max-w-[75%] dark:bg-muted/60">
												<p className="whitespace-pre-wrap break-words">{text}</p>
											</div>
										</div>
									);
								}

								const { thoughts, content } = parseMessageContent(text);
								const isCopied = copiedId === typed.id;
								const isSaved = savedNoteId === typed.id;
								const feedback = feedbackState[typed.id];

								return (
									<div className="flex w-full flex-col items-start gap-2 pt-1" key={typed.id}>
										{thoughts && (
											<Collapsible className="w-full max-w-full">
												<CollapsibleTrigger className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
													<span className="size-1.5 rounded-full bg-foreground/60" />
													<span>Thoughts</span>
													<ChevronDown className="size-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
												</CollapsibleTrigger>
												<CollapsibleContent className="mt-2 overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
													{thoughts}
												</CollapsibleContent>
											</Collapsible>
										)}

										<div className="w-full max-w-full py-1 text-sm leading-relaxed text-foreground">
											<div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
												<Streamdown>{content || text}</Streamdown>
											</div>
										</div>

										{/* Message Actions Bar matching Screenshot (964).png */}
										<div className="flex items-center gap-2 pt-1 text-muted-foreground">
											<button
												type="button"
												onClick={() => handleSaveNote(content || text, typed.id)}
												className={cn(
													"flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground",
													isSaved && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
												)}
												aria-label="Save to note"
											>
												{isSaved ? (
													<>
														<BookmarkCheck className="size-3.5 text-emerald-500" />
														<span>Saved to note</span>
													</>
												) : (
													<>
														<Bookmark className="size-3.5" />
														<span>Save to note</span>
													</>
												)}
											</button>

											<Tooltip>
												<TooltipTrigger
													render={
														<button
															type="button"
															onClick={() => handleCopy(content || text, typed.id)}
															className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground"
															aria-label="Copy response"
														>
															{isCopied ? (
																<Check className="size-3.5 text-emerald-500" />
															) : (
																<Copy className="size-3.5" />
															)}
														</button>
													}
												/>
												<TooltipContent side="top">
													{isCopied ? "Copied!" : "Copy"}
												</TooltipContent>
											</Tooltip>

											<button
												type="button"
												onClick={() => toggleFeedback(typed.id, "up")}
												className={cn(
													"flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground",
													feedback === "up" && "bg-emerald-500/10 text-emerald-500",
												)}
												aria-label="Good response"
											>
												<ThumbsUp className="size-3.5" />
											</button>

											<button
												type="button"
												onClick={() => toggleFeedback(typed.id, "down")}
												className={cn(
													"flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground",
													feedback === "down" && "bg-destructive/10 text-destructive",
												)}
												aria-label="Poor response"
											>
												<ThumbsDown className="size-3.5" />
											</button>
										</div>
									</div>
								);
							})}

							{isStreaming && (
								<div className="flex items-center gap-2 pl-1 text-xs text-muted-foreground">
									<Spinner className="size-3.5" />
									Thinking and generating response...
								</div>
							)}

							<div className="my-1 text-center text-[11px] font-normal text-muted-foreground/70">
								Today · {formatTime(new Date())}
							</div>
						</div>
					)}
					{error && (
						<div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
							{error.message}
						</div>
					)}
				</div>
			</div>

			<div className="shrink-0 pt-2 px-3 sm:px-6 pb-2">
				<div className="mx-auto w-full max-w-3xl">
					<div className="flex flex-col rounded-2xl border border-input/80 bg-background p-2 transition-all focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 focus-within:shadow-sm sm:p-2.5">
						<textarea
							ref={textareaRef}
							className="max-h-32 min-h-[34px] w-full resize-none bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground/70"
							placeholder="Ask a question or create something..."
							rows={1}
							value={composer}
							onChange={(event) => {
								setComposer(event.target.value);
								event.target.style.height = "auto";
								event.target.style.height = `${Math.min(event.target.scrollHeight, 128)}px`;
							}}
							onKeyDown={handleKeyDown}
						/>

						<div className="flex items-center justify-between pt-1.5">
							<div className="flex items-center gap-1.5">
								{readySourcesCount !== undefined && readySourcesCount > 0 && (
									<span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
										<FileText className="size-3 text-muted-foreground/80" />
										{readySourcesCount} {readySourcesCount === 1 ? "source" : "sources"}
									</span>
								)}
								<label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-0.5 text-[11px] font-medium transition-colors hover:bg-muted/50 has-[input:checked]:border-sky-500/40 has-[input:checked]:bg-sky-500/10 has-[input:checked]:text-sky-600 dark:has-[input:checked]:text-sky-300">
									<input
										checked={webSearch}
										className="sr-only"
										onChange={(event) => setWebSearch(event.target.checked)}
										type="checkbox"
									/>
									<Globe className="size-3" />
									Web
								</label>
							</div>

							<div>
								{isStreaming ? (
									<Tooltip>
										<TooltipTrigger
											render={
												<button
													type="button"
													aria-label="Stop generating"
													onClick={() => stop()}
													className="flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-xs transition-all hover:opacity-90 hover:scale-105 active:scale-95 sm:size-8.5"
												>
													<Square className="size-3 fill-current" />
												</button>
											}
										/>
										<TooltipContent side="top">Stop generating</TooltipContent>
									</Tooltip>
								) : (
									<Tooltip>
										<TooltipTrigger
											render={
												<button
													type="button"
													aria-label="Send message"
													disabled={!composer.trim()}
													onClick={handleSend}
													className="flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-xs transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed sm:size-8.5"
												>
													<ArrowUp className="size-3.5 stroke-[2.5]" />
												</button>
											}
										/>
										<TooltipContent side="top">Send message</TooltipContent>
									</Tooltip>
								)}
							</div>
						</div>
					</div>

					<p className="mt-1.5 text-center text-[11px] text-muted-foreground/80">
						Grounded in your sources. Web search {webSearch ? "on" : "off"}.
					</p>
				</div>
			</div>

			<AlertDialog
				open={deleteConfirmOpen}
				onOpenChange={setDeleteConfirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogMedia className="bg-destructive/10 text-destructive">
							<Trash2 className="size-5" />
						</AlertDialogMedia>
						<AlertDialogTitle>Delete conversation</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete{" "}
							<span className="font-semibold text-foreground">
								&ldquo;{selectedConversation?.title ?? "this conversation"}&rdquo;
							</span>
							? All chat messages in this session will be permanently removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (!selectedId) return;
								const targetId = selectedId;
								setSelectedId(null);
								setMessages([]);
								setDeleteConfirmOpen(false);
								deleteConversation.mutate({
									workspaceId,
									conversationId: targetId,
								});
							}}
							variant="destructive"
						>
							Delete conversation
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}