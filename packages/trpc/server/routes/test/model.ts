// required schema for the test procedures


import { z } from 'zod'

export const createTestInputModel = z.object({
    email: z.email().describe('Email for test'),
    name: z.string()
})


export const createTestOutputModel = z.object({
    id: z.string()
})