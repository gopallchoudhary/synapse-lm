import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getAuth, clerkClient } from "@clerk/express";
import type { TRPCContext } from "@repo/trpc/server";

export async function createContext({
    req,
}: CreateExpressContextOptions): Promise<TRPCContext> {
    const { userId } = getAuth(req);

    return {
        userId: userId ?? null,
        clerk: {
            users: {
                getUser: async (userId: string) => {
                    const user = await clerkClient.users.getUser(userId);
                    return user;
                },
            },
        },
    };
}