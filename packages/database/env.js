"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const node_path_1 = __importDefault(require("node:path"));
const zod_1 = require("zod");
for (const envPath of [
    node_path_1.default.join(__dirname, ".env"),
    node_path_1.default.resolve(process.cwd(), ".env"),
    node_path_1.default.resolve(process.cwd(), "packages/database/.env"),
    node_path_1.default.resolve(process.cwd(), "../../packages/database/.env"),
    node_path_1.default.resolve(__dirname, "../../../packages/database/.env"),
]) {
    (0, dotenv_1.config)({ path: envPath });
}
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.preprocess((val) => (typeof val === "string" && val.trim() === "" ? undefined : val), zod_1.z.string().min(1, "DATABASE_URL is required")),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
});
function createEnv(env) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success)
        throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}
exports.env = createEnv(process.env);
