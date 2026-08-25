import {
	addUserMemory,
	deleteUserMemory,
	listUserMemories,
	updateUserMemory,
} from "@repo/memory";
import { NotFoundError } from "@repo/errors";
import {
	createMemoryByUserIdInput,
	CreateMemoryByUserIdInputType,
	listMemoriesByUserIdInput,
	ListMemoriesByUserIdInputType,
	UpdateMemoryByIdAndUserIdInputType,
	updateMemoryByIdAndUserIdInput,
	DeleteMemoryByIdInputType,
	deleteMemoryByIdInput,
} from "./model.js";

class MemoryService {
	public async listMemoriesByUserId(userId: string, payload: ListMemoriesByUserIdInputType = {}) {
		listMemoriesByUserIdInput.parse(payload);
		return await listUserMemories(userId);
	}

	//, create memory for user
	private async createMemoryForUser(userId: string, input: { memory: string }) {
		return addUserMemory(userId, {
			memory: input.memory,
			infer: false,
			metadata: { source: "manual" },
		});
	}

	public async createMemoryByUserId(
		userId: string,
		payload: CreateMemoryByUserIdInputType,
	) {
		const input = createMemoryByUserIdInput.parse(payload);
		const memory = await this.createMemoryForUser(userId, input);
		return memory;
	}

	//, update memory for user
	private async updateMemoryForUser(
		userId: string,
		memoryId: string,
		input: { memory: string },
	) {
		await this.assertMemoryOwnership(userId, memoryId);
		return updateUserMemory(memoryId, input);
	}

	private async assertMemoryOwnership(userId: string, memoryId: string) {
		const memories = await listUserMemories(userId);
		if (!memories.some((memory) => memory.id === memoryId)) {
			throw new NotFoundError("Memory not found");
		}
	}

	public async updateMemoryByIdAndUserId(
		userId: string,
		payload: UpdateMemoryByIdAndUserIdInputType,
	) {
		const { memoryId, memory } = updateMemoryByIdAndUserIdInput.parse(payload);
		const updatedMemory = await this.updateMemoryForUser(userId, memoryId, {
			memory,
		});

		return updatedMemory;
	}

	public async deleteMemoryById(
		userId: string,
		payload: DeleteMemoryByIdInputType,
	) {
		const { memoryId } = deleteMemoryByIdInput.parse(payload);
		await this.assertMemoryOwnership(userId, memoryId);
		await deleteUserMemory(memoryId);
	}
}

export default MemoryService;
