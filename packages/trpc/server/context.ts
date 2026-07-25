import { CreateExpressContextOptions } from '@trpc/server/adapters/express'



export interface TRPCContext {
    userId: string | null
}

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        userId: '2323'
    }

    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
