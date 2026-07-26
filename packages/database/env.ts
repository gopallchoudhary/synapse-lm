import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z
        .preprocess(
            (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
            z.string().default("postgresql://postgres:postgres@localhost:5432/postgres")
        ),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}

export const env = createEnv(process.env);

