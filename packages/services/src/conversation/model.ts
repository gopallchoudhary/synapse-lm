import { Prisma } from "@repo/database/generated/prisma/client.js";



export const conversationSelect = {
	id: true,
	workspaceId: true,
	title: true,
	summary: true,
	summaryMessageCount: true,
	summarizedAt: true,
	createdAt: true,
	updatedAt: true,
} as const;

export type ConversationRecord = Prisma.ConversationGetPayload<{
	select: typeof conversationSelect;
}>;
