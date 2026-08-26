import { chatService } from "../../services/index.js";
import { protectedProcedure, router } from "../../trpc.js";
import { generatePath } from "../../utils/path-generator.js";
import {
	conversationIdParamModel,
	conversationListOutputModel,
	createConversationInputModel,
	conversationOutputModel,
	deleteConversationOutputModel,
	messageListOutputModel,
	workspaceIdChatParamModel,
} from "./model.js";

const TAGS = ["Chat"];
const getPath = generatePath("/chat");

export const chatRouter = router({
	list: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: getPath("/list"),
				tags: TAGS,
			},
		})
		.input(workspaceIdChatParamModel)
		.output(conversationListOutputModel)
		.query(({ input, ctx }) =>
			chatService.listConversationsByWorkspaceId(ctx.userId, input),
		),

	create: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/create"),
				tags: TAGS,
			},
		})
		.input(createConversationInputModel)
		.output(conversationOutputModel)
		.mutation(({ input, ctx }) =>
			chatService.createConversationByWorkspaceId(ctx.userId, input),
		),

	messages: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: getPath("/messages"),
				tags: TAGS,
			},
		})
		.input(conversationIdParamModel)
		.output(messageListOutputModel)
		.query(({ input, ctx }) =>
			chatService.listConversationMessagesByConversationIdAndWorkspaceId(
				ctx.userId,
				input,
			),
		),

	delete: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: getPath("/delete"),
				tags: TAGS,
			},
		})
		.input(conversationIdParamModel)
		.output(deleteConversationOutputModel)
		.mutation(async ({ input, ctx }) => {
			await chatService.deleteConversationByIdAndWorkspaceId(ctx.userId, input);
			return { deleted: true };
		}),
});