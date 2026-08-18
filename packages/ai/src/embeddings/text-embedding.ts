import { OpenAI } from "openai";
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "../types/ai-config.js";

const client = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: process.env.OPENROUTER_BASE_URL,
});

export async function embedTexts(texts: string[]): Promise<number[][]> {
	if (texts.length === 0) {
		return [];
	}

	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY is not configured");
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
