import { OpenAI } from "openai";
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "../types/ai-config.js";

let client: OpenAI | null = null;

export async function embedTexts(texts: string[]): Promise<number[][]> {
	if (texts.length === 0) {
		return [];
	}

	if (!process.env.OPENROUTER_API_KEY) {
		throw new Error("OPENROUTER_API_KEY is not configured");
	}

	if (!client) {
		client = new OpenAI({
			apiKey: process.env.OPENROUTER_API_KEY,
			baseURL: process.env.OPENROUTER_BASE_URL,
		});
	}

	const response = await client.embeddings.create({
		model: EMBEDDING_MODEL,
		input: texts,
		dimensions: EMBEDDING_DIMENSIONS,
	});

	return response.data
		.sort((a, b) => a.index - b.index)
		.map((item) => item.embedding);
}
