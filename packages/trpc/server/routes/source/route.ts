import { sourceService } from "../../services/index.js";
import { protectedProcedure, router } from "../../trpc.js";
import { generatePath } from "../../utils/path-generator.js";
import {
	createSourceInputModel,
	deleteSourceOutputModel,
	importWebsiteInputModel,
	importYoutubeInputModel,
	listSourcesInputModel,
	reprocessManyInputModel,
	reprocessManyOutputModel,
	reprocessSourceOutputModel,
	sourceIdParamModel,
	sourceListOutputModel,
	sourceOutputModel,
} from "./model.js";

const TAGS = ["Source"];
const getPath = generatePath("/source");

export const sourceRouter = router({
	list: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: getPath("/list"),
				tags: TAGS,
			},
		})
		.input(listSourcesInputModel)
		.output(sourceListOutputModel)
		.query(({ input, ctx }) =>
			sourceService.getSourcesByWorkspaceId(ctx.userId, input.workspaceId, {
				q: input.q,
				type: input.type,
				status: input.status,
			}),
		),

	get: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: getPath("/get"),
				tags: TAGS,
			},
		})
		.input(sourceIdParamModel)
		.output(sourceOutputModel)
		.query(({ input, ctx }) =>
			sourceService.getSourceByIdAndWorkspaceId(
				ctx.userId,
				input.workspaceId,
				input.sourceId,
			),
		),

	create: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/create"),
				tags: TAGS,
			},
		})
		.input(createSourceInputModel)
		.output(sourceOutputModel)
		.mutation(({ input, ctx }) =>
			sourceService.createSource(
				ctx.userId,
				{ workspaceId: input.workspaceId },
				input,
			),
		),

	importWebsite: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/import-website"),
				tags: TAGS,
			},
		})
		.input(importWebsiteInputModel)
		.output(sourceOutputModel)
		.mutation(({ input, ctx }) =>
			sourceService.importWebsite(
				ctx.userId,
				{ workspaceId: input.workspaceId },
				{ url: input.url, title: input.title },
			),
		),

	importYoutube: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/import-youtube"),
				tags: TAGS,
			},
		})
		.input(importYoutubeInputModel)
		.output(sourceOutputModel)
		.mutation(({ input, ctx }) =>
			sourceService.importYoutube(
				ctx.userId,
				{ workspaceId: input.workspaceId },
				{ url: input.url, title: input.title },
			),
		),

	delete: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: getPath("/delete"),
				tags: TAGS,
			},
		})
		.input(sourceIdParamModel)
		.output(deleteSourceOutputModel)
		.mutation(async ({ input, ctx }) => {
			await sourceService.deleteSource(ctx.userId, input);
			return { deleted: true };
		}),

	reprocess: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/reprocess"),
				tags: TAGS,
			},
		})
		.input(sourceIdParamModel)
		.output(reprocessSourceOutputModel)
		.mutation(({ input, ctx }) => sourceService.reprocessSource(ctx.userId, input)),

	reprocessMany: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/reprocess-many"),
				tags: TAGS,
			},
		})
		.input(reprocessManyInputModel)
		.output(reprocessManyOutputModel)
		.mutation(({ input, ctx }) =>
			sourceService.reprocessSources(
				ctx.userId,
				{ workspaceId: input.workspaceId },
				{ sourceIds: input.sourceIds },
			),
		),
});