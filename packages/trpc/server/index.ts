import { testRouter } from "./routes/test/route.js";
import { workspaceRouter } from "./routes/workspace/route.js";
import { sourceRouter } from "./routes/source/route.js";
import { router } from "./trpc.js";




export const serverRouter = router({
    test: testRouter,
    workspace: workspaceRouter,
    source: sourceRouter,
})

export type { TRPCContext } from './context.js'
export type ServerRouter = typeof serverRouter
