import type { Request, Response } from "express";
import { workspaceIdParamSchema, chatBodySchema } from "./types.js";
import { streamWorkspaceChat } from "./service.js";

interface ExtendedRequest extends Request {
	userId: string;
}

export async function streamChat(req: ExtendedRequest, res: Response) {
	const { workspaceId } = workspaceIdParamSchema.parse(req.params);
	const { messages, model, webSearch, conversationId } = chatBodySchema.parse(
		req.body,
	);
}

