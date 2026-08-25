import type { Request, Response } from "express";
import { Webhook } from "svix";
import { prisma } from "@repo/database";

interface ClerkUserEventData {
	type: "user.created" | "user.updated" | "user.deleted";
	data: {
		id: string;
		email_addresses?: {
			id: string;
			email_address: string;
			verification?: { status?: string } | null;
		}[];
		primary_email_address_id?: string | null;
		first_name?: string | null;
		last_name?: string | null;
		image_url?: string;
	};
}

export const clerkWebhook = async (req: Request, res: Response) => {
	const secret = process.env.CLERK_WEBHOOK_SECRET;
	if (!secret) {
		return res.status(500).json({ message: "Webhook secret is not configured" });
	}

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

	if (event.type === "user.deleted") {
		await prisma.user.deleteMany({ where: { clerkId: event.data.id } });
		return res.status(200).json({ received: true });
	}

	const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } =
		event.data;
	const emailAddress =
		email_addresses?.find((address) => address.id === primary_email_address_id) ??
		email_addresses?.[0];

	if (!emailAddress?.email_address) {
		return res.status(422).json({
			message: "Clerk user has no email address to synchronize",
		});
	}

	const email = emailAddress.email_address;
	await prisma.user.upsert({
		where: { clerkId: id },
		update: {
			email,
			name: [first_name, last_name].filter(Boolean).join(" ") || email,
			image: image_url ?? null,
			emailVerified: emailAddress.verification?.status === "verified",
		},
		create: {
			clerkId: id,
			email,
			name: [first_name, last_name].filter(Boolean).join(" ") || email,
			image: image_url,
			emailVerified: emailAddress.verification?.status === "verified",
		},
	});

	res.status(200).json({ received: true });
};
