import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "@repo/logger";
import * as trpcExpress from "@trpc/server/adapters/express";
import {
	generateOpenApiDocument,
	createOpenApiExpressMiddleware,
} from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";
import { serverRouter } from "@repo/trpc/server";
import { env } from "./env";
import { clerkMiddleware } from '@clerk/express'
import {createContext} from './tRPCContext'
export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
	title: "Streamyst OpenAPI",
	version: "1.0.0",
	baseUrl: env.BASE_URL.concat("/api"),
});

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);

app.use(cookieParser());
app.use(clerkMiddleware())
app.use(express.json());

app.get("/", (req, res) => {
	return res.json({ message: "Synapse LLM is up and running" });
});

app.get("/health", (req, res) => {
	return res.json({
		message: "Synapse LLM server is up and running",
		healthy: true,
	});
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
	return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
	"/api",
	createOpenApiExpressMiddleware({
		router: serverRouter,
		createContext,
	}),
);

app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: serverRouter,
		createContext,
	}),
);

export default app;
