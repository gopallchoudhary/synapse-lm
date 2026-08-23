import { prisma } from "@repo/database";
import { conversationSelect, ConversationRecord } from "./model.js";
import { inngest } from "@repo/jobs-client";
import MessageService from "../message/index.js";
import { generateTextContent } from "@repo/ai";
import { addMemoriesFromMessages } from "@repo/memory";

const messageService = new MessageService();

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

	public async enqueueConversationSummarize(input: {
		conversationId: string;
		userId: string;
	}) {
		await inngest.send({
			name: "conversation/summarize",
			data: input,
		});
	}


	public async summarizeConversationById(
		conversationId: string,
		userId: string,
	) {
		const conversation = await this.getConversationById(conversationId);
		if (!conversation) {
			throw new Error("Conversation not found");
		}

		const messages = await messageService.findMessagesByConversationId(
			conversationId,
		);

		if (messages.length === 0) {
			return conversation;
		}


		const transcript = messages
			.map((message) => `${message.role}: ${message.content}`)
			.join("\n\n");
		const previousSummary = conversation.summary?.trim();

		const system = [
			"You summarize chat conversations for a learning assistant.",
			"Produce a concise rolling summary covering topics discussed, questions asked,",
			"key insights, and unresolved threads.",
			"Write in third person about the user. Keep it under 250 words.",
		].join("\n")

		const prompt = [
			previousSummary
				? `Previous summary:\n${previousSummary}\n`
				: null,
			"Full conversation transcript:",
			transcript,
			"",
			"Write an updated summary that incorporates new messages.",
		]
			.filter(Boolean)
			.join("\n")

		const summary = await generateTextContent({
			system,
			prompt,
		});

		const updated = await this.updateConversationSummary(conversationId, {
			summary: summary.trim(),
			summaryMessageCount: messages.length,
		});


		const recentMessages = messages.slice(-16).map((message) => ({
			role: message.role.toLowerCase() as "user" | "assistant",
			content: message.content,
		}));

		await addMemoriesFromMessages(userId, recentMessages, {
			source: "learned",
			conversationId
		});

		return updated;

	}
}

export default ConversationService;
