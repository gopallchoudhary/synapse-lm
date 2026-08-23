import type { Request, Response } from "express";
import { Webhook } from "svix";
import { prisma } from "@repo/database";

interface ClerkUserEventData {
	type: string;
	data: {
		id: string;
		email_addresses: { email_address: string }[];
		first_name: string | null;
		last_name: string | null;
		image_url?: string;
	};
}

export const clerkWebhook = async (req: Request, res: Response) => {
	const secret = process.env.CLERK_WEBHOOK_SECRET!;

	const wh = new Webhook(secret);
	let event: ClerkUserEventData;

	try {
		event = wh.verify(req.body, {
			"svix-id": req.headers["svix-id"] as string,
			"svix-timestamp": req.headers["svix-timestamp"] as string,
			"svix-signature": req.headers["svix-signature"] as string,
		}) as ClerkUserEventData;
	} catch {
		return res.status(400).json({ message: "Invalid webhook signature" });
	}

	if (event.type === "user.created") {
		const { id, email_addresses, first_name, last_name, image_url } =
			event.data;
		const email = email_addresses[0]?.email_address;

		if (email) {
			await prisma.user.upsert({
				where: { clerkId: id },
				update: {},
				create: {
					clerkId: id,
					email,
					name:
						[first_name, last_name].filter(Boolean).join(" ") ||
						email,
					image: image_url,
				},
			});
		}
	}

	res.status(200).json({ received: true });
};
