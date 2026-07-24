import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {logger} from '@repo/logger'
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

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`)



logger.debug(`docs: ${env.BASE_URL}/docs`)
app.use("/docs", apiReference({ url: "/openapi.json" }));

export default app