import { z } from "zod";

export const artifactTypeModel = z.enum([
	"SUMMARY",
	"TAKEAWAYS",
	"FLASHCARDS",
	"QUIZ",
	"MINDMAP",
	"REPORT",
]);

export const artifactStatusModel = z.enum([
	"PENDING",
	"PROCESSING",
	"READY",
	"FAILED",
]);

export const workspaceIdArtifactParamModel = z.object({
	workspaceId: z.string().trim().min(1),
});

export const artifactIdParamModel = z.object({
	workspaceId: z.string().trim().min(1),
	artifactId: z.string().trim().min(1),
});

export const createArtifactInputModel = z.object({
	workspaceId: z.string().trim().min(1),
	type: artifactTypeModel,
	title: z.string().trim().min(1).max(120).optional(),
	sourceIds: z.array(z.string().trim().min(1)).min(1),
});

export const artifactOutputModel = z.object({
	id: z.string(),
	workspaceId: z.string(),
	type: artifactTypeModel,
	title: z.string(),
	content: z.unknown().nullable(),
	sourceIds: z.array(z.string()),
	status: artifactStatusModel,
	metadata: z.unknown().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const artifactListOutputModel = z.array(artifactOutputModel);

export const deleteArtifactOutputModel = z.object({
	deleted: z.boolean(),
});