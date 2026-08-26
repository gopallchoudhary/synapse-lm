import { initTRPC, TRPCError } from '@trpc/server'
import { OpenApiMeta } from 'trpc-to-openapi'
import type { TRPCContext } from './context.js'
import { UserService } from '@repo/services'




export const tRPCContext = initTRPC
    .meta<OpenApiMeta>()
    .context<TRPCContext>()
    .create({})


export const router = tRPCContext.router

export const publicProcedure = tRPCContext.procedure

export const protectedProcedure = tRPCContext.procedure.use(async ({ ctx, next }) => {
    const userId = ctx.userId;
    if (!userId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required.",
        });
    }

    await new UserService().ensureClerkUser(
        userId,
        () => ctx.clerk.users.getUser(userId),
    );

    return next({
        ctx: {
            ...ctx,
            // userId is now guaranteed to be a string
            userId,
        },
    });
})

