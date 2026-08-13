// required zod schema models for the test services 

import { z } from 'zod'

export const testSchemaInput = z.object({
    email: z.email().describe('Email for test'),
    name: z.string()
})

export type TestSchemaInputType = z.infer<typeof testSchemaInput>