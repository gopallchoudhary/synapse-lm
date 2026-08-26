import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@repo/database", () => ({
	prisma: {
		user: { findUnique: vi.fn(), upsert: vi.fn() },
	},
}));

import { prisma } from "@repo/database";
import UserService from "../index.js";
import type { ClerkUserProfile } from "../index.js";

const mockedPrisma = vi.mocked(prisma, true);

function profile(overrides: Partial<ClerkUserProfile> = {}): ClerkUserProfile {
	return {
		primaryEmailAddress: { emailAddress: "primary@example.com" },
		emailAddresses: [{ emailAddress: "primary@example.com" }],
		firstName: "Ada",
		lastName: "Lovelace",
		fullName: "Ada Lovelace",
		imageUrl: "https://img.example.com/a.jpg",
		...overrides,
	};
}

describe("UserService.ensureClerkUser", () => {
	let service: UserService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new UserService();
	});

	it("returns existing user without calling Clerk", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue({ id: "db_1" } as never);
		const getProfile = vi.fn();

		const result = await service.ensureClerkUser("clerk_1", getProfile as never);

		expect(result).toEqual({ id: "db_1" });
		expect(getProfile).not.toHaveBeenCalled();
		expect(mockedPrisma.user.upsert).not.toHaveBeenCalled();
	});

	it("upserts from profile when user missing", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue(null as never);
		vi.mocked(mockedPrisma.user.upsert).mockResolvedValue({ id: "db_new" } as never);

		await service.ensureClerkUser("clerk_new", async () => profile());

		expect(mockedPrisma.user.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { clerkId: "clerk_new" },
				create: expect.objectContaining({ email: "primary@example.com" }),
			}),
		);
	});

	it("falls back to first emailAddresses when primary missing", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue(null as never);
		vi.mocked(mockedPrisma.user.upsert).mockResolvedValue({ id: "db_2" } as never);

		await service.ensureClerkUser("clerk_2", async () =>
			profile({ primaryEmailAddress: null, emailAddresses: [{ emailAddress: "fallback@example.com" }] }),
		);

		expect(mockedPrisma.user.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				create: expect.objectContaining({ email: "fallback@example.com" }),
			}),
		);
	});

	it("throws ValidationError when no email available", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue(null as never);

		await expect(
			service.ensureClerkUser("clerk_no_email", async () =>
				profile({ primaryEmailAddress: null, emailAddresses: [] }),
			),
		).rejects.toThrow("must have an email address");
	});

	it("uses fullName, then first+last, then email", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue(null as never);
		const upsert = vi.mocked(mockedPrisma.user.upsert).mockResolvedValue({ id: "x" } as never);

		await service.ensureClerkUser("c1", async () =>
			profile({ fullName: "Grace Hopper", firstName: "Grace", lastName: "Hopper", emailAddresses: [{ emailAddress: "g@example.com" }], primaryEmailAddress: { emailAddress: "g@example.com" } }),
		);
		expect(upsert.mock.calls[0]?.[0].create.name).toBe("Grace Hopper");

		vi.clearAllMocks();
		upsert.mockResolvedValue({ id: "x2" } as never);
		await service.ensureClerkUser("c2", async () =>
			profile({ fullName: null, firstName: "Grace", lastName: "Hopper", emailAddresses: [{ emailAddress: "g@example.com" }], primaryEmailAddress: { emailAddress: "g@example.com" } }),
		);
		expect(upsert.mock.calls[0]?.[0].create.name).toBe("Grace Hopper");

		vi.clearAllMocks();
		upsert.mockResolvedValue({ id: "x3" } as never);
		await service.ensureClerkUser("c3", async () =>
			profile({ fullName: null, firstName: null, lastName: null, emailAddresses: [{ emailAddress: "solo@example.com" }], primaryEmailAddress: { emailAddress: "solo@example.com" } }),
		);
		expect(upsert.mock.calls[0]?.[0].create.name).toBe("solo@example.com");
	});
});
