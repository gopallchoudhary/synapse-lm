import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getAuth, clerkClient } from "@clerk/express";
import type { TRPCContext } from "@repo/trpc/server";
import { UserService } from "@repo/services";

export async function createContext({
    req,
}: CreateExpressContextOptions): Promise<TRPCContext> {
    const { userId } = getAuth(req);
    const clerk = {
        users: {
            getUser: async (clerkUserId: string) => {
                return clerkClient.users.getUser(clerkUserId);
            },
        },
    };

    if (userId) {
        await new UserService().ensureClerkUser(userId, () =>
            clerk.users.getUser(userId),
        );
    }

    return {
        userId: userId ?? null,
        clerk,
    };
}
