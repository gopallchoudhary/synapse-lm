import { z } from "zod";

export const listMemoriesByUserIdInput = z.object({
    userId: z.string().trim().min(1),
});

export const createMemoryByUserIdInput = z.object({
    memory: z.string().trim().min(1).max(2000),
});

export const updateMemoryByIdAndUserIdInput = z.object({
    userId: z.string().trim().min(1),
    memoryId: z.string().trim().min(1),
    memory: z.string().trim().min(1).max(2000),
});

export const deleteMemoryByIdInput = z.object({
    memoryId: z.string().trim().min(1),
});

export type ListMemoriesByUserIdInputType = z.infer<typeof listMemoriesByUserIdInput>;
export type CreateMemoryByUserIdInputType = z.infer<typeof createMemoryByUserIdInput>;
export type UpdateMemoryByIdAndUserIdInputType = z.infer<typeof updateMemoryByIdAndUserIdInput>;
export type DeleteMemoryByIdInputType = z.infer<typeof deleteMemoryByIdInput>;
