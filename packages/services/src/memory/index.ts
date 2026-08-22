import {
	addUserMemory,
	deleteUserMemory,
	listUserMemories,
	updateUserMemory,
} from "@repo/memory";
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
	public async listMemoriesByUserId(payload: ListMemoriesByUserIdInputType) {
		const { userId } = listMemoriesByUserIdInput.parse(payload);
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
		_userId: string,
		memoryId: string,
		input: { memory: string },
	) {
		return updateUserMemory(memoryId, input);
	}

	public async updateMemoryByIdAndUserId(
		payload: UpdateMemoryByIdAndUserIdInputType,
	) {
		const { userId, memoryId, memory } =
			updateMemoryByIdAndUserIdInput.parse(payload);
		const updatedMemory = await this.updateMemoryForUser(userId, memoryId, {
			memory,
		});

		return updatedMemory;
	}

	public async deleteMemoryById(payload: DeleteMemoryByIdInputType) {
		const { memoryId } = deleteMemoryByIdInput.parse(payload);
		await deleteUserMemory(memoryId);
	}
}

export default MemoryService;
