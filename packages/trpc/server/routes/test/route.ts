import { testSerive } from '../../services/index.js'
import { protectedProcedure, router } from '../../trpc.js'
import { generatePath } from '../../utils/path-generator.js'
import { createTestInputModel, createTestOutputModel } from './model.js'

const TAGS = ["Test"]
const getPath = generatePath("/test")


export const testRouter = router({
    createTest: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: getPath('/createTest'),
                tags: TAGS
            }
        })
        .input(createTestInputModel)
        .output(createTestOutputModel)
        .mutation(async ({ input }) => {
            const { email, name } = input
            const { id } = await testSerive.createTest({ email, name })

            return { id }
        })
})