import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

interface ExtendedRequest extends Request {
	userId: string;
}

export default function requireAuth(
	req: ExtendedRequest,
	res: Response,
	next: NextFunction,
) {
	const { userId } = getAuth(req);
	if (!userId) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}
	req.userId = userId;
	next();
}
