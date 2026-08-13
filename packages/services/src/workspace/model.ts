import { z } from 'zod'

export const CHAT_MODELS = ["gpt-4o-mini", "gpt-4o"] as const;


//. create workspace schema 
export const createWorkspaceSchemaInput = z.object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: z.string().trim().max(500).optional(),
    icon: z.string().trim().max(8).optional(),
    defaultModel: z.enum(CHAT_MODELS).optional(),
});

//, create workspace schema input type 
export type CreateWorkspaceInputType = z.infer<typeof createWorkspaceSchemaInput>;


//. update workspace schema
export const updateWorkspaceSchema = createWorkspaceSchemaInput.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" },
);

//, update workspace schema input type
export type UpdateWorkspaceInputType = z.infer<typeof updateWorkspaceSchema>;

//. workspace id 
export const deleteWorkspaceInput = z.object({
    workspaceId: z.string().trim().min(1),
});

//, delete workspace input type
export type DeleteWorkspaceInputType = z.infer<typeof deleteWorkspaceInput>;

