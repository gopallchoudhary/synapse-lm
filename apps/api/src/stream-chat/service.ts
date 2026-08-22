import type { Request, Response } from "express";
import { z } from "zod";
import {
	type UIMessage,
	convertToModelMessages,
	createUIMessageStream,
	isStepCount,
	pipeUIMessageStreamToResponse,
	streamText,
	toUIMessageStream,
	tool,
} from "ai";
import {
	CHAT_MODEL,
	CHAT_MODELS,
	CONVERSATION_SUMMARY_INTERVAL,
	RECENT_MESSAGE_WINDOW,
} from "./types.js";
import {
	buildConversationTitle,
	getChatModel,
	getLastUserMessageText,
	getTextFromUIMessage,
} from "@repo/ai";
import { buildChatSystemPrompt, retrieveWorkspaceContext } from "@repo/rag";
import { addMemoriesFromMessages, searchUserMemories } from "@repo/memory";
import {
	formatTavilyResultsForPrompt,
	searchWeb,
	TavilySearchResponse,
} from "@repo/web-search";

import {
	WorkspaceService,
	ConversationService,
	MessageService,
} from "@repo/services";
import { NotFoundError, ValidationError } from "@repo/errors";

const workspaceService = new WorkspaceService();
const conversationService = new ConversationService();
const messageService = new MessageService();

export async function streamWorkspaceChat(
	res: Response,
	workspaceId: string,
	userId: string,
	input: {
		conversationId?: string;
		messages: UIMessage[];
		model?: string;
		webSearch?: boolean;
	},
) {
	const workspace = await workspaceService.getWorkspaceByIdAndUserId(
		workspaceId,
		userId,
	);

	const requestedModel = input.model ?? workspace.defaultModel;

	const chatModel =
		CHAT_MODELS.find((model) => model === requestedModel) ?? CHAT_MODEL;

	const webSearchEnabled =
		input.webSearch === true && !!process.env.TAVILY_API_KEY?.trim();

	const userText = getLastUserMessageText(input.messages);
	if (!userText) {
		throw new ValidationError("A user message is required");
	}

	const conversation = await resolveConversation(
		workspaceId,
		input.conversationId,
		userText,
	);

	await messageService.createMessageRecord({
		conversationId: conversation.id,
		role: "USER",
		content: userText,
	});

	const [retrievedChunks, userMemories] = await Promise.all([
		retrieveWorkspaceContext(workspaceId, userText),
		searchUserMemories(userId, userText),
	]);

	const citations = retrievedChunks.map((chunk) => ({
		sourceId: chunk.sourceId,
		sourceTitle: chunk.sourceTitle,
		sourceType: chunk.sourceType,
		chunkId: chunk.chunkId,
		chunkIndex: chunk.chunkIndex,
		page: chunk.page,
		excerpt: chunk.text.slice(0, 280),
		score: chunk.score,
	}));

	const systemPrompt = buildChatSystemPrompt({
		chunks: retrievedChunks,
		conversationSummary: conversation.summary,
		userMemories: userMemories.map((memory) => memory.memory),
		webSearchEnabled,
	});

	const contextMessages =
		conversation.summary && input.messages.length > RECENT_MESSAGE_WINDOW
			? input.messages.slice(-RECENT_MESSAGE_WINDOW)
			: input.messages;

	let webSearchResults: TavilySearchResponse | null = null;

	const stream = createUIMessageStream({
		originalMessages: input.messages,
		execute: async ({ writer }) => {
			const tools = webSearchEnabled
				? {
						web_search: tool({
							description:
								"Search the web for up-to-date information outside the workspace sources.",
							inputSchema: z.object({
								query: z
									.string()
									.describe("The search query for current web information"),
							}),
							execute: async ({ query }) => {
								const results = await searchWeb(query);
								webSearchResults = results;
								return formatTavilyResultsForPrompt(results);
							},
						}),
					}
				: undefined;

			const result = streamText({
				model: getChatModel(chatModel),
				system: systemPrompt,
				messages: await convertToModelMessages(contextMessages),
				tools,
				stopWhen: webSearchEnabled ? isStepCount(3) : undefined,
			});

			writer.merge(toUIMessageStream({ stream: result.stream }));
		},
		onFinish: async ({ responseMessage, isAborted }) => {
			if (isAborted) {
				return;
			}

			const assistantText = getTextFromUIMessage(responseMessage).trim();
			if (!assistantText) {
				return;
			}

			const webCitations = webSearchResults
				? webSearchResults.results.map((result) => ({
						sourceType: "WEB" as const,
						sourceTitle: result.title,
						url: result.url,
						excerpt: result.content.slice(0, 280),
					}))
				: [];
			const allCitations = [...citations, ...webCitations];

			await messageService.createMessageRecord({
				conversationId: conversation.id,
				role: "ASSISTANT",
				content: assistantText,
				citations: allCitations,
			});

			await conversationService.touchConversation(conversation.id);

			if (!conversation.title) {
				await conversationService.updateConversationRecord(conversation.id, {
					title: buildConversationTitle(userText),
				});
			}

			const messageCount = await messageService.countMessagesByConversationId(
				conversation.id,
			);

			if (messageCount % CONVERSATION_SUMMARY_INTERVAL === 0) {
				await conversationService.enqueueConversationSummarize({
					conversationId: conversation.id,
					userId,
				});
			}

			void addMemoriesFromMessages(
				userId,
				[
					{ role: "user", content: userText },
					{ role: "assistant", content: assistantText },
				],
				{
					source: "learned",
					conversationId: conversation.id,
				},
			).catch((error) => {
				console.error("Mem0 add failed:", error);
			});
		},
	});

	await pipeUIMessageStreamToResponse({
		response: res,
		stream,
		headers: {
			"X-Conversation-Id": conversation.id,
		},
	});
}

//. Resolve conversation
async function resolveConversation(
	workspaceId: string,
	conversationId: string | undefined,
	firstMessage: string,
) {
	if (conversationId) {
		const existing =
			await conversationService.getConversationByIdAndWorkspaceId(
				conversationId,
				workspaceId,
			);

		if (!existing) {
			throw new NotFoundError("Conversation not found");
		}

		return existing;
	}

	return conversationService.createConversationRecord(
		workspaceId,
		buildConversationTitle(firstMessage),
	);
}
