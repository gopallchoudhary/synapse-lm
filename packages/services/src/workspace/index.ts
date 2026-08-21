import { prisma } from "@repo/database";
import { deleteWorkspaceVectors } from "@repo/vector-store";

import {
	createWorkspaceSchemaInput,
	CreateWorkspaceInputType,
	updateWorkspaceSchema,
	UpdateWorkspaceInputType,
	DeleteWorkspaceInputType,
	deleteWorkspaceInput,
	workspaceSelect,
	WorkspaceRecord,
} from "./model.js";

import {
	AppError,
	ValidationError,
	NotFoundError,
	ConflictError,
	UnauthorizedError,
} from "@repo/errors";
import { workspaceIdParamSchema, WorkspaceIdParamSchemaType } from "../source/model.js";
class WorkspaceService {
	private async getWorkspaceById(workspaceId: string) {
		const workspace = await prisma.workspace.findUnique({
			where: {
				id: workspaceId,
			},
		});
		if (!workspace) {
			throw new NotFoundError("Workspace not found");
		}
		return workspace;
	}

	public async getWorkspacesByUserId(userId: string) {
		const workspaces = await prisma.workspace.findMany({
			where: {
				userId,
			},
		});

		if (!workspaces) {
			throw new NotFoundError("Workspace not found");
		}

		return workspaces;
	}

	public async getWorkspaceByIdAndUserId(
		workspaceId: string,
		userId: string,
	): Promise<WorkspaceRecord> {
		const workspace = await prisma.workspace.findFirst({
			where: {
				id: workspaceId,
				userId,
			},
			select: workspaceSelect,
		});
		if (!workspace) {
			throw new NotFoundError("Workspace not found");
		}
		return workspace;
	}

	public async createWorkspace(
		userId: string,
		payload: CreateWorkspaceInputType,
	) {
		const { title, description, icon, defaultModel } =
			createWorkspaceSchemaInput.parse(payload);
		const workspace = await prisma.workspace.create({
			data: {
				userId,
				title,
				description,
				icon,
				defaultModel,
			},
			select: workspaceSelect,
		});
		return workspace;
	}

	public async updateWorkspaceById(
		workspacePayload: WorkspaceIdParamSchemaType,
		payload: UpdateWorkspaceInputType,
		userId: string,
	) {
		const { workspaceId } = workspaceIdParamSchema.parse(workspacePayload);
		const data = updateWorkspaceSchema.parse(payload);

		await this.getWorkspaceByIdAndUserId(workspaceId, userId);

		const workspace = await prisma.workspace.update({
			where: {
				id: workspaceId,
			},
			data,
			select: workspaceSelect,
		});
		return workspace;
	}

	public async deleteWorkspaceById(
		payload: DeleteWorkspaceInputType,
		userId: string,
	) {
		const { workspaceId } = deleteWorkspaceInput.parse(payload);

		// check before deleting
		await this.getWorkspaceByIdAndUserId(workspaceId, userId);

		try {
			await deleteWorkspaceVectors(workspaceId);
		} catch (error) {
			console.error("Failed to delete Pinecone namespace:", error);
		}

		await prisma.workspace.delete({
			where: {
				id: workspaceId,
			},
		});
	}

	
}

export default WorkspaceService;
