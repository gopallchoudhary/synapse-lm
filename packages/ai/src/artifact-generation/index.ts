import { generateText as aiGenerateText, Output } from "ai";
import { GenerateObjectOptions, GenerateTextOptions } from "./model.js";
import { getChatModel } from "../get-model.js";


export async function generateTextContent(opts: GenerateTextOptions): Promise<string> {
    const result = await aiGenerateText({
        model: getChatModel(opts.model!),
        system: opts.system,
        prompt: opts.prompt,
    });
    return result.text;
}


export async function generateStructuredContent<T>(
    opts: GenerateObjectOptions<T>,
): Promise<T> {
    const result = await aiGenerateText({
        model: getChatModel(opts.model!),
        system: opts.system,
        output: Output.object({ schema: opts.schema }),
        prompt: opts.prompt,
    });
    return result.output;
}