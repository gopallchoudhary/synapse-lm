import { z } from "zod";
import {
    createWorkspaceSchemaInput,
    updateWorkspaceSchema,
} from "@repo/services";

export const workspaceIdInputModel = z.object({
    workspaceId: z.string().trim().min(1),
});

export const createWorkspaceInputModel = createWorkspaceSchemaInput;

export const updateWorkspaceInputModel = workspaceIdInputModel.extend({
    data: updateWorkspaceSchema,
});

export const workspaceOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    defaultModel: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const workspaceListOutputModel = z.array(workspaceOutputModel);

export const deleteWorkspaceOutputModel = z.object({
    deleted: z.boolean(),
});

export type WorkspaceOutput = z.infer<typeof workspaceOutputModel>;
