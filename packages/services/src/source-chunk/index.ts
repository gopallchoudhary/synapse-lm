import { prisma } from "@repo/database";
import { CreateSourceChunkData, sourceChunkSelect } from "./model.js";

class SourceChunkService {
	public async deleteChunksBySourceId(sourceId: string) {
		return prisma.sourceChunk.deleteMany({
			where: { sourceId },
		});
	}

	public async createSourceChunks(chunks: CreateSourceChunkData[]) {
		if (chunks.length === 0) {
			return [];
		}

		const sourceId = chunks[0]!.sourceId;
		await prisma.sourceChunk.createMany({
			data: chunks.map((chunk) => ({
				sourceId: chunk.sourceId,
				index: chunk.index,
				content: chunk.content,
				tokenCount: chunk.tokenCount ?? null,
				metadata: chunk.metadata,
			})),
		});

		return prisma.sourceChunk.findMany({
			where: { sourceId },
			select: sourceChunkSelect,
			orderBy: { index: "asc" },
		});
	}

	public getChunksBySourceId(sourceId: string) {
		return prisma.sourceChunk.findMany({
			where: { sourceId },
			select: sourceChunkSelect,
			orderBy: { index: "asc" },  
		});
	}
}

export default SourceChunkService
