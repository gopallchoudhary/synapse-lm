import { z } from "zod";
import { CHAT_MODELS } from "@repo/ai";

export const workspaceIdParamSchema = z.object({
	workspaceId: z.string().trim().min(1),
});

export const conversationIdParamSchema = workspaceIdParamSchema.extend({
	conversationId: z.string().trim().min(1, "Conversation id is required"),
});

export const streamChatInputSchema = z.object({
	workspaceId: z.string().trim().min(1),
	conversationId: z.string().trim().min(1).optional(),
	messages: z.array(z.record(z.string(), z.unknown())).min(1),
	model: z.enum(CHAT_MODELS).optional(),
	webSearch: z.boolean().optional(),
});

export type StreamChatInputType = z.infer<typeof streamChatInputSchema>;

export const createConversationSchema = z.object({
	title: z.string().trim().min(1).max(120).optional(),
});

export const listConversationsByWorkspaceIdInput = z.object({
	workspaceId: z.string().trim().min(1),
});

export const createConversationByWorkspaceIdInput = z.object({
	workspaceId: z.string().trim().min(1),
	title: z.string().trim().min(1).max(120).optional(),
});

export const listConversationMessagesByConversationIdAndWorkspaceId = listConversationsByWorkspaceIdInput.extend({
	conversationId: z.string().trim().min(1),
});

export const deleteConversationByIdAndWorkspaceIdInput = listConversationMessagesByConversationIdAndWorkspaceId


export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type WorkspaceIdParamType = z.infer<typeof workspaceIdParamSchema>;
export type ListConversationsByWorkspaceIdInputType = z.infer<typeof listConversationsByWorkspaceIdInput>;
export type CreateConversationByWorkspaceIdInputType = z.infer<typeof createConversationByWorkspaceIdInput>;
export type ListConversationMessagesByConversationIdAndWorkspaceIdType = z.infer<typeof listConversationMessagesByConversationIdAndWorkspaceId>;
export type DeleteConversationByIdAndWorkspaceIdInputType = z.infer<typeof deleteConversationByIdAndWorkspaceIdInput>;
