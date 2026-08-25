import express, { Router } from "express";
import { clerkWebhook } from "./controller";

const webhookRouter = Router();

webhookRouter.post(
    "/clerk/webhook",
    express.raw({ type: "application/json" }),
    clerkWebhook,
);

export default webhookRouter;
