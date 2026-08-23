import { prisma } from "@repo/database";
import WorkspaceService from "../workspace/index.js";
import {
    artifactSelect,
    createArtifactByWorkspaceIdInput,
    CreateArtifactByWorkspaceIdInputType,
    getArtifactByIdAndWorkspaceIdInput,
    GetArtifactByIdAndWorkspaceIdInputType,
    listArtifactsByWorkspaceIdInput,
    ListArtifactsByWorkspaceIdInputType,
} from "./model.js";
import { NotFoundError } from "@repo/errors";

const workspaceService = new WorkspaceService();

class ArtifactService {
    public async listArtifactsByWorkspaceId(
        payload: ListArtifactsByWorkspaceIdInputType,
    ) {
        const { userId, workspaceId } =
            listArtifactsByWorkspaceIdInput.parse(payload);

        await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

        return await prisma.learningArtifact.findMany({
            where: {
                workspaceId,
            },
            select: artifactSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    public async getArtifactByIdAndWorkspaceId(
        payload: GetArtifactByIdAndWorkspaceIdInputType,
    ) {
        const { userId, workspaceId, artifactId } =
            getArtifactByIdAndWorkspaceIdInput.parse(payload);
        await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

        const artifact = await prisma.learningArtifact.findFirst({
            where: {
                id: artifactId,
                workspaceId,
            },
            select: artifactSelect,
        });

        if (!artifact) {
            throw new NotFoundError("Artifact not found");
        }

        return artifact;
    }

    public async createArtifactByWorkspaceId(
        userId: string,
        payload: CreateArtifactByWorkspaceIdInputType,
    ) {
        const { workspaceId, type, title, sourceIds } =
            createArtifactByWorkspaceIdInput.parse(payload);


        await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);

        
	}
}
