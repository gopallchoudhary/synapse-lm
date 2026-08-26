/**
 * RAG retrieval and chat system prompt construction.
 *
 * Embeds the user query, searches Pinecone, filters by score,
 * and builds the system prompt with retrieved context, memories, and summary.
 */

import { RAG_MIN_SCORE, RAG_TOP_K, embedTexts } from "@repo/ai";
import { queryWorkspaceVectors } from "@repo/vector-store";

/** A source chunk returned from Pinecone with similarity score. */
export type RetrievedChunk = {
	sourceId: string;
	sourceTitle: string;
	sourceType: string;
	chunkId: string;
	chunkIndex: number;
	page?: number;
	text: string;
	score: number;
};

/**
 * Retrieves the most relevant source chunks for a user query via vector search.
 *
 * @param workspaceId - Workspace namespace in Pinecone
 * @param query - User message text to embed and search with
 * @returns Chunks scoring above {@link RAG_MIN_SCORE}, up to {@link RAG_TOP_K}
 *
 *
 */
export async function retrieveWorkspaceContext(
	workspaceId: string,
	query: string,
): Promise<RetrievedChunk[]> {
	const [embedding] = await embedTexts([query]);
	if (!embedding) {
		return [];
	}
	const matches = await queryWorkspaceVectors(
		workspaceId,
		embedding,
		RAG_TOP_K,
	);

	const chunks: RetrievedChunk[] = [];

	for (const match of matches) {
		const score = match.score ?? 0;
		if (score < RAG_MIN_SCORE) {
			continue;
		}

		const metadata = match.metadata as Record<string, unknown> | undefined;
		if (
			!metadata ||
			typeof metadata.sourceId !== "string" ||
			typeof metadata.sourceTitle !== "string" ||
			typeof metadata.sourceType !== "string" ||
			typeof metadata.chunkId !== "string" ||
			typeof metadata.text !== "string"
		) {
			continue;
		}

		chunks.push({
			sourceId: metadata.sourceId,
			sourceTitle: metadata.sourceTitle,
			sourceType: metadata.sourceType,
			chunkId: metadata.chunkId,
			chunkIndex: Number(metadata.chunkIndex ?? 0),
			...(typeof metadata.page === "number" ? { page: metadata.page } : {}),
			text: metadata.text,
			score,
		});
	}

	return chunks;
}

export type UserMemoryContext = string;

/**
 * Builds the full chat system prompt with RAG context, user memories, summary, and web search hints.
 *
 * @param input - Prompt building blocks from chat service
 * @returns Multi-section system prompt string for `streamText`
 *
 *
 */
export function buildChatSystemPrompt(input: {
	chunks: RetrievedChunk[];
	conversationSummary?: string | null;
	userMemories?: UserMemoryContext[];
	webSearchEnabled?: boolean;
}) {
	const today = new Date().toISOString().split("T")[0];
	const sections: string[] = [
		"You are Chaibook, an assistant that helps users learn from their workspace sources.",
		`Today is ${today}.`,
	];

	if (input.webSearchEnabled) {
		sections.push(
			"You have access to a web_search tool for up-to-date information outside the workspace.",
			"CRITICAL — WHEN WEB SEARCH IS ENABLED: For ANY factual question about real-world events, product launches, release dates, prices, people, news, or information that could have changed since your training data, you MUST call web_search BEFORE answering. Do NOT answer from parametric memory alone. Verify via web search first, then answer using the search results.",
			"If the web results show no information or contradict your knowledge, say so explicitly — never hallucinate a date or fact.",
			"Cite web results inline using [W1], [W2], etc. matching the web result blocks. Prefer web citations over uncited claims when web search was used.",
		);
	}

	if (input.userMemories?.length) {
		const memoryBlock = input.userMemories
			.map((memory) => `- ${memory}`)
			.join("\n");

		sections.push(
			"Known facts about this user (use when relevant):",
			memoryBlock,
		);
	}

	const summary = input.conversationSummary?.trim();
	if (summary) {
		sections.push("Earlier conversation summary:", summary);
	}

	if (input.chunks.length === 0) {
		if (input.webSearchEnabled) {
			sections.push(
				"This workspace has no indexed source content yet, or nothing relevant was retrieved.",
				"WEB SEARCH IS ENABLED: For ANY follow-up factual question you MUST call web_search first and answer from the results. Do not hallucinate dates, versions, or events from memory. If web search returns no results, explicitly state that and do not invent an answer.",
				"Do not invent citations — only cite [W1], [W2] when you have actual web results.",
			);
		} else {
			sections.push(
				"This workspace has no indexed source content yet, or nothing relevant was retrieved.",
				"Answer helpfully from general knowledge and suggest adding or processing sources when appropriate.",
				"Do not invent citations.",
			);
		}
		return sections.join("\n");
	}

	const context = input.chunks
		.map((chunk, index) => {
			const label = `[${index + 1}] ${chunk.sourceTitle} (${chunk.sourceType})${
				chunk.page ? `, page ${chunk.page}` : ""
			}`;
			return `${label}\n${chunk.text}`;
		})
		.join("\n\n");

	sections.push(
		"Use ONLY the retrieved context below when making factual claims about their materials.",
		"If the context is insufficient, say so clearly.",
		"Cite sources inline using [1], [2], etc. matching the numbered context blocks.",
		"Keep answers concise, accurate, and educational.",
		"",
		"Retrieved context:",
		context,
	);

	return sections.join("\n");
}
