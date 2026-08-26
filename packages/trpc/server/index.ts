import { artifactRouter } from "./routes/artifact/route.js";
import { chatRouter } from "./routes/chat/route.js";
import { sourceRouter } from "./routes/source/route.js";
import { testRouter } from "./routes/test/route.js";
import { workspaceRouter } from "./routes/workspace/route.js";
import { router } from "./trpc.js";




export const serverRouter = router({
    test: testRouter,
    workspace: workspaceRouter,
    source: sourceRouter,
    artifact: artifactRouter,
    chat: chatRouter,
})

export type { TRPCContext } from './context.js'
export type ServerRouter = typeof serverRouter
