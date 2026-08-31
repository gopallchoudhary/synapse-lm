import { prisma } from "@repo/database";
import { UnauthorizedError, ValidationError } from "@repo/errors";

export type ClerkUserProfile = {
	primaryEmailAddress?: { emailAddress: string } | null;
	emailAddresses: { emailAddress: string }[];
	firstName: string | null;
	lastName: string | null;
	fullName: string | null;
	imageUrl: string;
};

class UserService {
	public async ensureClerkUser(
		clerkUserId: string,
		getProfile: () => Promise<ClerkUserProfile>,
	) {
		const existing = await prisma.user.findUnique({
			where: { clerkId: clerkUserId },
			select: { id: true },
		});

		if (existing) return existing;

		const profile = await getProfile();
		const email =
			profile.primaryEmailAddress?.emailAddress ??
			profile.emailAddresses[0]?.emailAddress;

		if (!email) {
			throw new ValidationError(
				"Your Clerk account must have an email address before using Studybook LM.",
			);
		}

		const name = profile.fullName?.trim() ||
			[profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
			email;

		return prisma.user.upsert({
			where: { clerkId: clerkUserId },
			update: {
				name,
				email,
				image: profile.imageUrl || null,
			},
			create: {
				clerkId: clerkUserId,
				name,
				email,
				image: profile.imageUrl || null,
			},
			select: { id: true },
		});
	}
}

export default UserService;
