import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getAuth } from "@clerk/express";
import type { TRPCContext } from "@repo/trpc/server";

export async function createContext({
    req,
}: CreateExpressContextOptions): Promise<TRPCContext> {
    const { userId } = getAuth(req);

    return {
        userId: userId ?? null,
    };
}