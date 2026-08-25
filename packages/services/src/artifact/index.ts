import { prisma } from "@repo/database";
import WorkspaceService from "../workspace/index.js";
import ArtifactGenarationService from "../artifact-generation/index.js";
import {
    ArtifactRecord,
    artifactSelect,
    createArtifactByWorkspaceIdInput,
    CreateArtifactByWorkspaceIdInputType,
    CreateArtifactData,
    CreateArtifactForWorkspaceInputType,
    deleteArtifactByIdInput,
    DeleteArtifactByIdInputType,
    getArtifactByIdAndWorkspaceIdInput,
    GetArtifactByIdAndWorkspaceIdInputType,
    listArtifactsByWorkspaceIdInput,
    ListArtifactsByWorkspaceIdInputType,
} from "./model.js";
import { NotFoundError } from "@repo/errors";
import { Prisma } from "@repo/database/generated/prisma/client.js";

const workspaceService = new WorkspaceService();
const artifactGenerationService = new ArtifactGenarationService();

class ArtifactService {
    public async listArtifactsByWorkspaceId(
        userId: string,
        payload: ListArtifactsByWorkspaceIdInputType,
    ) {
        const { workspaceId } = listArtifactsByWorkspaceIdInput.parse(payload);

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
        userId: string,
        payload: GetArtifactByIdAndWorkspaceIdInputType,
    ) {
        const { workspaceId, artifactId } =
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

    //, find artifact by id
    private async findArtifactById(artifactId: string) {
        return prisma.learningArtifact.findUnique({
            where: { id: artifactId },
            select: artifactSelect,
        });
    }

    private async getArtifactOwnerClerkId(workspaceId: string) {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { user: { select: { clerkId: true } } },
        });

        if (!workspace) {
            throw new NotFoundError("Workspace not found");
        }

        return workspace.user.clerkId;
    }

    //, upate artifact record
    private updateArtifactRecord(
        artifactId: string,
        data: {
            title?: string;
            content?: Prisma.InputJsonValue;
            status?: ArtifactRecord["status"];
            metadata?: Prisma.InputJsonValue;
        },
    ) {
        return prisma.learningArtifact.update({
            where: { id: artifactId },
            data,
            select: artifactSelect,
        });
    }

    //. process artifact by id
    public async processArtifactById(artifactId: string) {
        const artifact = await this.findArtifactById(artifactId);
        if (!artifact) {
            throw new Error("Artifact not found");
        }

        await this.updateArtifactRecord(artifactId, {
            status: "PROCESSING",
        });

        try {
            const ownerClerkId = await this.getArtifactOwnerClerkId(
                artifact.workspaceId,
            );
            const context = await artifactGenerationService.gatherSourceContext(
                artifact.workspaceId,
                ownerClerkId,
                artifact.sourceIds,
            );

            const content = await artifactGenerationService.generateArtifactContent(
                artifact.type,
                context.text,
            );

            return this.updateArtifactRecord(artifactId, {
                status: "READY",
                content: content as Prisma.InputJsonValue,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    processingError: undefined,
                },
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Artifact generation failed";

            await this.updateArtifactRecord(artifactId, {
                status: "FAILED",
                metadata: {
                    processingError: message,
                },
            });

            throw error
        }
    }

    //, create artifact record
    private async createArtifactRecord(data: CreateArtifactData) {
        return prisma.learningArtifact.create({
            data: {
                workspaceId: data.workspaceId,
                type: data.type,
                title: data.title,
                sourceIds: data.sourceIds,
                status: data.status ?? "PENDING",
                metadata: data.metadata,
            },
            select: artifactSelect,
        });
    }

    //, create artifact for workspace
    private async createArtifactForWorkspace(
        workspaceId: string,
        userId: string,
        input: CreateArtifactForWorkspaceInputType
    ) {
        await workspaceService.getWorkspaceByIdAndUserId(workspaceId, userId);
        const context = await artifactGenerationService.gatherSourceContext(workspaceId, userId, input.sourceIds)

        const artifact = await this.createArtifactRecord({
            workspaceId,
            type: input.type,
            title:
                input.title ||
                `${{
                    SUMMARY: "Summary",
                    TAKEAWAYS: "Key Takeaways",
                    FLASHCARDS: "Flashcards",
                    QUIZ: "Quiz",
                    MINDMAP: "Mind Map",
                    REPORT: "AI Report",
                }[input.type]
                } · ${new Date().toLocaleDateString()}`,
            sourceIds: context.sourceIds,
            status: "PENDING",
        });

        await artifactGenerationService.enqueueArtifactGeneration({
            artifactId: artifact.id,
            workspaceId,
        });

        return artifact;
    }

    public async createArtifactByWorkspaceId(
        userId: string,
        payload: CreateArtifactByWorkspaceIdInputType,
    ) {
        const { workspaceId, type, title, sourceIds } =
            createArtifactByWorkspaceIdInput.parse(payload);

        const artifact = await this.createArtifactForWorkspace(workspaceId, userId, {
            type,
            title,
            sourceIds,
        });

        return artifact;
    }

    public async deleteArtifactById(
        userId: string,
        payload: DeleteArtifactByIdInputType,
    ) {
        const { artifactId, workspaceId } = deleteArtifactByIdInput.parse(payload);

        await this.getArtifactByIdAndWorkspaceId(userId, {
            workspaceId,
            artifactId,
        });

        await prisma.learningArtifact.delete({
            where: {
                id: artifactId,
            },
        });

    }
}


export default ArtifactService;
