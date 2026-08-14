import { Prisma } from "@repo/database/generated/prisma/client.js";

export const sourceChunkSelect = {
	id: true,
	sourceId: true,
	index: true,
	content: true,
	tokenCount: true,
	metadata: true,
	createdAt: true,
} as const;

export type SourceChunkRecord = Prisma.SourceChunkGetPayload<{
	select: typeof sourceChunkSelect;
}>;

export type CreateSourceChunkData = {
	sourceId: string;
	index: number;
	content: string;
	tokenCount?: number | null;
	metadata?: Prisma.InputJsonValue;
};
