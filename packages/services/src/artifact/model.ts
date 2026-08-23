import { z } from 'zod';

export const artifactSelect = {
    id: true,
    workspaceId: true,
    type: true,
    title: true,
    content: true,
    sourceIds: true,
    status: true,
    metadata: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const artifactTypes = [
    "SUMMARY",
    "TAKEAWAYS",
    "FLASHCARDS",
    "QUIZ",
    "MINDMAP",
    "REPORT",
] as const;

export const listArtifactsByWorkspaceIdInput = z.object({
    userId: z.string().trim().min(1),
    workspaceId: z.string().trim().min(1),
});

export const getArtifactByIdAndWorkspaceIdInput = z.object({
    userId: z.string().trim().min(1),
    workspaceId: z.string().trim().min(1),
    artifactId: z.string().trim().min(1, "Artifact id is required"),
});


export const createArtifactByWorkspaceIdInput = z.object({
    workspaceId: z.string().trim().min(1),
    type: z.enum(artifactTypes),
    title: z.string().trim().min(1).max(120).optional(),
    sourceIds: z.array(z.string().trim().min(1)).optional(),
});



export type ListArtifactsByWorkspaceIdInputType = z.infer<typeof listArtifactsByWorkspaceIdInput>;
export type GetArtifactByIdAndWorkspaceIdInputType = z.infer<typeof getArtifactByIdAndWorkspaceIdInput>;
export type CreateArtifactByWorkspaceIdInputType = z.infer<typeof createArtifactByWorkspaceIdInput>;