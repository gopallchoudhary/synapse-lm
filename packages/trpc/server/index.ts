import { testRouter } from "./routes/test/route";
import { router } from "./trpc";




export const serverRouter = router({
    test: testRouter
})

export type { TRPCContext } from './context'
export type ServerRouter = typeof serverRouter