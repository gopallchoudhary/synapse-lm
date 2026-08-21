import { prisma } from "@repo/database";
import { conversationSelect, ConversationRecord } from "./model.js";

class ConversationService {
	public async getConversationsByWorkspaceId(workspaceId: string) {
		return await prisma.conversation.findMany({
			where: {
				workspaceId,
			},
			select: conversationSelect,
			orderBy: {
				updatedAt: "desc",
			},
		});
	}

	public async getConversationById(conversationId: string) {
		return await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			select: conversationSelect,
		});
	}

	public async getConversationByIdAndWorkspaceId(
		conversationId: string,
		workspaceId: string,
	) {
		return await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				workspaceId,
			},
			select: conversationSelect,
		});
	}

	public async createConversationRecord(workspaceId: string, title?: string) {
		return await prisma.conversation.create({
			data: {
				workspaceId,
				title: title ?? null,
			},
			select: conversationSelect,
		});
	}

	public async updateConversationSummary(
		conversationId: string,
		data: {
			summary: string;
			summaryMessageCount: number;
		},
	) {
		return prisma.conversation.update({
			where: { id: conversationId },
			data: {
				summary: data.summary,
				summaryMessageCount: data.summaryMessageCount,
				summarizedAt: new Date(),
			},
			select: conversationSelect,
		});
	}

	public async updateConversationRecord(
		conversationId: string,
		data: { title: string | null },
	) {
		return prisma.conversation.update({
			where: { id: conversationId },
			data,
			select: conversationSelect,
		});
	}

	public async touchConversation(conversationId: string) {
		return prisma.conversation.update({
			where: { id: conversationId },
			data: { updatedAt: new Date() },
			select: conversationSelect,
		});
	}

	public async deleteConversation(conversationId: string) {
		await prisma.conversation.delete({
			where: {
				id: conversationId,
			},
		});
	}
}

export default ConversationService;
