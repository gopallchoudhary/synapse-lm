import { z } from "zod";

export const CHAT_MODELS = ["gpt-4o-mini", "gpt-4o"] as const;
export const CHAT_MODEL = "gpt-4o-mini";

export const workspaceIdParamSchema = z.object({
	workspaceId: z.string().trim().min(1),
});

export const chatBodySchema = z.object({
	conversationId: z.string().trim().min(1).optional(),
	messages: z.array(z.record(z.string(), z.unknown())).min(1),
	model: z.enum(CHAT_MODELS).optional(),
	webSearch: z.boolean().optional(),
});
