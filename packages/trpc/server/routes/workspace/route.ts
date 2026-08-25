import { workspaceService } from "../../services/index.js";
import { protectedProcedure, router } from "../../trpc.js";
import { generatePath } from "../../utils/path-generator.js";
import { z } from "zod";
import {
    createWorkspaceInputModel,
    deleteWorkspaceOutputModel,
    updateWorkspaceInputModel,
    workspaceIdInputModel,
    workspaceListOutputModel,
    workspaceOutputModel,
} from "./model.js";

const TAGS = ["Workspace"];
const getPath = generatePath("/workspace");

export const workspaceRouter = router({
    list: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/list"),
                tags: TAGS,
            },
        })
        .input(z.object({}).optional())
        .output(workspaceListOutputModel)
        .query(({ ctx }) => workspaceService.getWorkspacesByUserId(ctx.userId)),

    get: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/get"),
                tags: TAGS,
            },
        })
        .input(workspaceIdInputModel)
        .output(workspaceOutputModel)
        .query(({ input, ctx }) =>
            workspaceService.getWorkspaceByIdAndUserId(input.workspaceId, ctx.userId),
        ),

    create: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/create"),
                tags: TAGS,
            },
        })
        .input(createWorkspaceInputModel)
        .output(workspaceOutputModel)
        .mutation(({ input, ctx }) =>
            workspaceService.createWorkspaceByUserId(ctx.userId, input),
        ),

    update: protectedProcedure
        .meta({
            openapi: {
                method: "PATCH",
                path: getPath("/update"),
                tags: TAGS,
            },
        })
        .input(updateWorkspaceInputModel)
        .output(workspaceOutputModel)
        .mutation(({ input, ctx }) =>
            workspaceService.updateWorkspaceById(
                { workspaceId: input.workspaceId },
                input.data,
                ctx.userId,
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
        .input(workspaceIdInputModel)
        .output(deleteWorkspaceOutputModel)
        .mutation(async ({ input, ctx }) => {
            await workspaceService.deleteWorkspaceById(input, ctx.userId);
            return { deleted: true };
        }),
});
