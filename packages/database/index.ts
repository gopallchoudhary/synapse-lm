import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'
import 'dotenv/config'
import { env } from './env'
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient() {
    const url = env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not defined')

    const adapter = new PrismaPg({
        connectionString: url,
    })

    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma