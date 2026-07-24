import { CreateExpressContextOptions } from '@trpc/server/adapters/express'


export interface TRPCCtxUser {
    id: string
}
export interface TRPCContext {
    name: string
}

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        name: 'Synapse'
    }

    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
