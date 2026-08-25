import { inngest } from "@repo/jobs-client";
import {
	SourceProcessingService,
	SourceService,
	ArtifactService,
	SourceChunkService,
	ConversationService,
} from "@repo/services";

const sourceProcessingService = new SourceProcessingService();
const sourceService = new SourceService();
const sourceChunkService = new SourceChunkService();
const artifactService = new ArtifactService();
const conversationService = new ConversationService();

//. Process Source
export const processSource = inngest.createFunction(
	{
		id: "process-source",
		retries: 3,
		triggers: [{ event: "source/created" }],
	},

	async ({ event, step }) => {
		const { sourceId, workspaceId } = event.data;

		const source = await step.run("validate-source", () =>
			sourceService.getSourceById(sourceId),
		);
		if (source.workspaceId !== workspaceId) {
			throw new Error("Source does not belong to the event workspace");
		}

		//, step-1: mark source processing
		await step.run("mark-processing", () =>
			sourceProcessingService.markSourceProcessing(sourceId),
		);

		try {
			// -> extract source content
			// -> chunk source content
			// -> embed and index source content

			//, step-2 extreact source content
			const extracted = await step.run("extract-content", () =>
				sourceProcessingService.extractSourceContent(sourceId),
			);

			//, step-3 chunk source content
			await step.run("chunk-content", () =>
				sourceProcessingService.chunkSourceContent(
					sourceId,
					extracted.text,
					extracted.pages,
				),
			);

			//, step-4 embed and index
			const result = await step.run("embed-and-index", async () => {
				const source = await sourceService.getSourceById(sourceId);
				if (!source) {
					throw new Error("Source not found");
				}

				const chunks = await sourceChunkService.getChunksBySourceId(sourceId);

				await sourceProcessingService.embedAndIndexSource(source, chunks);

				return { chunkCount: chunks.length };
			});

			return { sourceId, status: "READY", ...result };
		} catch (error) {
			// -> find source by id
			// -> mark source failed
			await step.run("mark-failed", async () => {
				const source = await sourceService.getSourceById(sourceId);

				if (source) {
					await sourceProcessingService.markSourceFailed(
						sourceId,
						error,
						source.metadata,
					);
				}
			});

			throw Error;
		}
	},
);

//. generate artifact

export const generateArtifact = inngest.createFunction(
	{
		id: "generate-artifact",
		retries: 2,
		triggers: [{ event: "artifact/generate" }],
	},
	async ({ event, step }) => {
		const { artifactId } = event.data;

		await step.run("generate", () =>
			artifactService.processArtifactById(artifactId),
		);
	},
);

export const summarizeConversation = inngest.createFunction(
	{
		id: "summarize-conversation",
		retries: 2,
		triggers: [{ event: "conversation/summarize" }],
	},
	async ({ event, step }) => {
		const { conversationId } = event.data;
		await step.run("summarize", async () =>
			conversationService.summarizeConversationById(conversationId),
		);
	},
);

export const functions = [processSource, generateArtifact, summarizeConversation];
