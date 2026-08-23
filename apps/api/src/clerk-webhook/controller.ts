import { Request, Response } from "express";
import { Webhook } from "svix";
import {prisma} from "@repo/database"
// import UserModel from "../models/user.model";

export const clerkWebhook = async (req: Request, res: Response) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET!;

    const wh = new Webhook(secret);
    let event: any;

    try {
        event = wh.verify(req.body, {
            "svix-id": req.headers["svix-id"] as string,
            "svix-timestamp": req.headers["svix-timestamp"] as string,
            "svix-signature": req.headers["svix-signature"] as string,
        });
    } catch (err) {
        return res.status(400).json({ message: "Invalid webhook signature" });
    }

    if (event.type === "user.created") {

        const { id, email_addresses, first_name, last_name } = event.data;
        const email = email_addresses[0]?.email_address;

        // await UserModel.create({
        //     clerkId: id,
        //     email,
        //     name: [first_name, last_name].filter(Boolean).join(" ") || "",
        //     role: "customer",      // default role
        // });
        
    }

    res.status(200).json({ received: true });
};