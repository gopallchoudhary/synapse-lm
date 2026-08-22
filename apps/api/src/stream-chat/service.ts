import type { Request, Response } from "express";
import { type UIMessage } from "ai";
import { CHAT_MODEL, CHAT_MODELS } from "./types.js";
import { buildConversationTitle, getLastUserMessageText } from "@repo/ai";
import { retrieveWorkspaceContext } from "@repo/rag";
import { searchUserMemories } from "@repo/memory";

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
}

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
