export interface TRPCContext {
	userId: string | null;
	clerk: {
		users: {
			getUser(userId: string): Promise<ClerkUser>;
		};
	};
}

export interface ClerkUser {
	primaryEmailAddress?: {
		emailAddress: string;
	} | null;

	emailAddresses: Array<{
		emailAddress: string;
	}>;

	firstName: string | null;
	lastName: string | null;
	fullName: string | null;
	imageUrl: string;
}
