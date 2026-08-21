
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export const DEFAULT_CHAT_MODEL = "openai/gpt-4o-mini";

export const openrouterClient = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL,
});

export function getChatModel(modelId: string | null): LanguageModel {
    return openrouterClient(modelId ?? DEFAULT_CHAT_MODEL);
}
