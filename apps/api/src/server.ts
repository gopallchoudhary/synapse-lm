import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import * as trpcExpress from '@trpc/server/adapters/express'
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { env } from './env';

export const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(cookieParser())


app.use(express.json());

app.get('/', (req, res) => {
    return res.json({ message: 'Synapse LLM is up and running' })
})

app.get('/health', (req, res) => {
    return res.json({ message: 'Synapse LLM server is up and running' })
})

export default app