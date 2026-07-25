import { prisma } from '@repo/database'
import { TestSchemaInputType, testSchemaInput } from './model'

class TestService {
    public async createTest(payload: TestSchemaInputType) {
        const { email, name } = await testSchemaInput.parseAsync(payload)
        const test = await prisma.test.create({
            data: {
                email,
                name
            }
        })

        return {
            id: test?.id
        }
    }
}

export default TestService