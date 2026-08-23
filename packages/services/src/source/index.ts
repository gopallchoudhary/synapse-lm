import { prisma } from "@repo/database";
import type { Prisma } from "@repo/database/generated/prisma/client.js";
import {
	ListSourcesQueryType,
	listSourcesQuerySchema,
	sourceSelect,
	sourceIdParamSchema,
	SourceIdParamSchemaType,
	CreateSourceInputType,
	WorkspaceIdParamSchemaType,
	workspaceIdParamSchema,
	createSourceSchema,
	CreateSourceData,
	SourceRecord,
	ImportWebsiteInputType,
	importWebsiteSchema,
	ImportYoutubeInputType,
	importYoutubeSchema,
	ReprocessSourcesInputType,
	reprocessSourcesSchema,
} from "./model.js";
import WorkspaceService from "../workspace/index.js";
import SourceProcessingService from "../source-processing/index.js";
import {
	AppError,
	ValidationError,
	NotFoundError,
	ConflictError,
	UnauthorizedError,
} from "@repo/errors";

import {
	scrapeWebsite,
	extractPdfFromBuffer,
	fetchYoutubeTranscript,
} from "@repo/rag";
import { uploadPdfToCloudinary } from "@repo/storage";

const workspaceService = new WorkspaceService();
const sourceProcessingService = new SourceProcessingService();

class SourceService {
	//. get all sources
	public async getSourcesByWorkspaceId(
		workspaceId: string,
		userId: string,
		rawFilters: ListSourcesQueryType = {},
	) {
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const filters = listSourcesQuerySchema.parse(rawFilters);

		const where: Prisma.SourceWhereInput = { workspaceId };

		if (filters.type) {
			where.type = filters.type;
		}

		if (filters.status) {
			where.status = filters.status;
		}

		if (filters.q) {
			where.OR = [
				{ title: { contains: filters.q, mode: "insensitive" } },
				{ content: { contains: filters.q, mode: "insensitive" } },
			];
		}

		return await prisma.source.findMany({
			where,
			select: sourceSelect,
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	//. get source by id
	public async getSourceById(sourceId: string) {
		const source = await prisma.source.findUnique({
			where: {
				id: sourceId,
			},
			select: sourceSelect,
		});

		if (!source) {
			throw new NotFoundError("Source not found");
		}

		return source;
	}

	//. get source by id and workspace id
	public async getSourceByIdAndWorkspaceId(
		userId: string,
		workspaceId: string,
		sourceId: string,
	) {
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const source = await prisma.source.findFirst({
			where: {
				id: sourceId,
				workspaceId,
			},
			select: sourceSelect,
		});

		if (!source) {
			throw new NotFoundError("Source not found");
		}

		return source;
	}

	//, create source record
	private async createSourceRecord(data: CreateSourceData) {
		return prisma.source.create({
			data: {
				workspaceId: data.workspaceId,
				type: data.type,
				title: data.title,
				content: data.content ?? null,
				url: data.url ?? null,
				status: data.status ?? "PENDING",
				metadata: data.metadata,
			},
			select: sourceSelect,
		});
	}

	//, create and process source
	private async createAndProcessSource(
		data: Parameters<typeof this.createSourceRecord>[0],
	) {
		const source = await this.createSourceRecord(data);

		// TODO: enqueue source processing
		await sourceProcessingService.enqueueSourceProcessing({
			sourceId: source.id,
			workspaceId: source.workspaceId,
		});

		return source;
	}

	//, create text or markdown source
	private async createTextOrMarkdownSource(
		workspaceId: string,
		userId: string,
		input: CreateSourceInputType,
	) {
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);
		return this.createAndProcessSource({
			workspaceId,
			type: input.type,
			title: input.title,
			content: input.content,
			status: "PENDING",
		});
	}

	//. create source
	public async createSource(
		userId: string,
		workspacePayload: WorkspaceIdParamSchemaType,
		payload: CreateSourceInputType,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);
		const input = createSourceSchema.parse(payload);

		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const source = await this.createTextOrMarkdownSource(
			workspaceId,
			userId,
			input,
		);

		return source;
	}

	//. update source
	public async updateSource(
		sourceId: string,
		data: {
			content?: string | null;
			status?: SourceRecord["status"];
			metadata?: Prisma.InputJsonValue;
		},
	) {
		return prisma.source.update({
			where: { id: sourceId },
			data,
			select: sourceSelect,
		});
	}

	//, import website source
	private async importWebsiteSource(
		userId: string,
		workspaceId: string,
		payload: ImportWebsiteInputType,
	) {
		const { url, title } = importWebsiteSchema.parse(payload);

		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const scraped = await scrapeWebsite(url);

		const source = await this.createAndProcessSource({
			workspaceId,
			type: "WEBSITE",
			title: title || scraped.title || url,
			content: scraped.markdown,
			url: scraped.sourceUrl,
			status: "PENDING",
			metadata: {
				importedFrom: scraped.sourceUrl,
			},
		});

		if (!source) {
			throw new ValidationError("Failed to import website source");
		}

		return source;
	}

	//, import youtube source
	private async importYoutubeSource(
		userId: string,
		workspaceId: string,
		payload: ImportYoutubeInputType,
	) {
		const { url, title } = importYoutubeSchema.parse(payload);
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const transcript = await fetchYoutubeTranscript(url);

		return this.createAndProcessSource({
			workspaceId,
			type: "YOUTUBE",
			title: title || `YouTube: ${transcript.videoId}`,
			content: transcript.content,
			url: url,
			status: "PENDING",
			metadata: {
				videoId: transcript.videoId,
			},
		});
	}

	//, reprocess source
	private async reprocessSourceForWorkspace(
		userId: string,
		workspaceId: string,
		sourceId: string,
	) {
		const source = await this.getSourceByIdAndWorkspaceId(
			userId,
			workspaceId,
			sourceId,
		);

		await sourceProcessingService.removeSourceFromIndex(workspaceId, sourceId);

		const metadata =
			source.metadata &&
				typeof source.metadata === "object" &&
				!Array.isArray(source.metadata)
				? { ...(source.metadata as Record<string, unknown>) }
				: {};

		delete metadata.processingError;

		await this.updateSource(sourceId, {
			status: "PENDING",
			metadata: metadata as Prisma.InputJsonValue,
		});

		await sourceProcessingService.enqueueSourceProcessing({
			sourceId,
			workspaceId,
		});
	}

	//, reprocess sources
	private async reprocessSourcesForWorkspace(
		userId: string,
		workspaceId: string,
		input: ReprocessSourcesInputType = {},
	) {
		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const sources = await this.getSourcesByWorkspaceId(workspaceId, userId, {
			status: "FAILED",
		});

		const targets = input.sourceIds?.length
			? sources.filter((source) => input.sourceIds?.includes(source.id))
			: sources;

		for (const source of targets) {
			await this.reprocessSourceForWorkspace(userId, workspaceId, source.id);
		}

		return {
			reprocessed: targets.length,
		};
	}

	//. upload pdf source
	public async uploadPdfSource(
		userId: string,
		workspacePayload: WorkspaceIdParamSchemaType,
		file: Express.Multer.File,
		title?: string,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);

		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const upload = await uploadPdfToCloudinary(file.buffer, file.originalname);

		let content: string | null = null;
		let pageCount: number | undefined;

		try {
			const extracted = await extractPdfFromBuffer(file.buffer);
			content = extracted.text;
			pageCount = extracted.pageCount;
		} catch {
			// Inngest will retry extraction from Cloudinary if upload-time parse fails.
		}

		const source = await this.createAndProcessSource({
			workspaceId,
			type: "PDF",
			title: title?.trim() || file.originalname.replace(/\.pdf$/i, ""),
			content,
			status: "PENDING",
			metadata: {
				fileUrl: upload.secureUrl,
				fileName: upload.originalFilename,
				fileSize: upload.bytes,
				publicId: upload.publicId,
				resourceType: upload.resourceType,
				pageCount,
			},
		});
	}

	//. import website
	public async importWebsite(
		userId: string,
		workspacePayload: WorkspaceIdParamSchemaType,
		payload: ImportWebsiteInputType,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);
		const { url, title } = importWebsiteSchema.parse(payload);

		await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

		const source = await this.importWebsiteSource(userId, workspaceId, {
			url,
			title,
		});

		return source;
	}

	//. import youtube source
	public async importYoutube(
		userId: string,
		workspacePayload: WorkspaceIdParamSchemaType,
		payload: ImportYoutubeInputType,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);
		const { url, title } = importYoutubeSchema.parse(payload);

		const source = await this.importYoutubeSource(userId, workspaceId, {
			url,
			title,
		});

		return source;
	}

	//. delete source
	public async deleteSource(userId: string, payload: SourceIdParamSchemaType) {
		const { workspaceId, sourceId } = sourceIdParamSchema.parse(payload);
		await this.getSourceByIdAndWorkspaceId(userId, workspaceId, sourceId);
		await sourceProcessingService.removeSourceFromIndex(workspaceId, sourceId);
		await sourceProcessingService.deleteSourceRecord(sourceId);
	}

	//. reprocess source
	public async reprocessSource(
		userId: string,
		payload: SourceIdParamSchemaType,
	) {
		const { workspaceId, sourceId } = sourceIdParamSchema.parse(payload);

		await this.reprocessSourceForWorkspace(userId, workspaceId, sourceId);

		return {
			reprocessed: true,
		};
	}

	//. reprocess sources
	public async reprocessSources(
		userId: string,
		workspacePayload: WorkspaceIdParamSchemaType,
		inputPayload: ReprocessSourcesInputType,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);
		const input = reprocessSourcesSchema.parse(inputPayload);

		const result = await this.reprocessSourcesForWorkspace(
			userId,
			workspaceId,
			input,
		);

		return result;
	}
}

export default SourceService;
