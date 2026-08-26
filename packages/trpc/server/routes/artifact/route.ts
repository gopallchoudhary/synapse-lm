import { artifactService } from "../../services/index.js";
import { protectedProcedure, router } from "../../trpc.js";
import { generatePath } from "../../utils/path-generator.js";
import {
	artifactIdParamModel,
	artifactListOutputModel,
	artifactOutputModel,
	createArtifactInputModel,
	deleteArtifactOutputModel,
	workspaceIdArtifactParamModel,
} from "./model.js";

const TAGS = ["Artifact"];
const getPath = generatePath("/artifact");

export const artifactRouter = router({
	list: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: getPath("/list"),
				tags: TAGS,
			},
		})
		.input(workspaceIdArtifactParamModel)
		.output(artifactListOutputModel)
		.query(({ input, ctx }) =>
			artifactService.listArtifactsByWorkspaceId(ctx.userId, input),
		),

	get: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: getPath("/get"),
				tags: TAGS,
			},
		})
		.input(artifactIdParamModel)
		.output(artifactOutputModel)
		.query(({ input, ctx }) =>
			artifactService.getArtifactByIdAndWorkspaceId(ctx.userId, input),
		),

	create: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: getPath("/create"),
				tags: TAGS,
			},
		})
		.input(createArtifactInputModel)
		.output(artifactOutputModel)
		.mutation(({ input, ctx }) =>
			artifactService.createArtifactByWorkspaceId(ctx.userId, input),
		),

	delete: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: getPath("/delete"),
				tags: TAGS,
			},
		})
		.input(artifactIdParamModel)
		.output(deleteArtifactOutputModel)
		.mutation(async ({ input, ctx }) => {
			await artifactService.deleteArtifactById(ctx.userId, input);
			return { deleted: true };
		}),
});