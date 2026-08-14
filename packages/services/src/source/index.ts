import { prisma } from "@repo/database";
import { Prisma } from "@repo/database/generated/prisma/client.js";
import {
	ListSourcesQuery,
	listSourcesQuerySchema,
	sourceSelect,
	sourceIdParamSchema,
	SourceIdParamSchemaType,
	CreateSourceInput,
	WorkspaceIdParamSchemaType,
	workspaceIdParamSchema,
	createSourceSchema,
	CreateSourceData,
	SourceRecord,
	ImportWebsiteInput,
	importWebsiteSchema,
} from "./model.js";
import WorkspaceService from "../workspace/index.js";
import {
	AppError,
	ValidationError,
	NotFoundError,
	ConflictError,
	UnauthorizedError,
} from "@repo/errors";

import { scrapeWebsite, extractPdfFromBuffer } from "@repo/rag";
import { uploadPdfToCloudinary } from "@repo/storage";

const workspaceService = new WorkspaceService();

class SourceService {
	//. get all sources
	public async getSourcesByWorkspaceId(
		workspaceId: string,
		userId: string,
		rawFilters: ListSourcesQuery = {},
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
		payload: SourceIdParamSchemaType,
	) {
		const { workspaceId, sourceId } =
			await sourceIdParamSchema.parseAsync(payload);

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

		return source;
	}

	//, create text or markdown source
	private async createTextOrMarkdownSource(
		workspaceId: string,
		userId: string,
		input: CreateSourceInput,
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
		payload: CreateSourceInput,
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

	//. delete source
	public async deleteSource(userId: string, payload: SourceIdParamSchemaType) {
		const { workspaceId, sourceId } = sourceIdParamSchema.parse(payload);
		await this.getSourceByIdAndWorkspaceId(userId, payload);

		await prisma.source.delete({
			where: {
				id: sourceId,
			},
		});
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

	//. import website source
	public async importWebsiteSource(
		userId: string,
		workspacePayload: WorkspaceIdParamSchemaType,
		payload: ImportWebsiteInput,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);
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
}

export default SourceService;
