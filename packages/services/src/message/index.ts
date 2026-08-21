import { prisma } from "@repo/database";
import { CreateMessageData, MessageRecord, messageSelect } from "./model.js";

class MessageService {
	public findMessagesByConversationId(conversationId: string) {
		return prisma.message.findMany({
			where: { conversationId },
			select: messageSelect,
			orderBy: { createdAt: "asc" },
		});
	}

	public countMessagesByConversationId(conversationId: string) {
		return prisma.message.count({
			where: { conversationId },
		});
	}

	public createMessageRecord(data: CreateMessageData) {
		return prisma.message.create({
			data: {
				conversationId: data.conversationId,
				role: data.role,
				content: data.content,
				citations: data.citations,
			},
			select: messageSelect,
		});
	}
}

export default MessageService;
