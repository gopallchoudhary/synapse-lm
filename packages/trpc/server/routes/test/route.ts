import { testSerive } from '../../services/index'
import { protectedProcedure, router } from '../../trpc'
import { generatePath } from '../../utils/path-generator'
import { createTestInputModel, createTestOutputModel } from './model'

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