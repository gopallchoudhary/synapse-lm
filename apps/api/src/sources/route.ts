import { Router } from "express";
import { z } from "zod";
import { SourceService } from "@repo/services";
import requireAuth from "../middleware/require-auth";
import { uploadSinglePdf } from "../middleware/upload-middleware";

const sourceService = new SourceService();

const workspaceIdParamsSchema = z.object({
	workspaceId: z.string().trim().min(1),
});

export const sourceRoutes = Router({ mergeParams: true });

sourceRoutes.post(
	"/upload",
	requireAuth,
	uploadSinglePdf,
	async (req, res) => {
		const { workspaceId } = workspaceIdParamsSchema.parse(req.params);

		if (!req.userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		if (!req.file) {
			res.status(400).json({ message: "A PDF file is required" });
			return;
		}

		const title =
			typeof req.body?.title === "string" && req.body.title.trim()
				? req.body.title.trim()
				: undefined;

		const source = await sourceService.uploadPdfSource(
			req.userId,
			{ workspaceId },
			{
				buffer: req.file.buffer,
				originalname: req.file.originalname,
			},
			title,
		);

		res.status(201).json(source);
	},
);