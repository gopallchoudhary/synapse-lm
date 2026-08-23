import type { Prisma } from "@repo/database/generated/prisma/client.js";

export type SourceMetadata = {
	fileUrl?: string;
	fileName?: string;
	fileSize?: number;
	publicId?: string;
	resourceType?: "raw" | "image";
	importedFrom?: string;
	videoId?: string;
	processingError?: string;
	chunkCount?: number;
	pageCount?: number;
	indexedAt?: string;
};

export const sourceSelect = {
	id: true,
	workspaceId: true,
	type: true,
	title: true,
	content: true,
	url: true,
	status: true,
	metadata: true,
	createdAt: true,
	updatedAt: true,
} as const;

export type SourceRecord = Prisma.SourceGetPayload<{
	select: typeof sourceSelect;
}>;

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
