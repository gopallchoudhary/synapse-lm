import {inngest} from "@repo/jobs-client";
import {
	SourceProcessingService,
	SourceService,
	WorkspaceService,
	SourceChunkService,
} from "@repo/services";

const sourceProcessingService = new SourceProcessingService();
const sourceService = new SourceService();
const sourceChunkService = new SourceChunkService();
const workspaceService = new WorkspaceService();

//. Process Source 
export const processSource = inngest.createFunction(
	{
		id: "process-source",
		retries: 3,
		triggers: [{ event: "source/created" }],
	},

	async ({ event, step }) => {
		const { sourceId } = event.data;

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
