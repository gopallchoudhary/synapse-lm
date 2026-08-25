import { z } from "zod";

export const sourceTypeModel = z.enum([
	"PDF",
	"WEBSITE",
	"YOUTUBE",
	"TEXT",
	"MARKDOWN",
]);

export const sourceStatusModel = z.enum([
	"PENDING",
	"PROCESSING",
	"READY",
	"FAILED",
]);

export const workspaceIdSourceParamModel = z.object({
	workspaceId: z.string().trim().min(1),
});

export const sourceIdParamModel = z.object({
	workspaceId: z.string().trim().min(1),
	sourceId: z.string().trim().min(1),
});

export const listSourcesInputModel = workspaceIdSourceParamModel.extend({
	q: z.string().trim().optional(),
	type: sourceTypeModel.optional(),
	status: sourceStatusModel.optional(),
});

export const createSourceInputModel = z.object({
	workspaceId: z.string().trim().min(1),
	type: z.enum(["TEXT", "MARKDOWN"]),
	title: z.string().trim().min(1, "Title is required").max(200),
	content: z.string().trim().min(1, "Content is required"),
});

export const importWebsiteInputModel = workspaceIdSourceParamModel.extend({
	url: z.string().trim().url("Enter a valid URL"),
	title: z.string().trim().max(200).optional(),
});

export const importYoutubeInputModel = workspaceIdSourceParamModel.extend({
	url: z.string().trim().min(1, "YouTube URL is required"),
	title: z.string().trim().max(200).optional(),
});

export const reprocessManyInputModel = workspaceIdSourceParamModel.extend({
	sourceIds: z.array(z.string().trim().min(1)).optional(),
});

export const sourceOutputModel = z.object({
	id: z.string(),
	workspaceId: z.string(),
	type: sourceTypeModel,
	title: z.string(),
	content: z.string().nullable(),
	url: z.string().nullable(),
	status: sourceStatusModel,
	metadata: z.unknown().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const sourceListOutputModel = z.array(sourceOutputModel);

export const deleteSourceOutputModel = z.object({
	deleted: z.boolean(),
});

export const reprocessSourceOutputModel = z.object({
	reprocessed: z.boolean(),
});

export const reprocessManyOutputModel = z.object({
	reprocessed: z.number(),
});
