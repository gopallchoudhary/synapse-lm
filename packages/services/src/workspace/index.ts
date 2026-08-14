import { prisma } from "@repo/database";

import {
	createWorkspaceSchemaInput,
	CreateWorkspaceInputType,
	updateWorkspaceSchema,
	UpdateWorkspaceInputType,
	DeleteWorkspaceInputType,
	deleteWorkspaceInput,
} from "./model.js";

import {AppError, ValidationError, NotFoundError, ConflictError, UnauthorizedError} from "@repo/errors"
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

	public async getWorkspaceByIdAndUserId(workspaceId: string, userId: string) {
		const workspace = await prisma.workspace.findUnique({
			where: {
				id: workspaceId,
				userId,
			},
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
		});
		return {
			id: workspace?.id,
		};
	}

	public async updateWorkspace(
		workspaceId: string,
		payload: UpdateWorkspaceInputType,
	) {
		const { title, description, icon, defaultModel } =
			updateWorkspaceSchema.parse(payload);
		const workspace = await prisma.workspace.update({
			where: {
				id: workspaceId,
			},
			data: {
				title,
				description,
				icon,
				defaultModel,
			},
		});
		return {
			id: workspace?.id,
		};
	}

	public async deleteWorkspace(payload: DeleteWorkspaceInputType) {
		const { workspaceId } = deleteWorkspaceInput.parse(payload);

		// check before deleting
		await this.getWorkspaceById(workspaceId);

		const workspace = await prisma.workspace.delete({
			where: {
				id: workspaceId,
			},
		});
		return {
			id: workspace?.id,
		};
	}

	public async deleteAllWorkspaces(userId: string) {
		const workspaces = await prisma.workspace.deleteMany({
			where: {
				userId,
			},
		});
		return {
			count: workspaces?.count,
		};
	}
}

export default WorkspaceService;
