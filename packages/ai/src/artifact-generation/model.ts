import { z } from "zod";

export type GenerateTextOptions = {
    system?: string;
    prompt: string;
    model?: string;
};


export type GenerateObjectOptions<T> = {
    system?: string;
    prompt: string;
    schema: z.ZodType<T>;
    model?: string;
};