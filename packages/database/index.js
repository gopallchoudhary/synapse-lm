"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("./generated/prisma/client");
require("dotenv/config");
const env_1 = require("./env");
const globalForPrisma = globalThis;
function createPrismaClient() {
    const url = env_1.env.DATABASE_URL;
    if (!url)
        throw new Error('DATABASE_URL is not defined');
    const adapter = new adapter_pg_1.PrismaPg({
        connectionString: url,
    });
    return new client_1.PrismaClient({ adapter });
}
exports.prisma = globalForPrisma.prisma ?? createPrismaClient();
if (env_1.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
