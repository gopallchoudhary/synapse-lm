import { Prisma } from "@repo/database/generated/prisma/client.js";
import { extractPdfFromCloudinary, chunkPages, chunkText } from "@repo/rag";
import type { VectorMetadata, PineconeRecord } from "@repo/vector-store";
import { deleteSourceVectors, upsertSourceVectors } from "@repo/vector-store";
import { embedTexts } from "@repo/ai";
import SourceService from "../source/index.js";
import SourceChunkService from "../source-chunk/index.js";
import { SourceChunkRecord, SourceMetadata, SourceRecord } from "./model.js";

const sourceService = new SourceService();
const sourceChunkService = new SourceChunkService();

class SourceProcessingService {
	public async extractSourceText(source: SourceRecord) {
		const text = source.content?.trim();
		if (text) {
			return {
				text,
				pageCount: undefined,
				pages: undefined,
			};
		}

		if (source.type === "PDF") {
			const metadata =
				source.metadata &&
				typeof source.metadata === "object" &&
				!Array.isArray(source.metadata)
					? (source.metadata as SourceMetadata)
					: {};
			if (!metadata.fileUrl) {
				throw new Error("PDF source is missing fileUrl metadata");
			}

			const extracted = await extractPdfFromCloudinary({
				fileUrl: metadata.fileUrl,
				publicId: metadata.publicId,
				resourceType: metadata.resourceType,
			});

			return {
				text: extracted.text,
				pageCount: extracted.pageCount,
				pages: extracted.pages,
			};
		}

		throw new Error(`Source ${source.id} has no extractable content`);
	}

	public async markSourceProcessing(sourceId: string) {
		return sourceService.updateSource(sourceId, { status: "PROCESSING" });
	}

	public async markSourceFailed(
		sourceId: string,
		error: unknown,
		existingMetadata: SourceRecord["metadata"],
	) {
		const message =
			error instanceof Error ? error.message : "Source processing failed";

		const metadata =
			existingMetadata &&
			typeof existingMetadata === "object" &&
			!Array.isArray(existingMetadata)
				? (existingMetadata as SourceMetadata)
				: {};

		return sourceService.updateSource(sourceId, {
			status: "FAILED",
			metadata: {
				...metadata,
				processingError: message,
			},
		});
	}

	public async extractSourceContent(sourceId: string) {
		const source = await sourceService.getSourceById(sourceId);
		if (!source) {
			throw new Error("Source not found");
		}

		const extracted = await this.extractSourceText(source);

		const metadata =
			source.metadata &&
			typeof source.metadata === "object" &&
			!Array.isArray(source.metadata)
				? (source.metadata as SourceMetadata)
				: {};

		await sourceService.updateSource(sourceId, {
			content: extracted.text,
			metadata: {
				...metadata,
				pageCount: extracted.pageCount ?? metadata.pageCount,
			},
		});

		return {
			sourceId,
			workspaceId: source.workspaceId,
			text: extracted.text,
			pages: extracted.pages,
			source,
		};
	}

	public async chunkSourceContent(
		sourceId: string,
		text: string,
		pages?: string[],
	) {
		await sourceChunkService.deleteChunksBySourceId(sourceId);

		const chunks = pages?.length ? chunkPages(pages) : chunkText(text);

		if (chunks.length === 0) {
			throw new Error("No chunks were generated from source content");
		}

		return sourceChunkService.createSourceChunks(
			chunks.map((chunk) => ({
				sourceId,
				index: chunk.index,
				content: chunk.content,
				tokenCount: Math.ceil(chunk.content.length / 4),
				metadata: chunk.metadata as Prisma.InputJsonValue | undefined,
			})),
		);
	}

	public async embedAndIndexSource(
		source: SourceRecord,
		chunks: SourceChunkRecord[],
	) {
		const batchSize = 50;
		const records: PineconeRecord<VectorMetadata>[] = [];

		for (let i = 0; i < chunks.length; i += batchSize) {
			const batch = chunks.slice(i, i + batchSize);
			const embeddings = await embedTexts(batch.map((chunk) => chunk.content));

			for (let j = 0; j < batch.length; j += 1) {
				const chunk = batch[j]!;
				const embedding = embeddings[j]!;
				const chunkMetadata =
					chunk.metadata &&
					typeof chunk.metadata === "object" &&
					!Array.isArray(chunk.metadata)
						? (chunk.metadata as Record<string, unknown>)
						: {};

				records.push({
					id: chunk.id,
					values: embedding,
					metadata: {
						workspaceId: source.workspaceId,
						sourceId: source.id,
						chunkId: chunk.id,
						chunkIndex: chunk.index,
						sourceTitle: source.title,
						sourceType: source.type,
						text: chunk.content.slice(0, 35000),
						...(typeof chunkMetadata.page === "number"
							? { page: chunkMetadata.page }
							: {}),
					},
				});
			}
		}

		await upsertSourceVectors(source.workspaceId, records);

		const metadata =
			source.metadata &&
			typeof source.metadata === "object" &&
			!Array.isArray(source.metadata)
				? (source.metadata as SourceMetadata)
				: {};

		return sourceService.updateSource(source.id, {
			status: "READY",
			metadata: {
				...metadata,
				chunkCount: chunks.length,
				indexedAt: new Date().toISOString(),
				processingError: undefined,
			},
		});
	}

	public async removeSourceFromIndex(workspaceId: string, sourceId: string) {
		await deleteSourceVectors(workspaceId, sourceId);
		await sourceChunkService.deleteChunksBySourceId(sourceId);
	}

	public async listChunksForSource(sourceId: string) {
		const chunks = await sourceChunkService.getChunksBySourceId(sourceId);
		return {
			chunks,
			count: chunks.length,
		};
	}
}
