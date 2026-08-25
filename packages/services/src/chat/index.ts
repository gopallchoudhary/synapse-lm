import { NotFoundError } from "@repo/errors";
import ConversationService from "../conversation/index.js";
import WorkspaceService from "../workspace/index.js";
import MessageService from "../message/index.js";
import {
	createConversationByWorkspaceIdInput,
	CreateConversationByWorkspaceIdInputType,
	deleteConversationByIdAndWorkspaceIdInput,
	DeleteConversationByIdAndWorkspaceIdInputType,
	listConversationMessagesByConversationIdAndWorkspaceId,
	ListConversationMessagesByConversationIdAndWorkspaceIdType,
	listConversationsByWorkspaceIdInput,
	ListConversationsByWorkspaceIdInputType,
	streamChatInputSchema,
	StreamChatInputType,
} from "./model.js";

const conversationService = new ConversationService();
const workspaceService = new WorkspaceService();
const messageService = new MessageService();

class ChatService {
	//, get conversation messages by conversation id and workspace id
	private async getConversationMessagesByConversationIdAndWorkspaceId(
		conversationId: string,
		workspaceId: string,
		userId: string,
	) {
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const conversation =
			await conversationService.getConversationByIdAndWorkspaceId(
				conversationId,
				workspaceId,
			);
		if (!conversation) {
			throw new NotFoundError("Conversation not found");
		}

		return messageService.findMessagesByConversationId(conversationId);
	}

	public async listConversationsByWorkspaceId(
		userId: string,
		payload: ListConversationsByWorkspaceIdInputType,
	) {
		const { workspaceId } = listConversationsByWorkspaceIdInput.parse(payload);
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);
		return conversationService.getConversationsByWorkspaceId(workspaceId);
	}

	public async createConversationByWorkspaceId(
		userId: string,
		payload: CreateConversationByWorkspaceIdInputType,
	) {
		const { workspaceId, title } =
			createConversationByWorkspaceIdInput.parse(payload);
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);
		return conversationService.createConversationRecord(workspaceId, title);
	}

	public async listConversationMessagesByConversationIdAndWorkspaceId(
		userId: string,
		payload: ListConversationMessagesByConversationIdAndWorkspaceIdType,
	) {
		const { workspaceId, conversationId } =
			listConversationMessagesByConversationIdAndWorkspaceId.parse(payload);

		const messages =
			await this.getConversationMessagesByConversationIdAndWorkspaceId(
				conversationId,
				workspaceId,
				userId,
			);

		return messages;
	}

	public async deleteConversationByIdAndWorkspaceId(
		userId: string,
		payload: DeleteConversationByIdAndWorkspaceIdInputType,
	) {
		const { workspaceId, conversationId } =
			deleteConversationByIdAndWorkspaceIdInput.parse(payload);

		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const conversation =
			await conversationService.getConversationByIdAndWorkspaceId(
				conversationId,
				workspaceId,
			);
		if (!conversation) {
			throw new NotFoundError("Conversation not found");
		}

		await conversationService.deleteConversation(conversationId);
	}

}

export default ChatService;
