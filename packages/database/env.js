"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z
        .preprocess((val) => (typeof val === "string" && val.trim() === "" ? undefined : val), zod_1.z.string().default("postgresql://postgres:postgres@localhost:5432/postgres")),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
});
function createEnv(env) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success)
        throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}
exports.env = createEnv(process.env);
