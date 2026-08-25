import { config } from "dotenv";
import path from "node:path";
import { z } from "zod";

for (const envPath of [
    path.join(__dirname, ".env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "packages/database/.env"),
    path.resolve(process.cwd(), "../../packages/database/.env"),
    path.resolve(__dirname, "../../../packages/database/.env"),
]) {
    config({ path: envPath });
}

const envSchema = z.object({
    DATABASE_URL: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string().min(1, "DATABASE_URL is required"),
    ),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}

export const env = createEnv(process.env);

