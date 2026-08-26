import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@repo/database", () => ({
	prisma: {
		user: { findUnique: vi.fn(), upsert: vi.fn() },
		workspace: {
			findMany: vi.fn(),
			findFirst: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}));

vi.mock("@repo/vector-store", () => ({
	deleteWorkspaceVectors: vi.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@repo/database";
import WorkspaceService from "../workspace/index.js";

const mockedPrisma = vi.mocked(prisma, true);

describe("WorkspaceService identity mapping", () => {
	let service: WorkspaceService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new WorkspaceService();
	});

	it("resolves clerkId to internal id for list", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue({
			id: "db_user_1",
		} as never);
		vi.mocked(mockedPrisma.workspace.findMany).mockResolvedValue([
			{ id: "w1", userId: "db_user_1", title: "Test" },
		] as never);

		const result = await service.getWorkspacesByUserId("clerk_user_1");

		expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
			where: { clerkId: "clerk_user_1" },
			select: { id: true },
		});
		expect(mockedPrisma.workspace.findMany).toHaveBeenCalledWith(
			expect.objectContaining({ where: { userId: "db_user_1" } }),
		);
		expect(result).toHaveLength(1);
	});

	it("throws UnauthorizedError when user not synchronized", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue(null as never);

		await expect(service.getWorkspacesByUserId("unknown_clerk")).rejects.toThrow(
			"User profile is not synchronized",
		);
	});

	it("uses internal id for create", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue({ id: "db_user_2" } as never);
		vi.mocked(mockedPrisma.workspace.create).mockResolvedValue({
			id: "w2",
			userId: "db_user_2",
			title: "New",
		} as never);

		await service.createWorkspaceByUserId("clerk_user_2", { title: "New" });

		expect(mockedPrisma.workspace.create).toHaveBeenCalledWith(
			expect.objectContaining({ data: expect.objectContaining({ userId: "db_user_2" }) }),
		);
	});

	it("rejects cross-user workspace access", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue({ id: "db_user_1" } as never);
		vi.mocked(mockedPrisma.workspace.findFirst).mockResolvedValue(null as never);

		await expect(service.getWorkspaceByIdAndUserId("w_other", "clerk_user_1")).rejects.toThrow(
			"Workspace not found",
		);
	});

	it("delete checks ownership before deleting vectors and row", async () => {
		vi.mocked(mockedPrisma.user.findUnique).mockResolvedValue({ id: "db_user_1" } as never);
		vi.mocked(mockedPrisma.workspace.findFirst).mockResolvedValue({
			id: "w1",
			userId: "db_user_1",
		} as never);
		vi.mocked(mockedPrisma.workspace.delete).mockResolvedValue({} as never);

		await service.deleteWorkspaceById({ workspaceId: "w1" }, "clerk_user_1");

		expect(mockedPrisma.workspace.findFirst).toHaveBeenCalled();
		expect(mockedPrisma.workspace.delete).toHaveBeenCalledWith({ where: { id: "w1" } });
	});
});
