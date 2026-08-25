import { Router } from "express";
import { streamChat } from "./controller";
import requireAuth from "../middleware/require-auth";


export const chatRoutes = Router({ mergeParams: true })

chatRoutes.post('/', requireAuth, streamChat)