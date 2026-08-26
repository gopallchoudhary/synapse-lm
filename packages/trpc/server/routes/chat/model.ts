import { z } from "zod";

export const workspaceIdChatParamModel = z.object({
	workspaceId: z.string().trim().min(1),
});

export const conversationIdParamModel = z.object({
	workspaceId: z.string().trim().min(1),
	conversationId: z.string().trim().min(1),
});

export const createConversationInputModel = z.object({
	workspaceId: z.string().trim().min(1),
	title: z.string().trim().min(1).max(120).optional(),
});

export const conversationOutputModel = z.object({
	id: z.string(),
	workspaceId: z.string(),
	title: z.string().nullable(),
	summary: z.string().nullable(),
	summaryMessageCount: z.number(),
	summarizedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const conversationListOutputModel = z.array(conversationOutputModel);

export const messageOutputModel = z.object({
	id: z.string(),
	conversationId: z.string(),
	role: z.enum(["USER", "ASSISTANT"]),
	content: z.string(),
	citations: z.unknown().nullable(),
	createdAt: z.date(),
});

export const messageListOutputModel = z.array(messageOutputModel);

export const deleteConversationOutputModel = z.object({
	deleted: z.boolean(),
});