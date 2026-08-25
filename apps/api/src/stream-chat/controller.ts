import type { Request, Response } from "express";
import { workspaceIdParamSchema, chatBodySchema } from "./types.js";
import { streamWorkspaceChat } from "./service.js";
import type { UIMessage } from "ai";

export async function streamChat(req: Request, res: Response) {
	const { workspaceId } = workspaceIdParamSchema.parse(req.params);
	const { messages, model, webSearch, conversationId } = chatBodySchema.parse(
		req.body,
	);

	if (!req.userId) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	await streamWorkspaceChat(res, workspaceId, req.userId, {
		conversationId,
		messages: messages as unknown as UIMessage[],
		model,
		webSearch,
	});
}
