import { MemoryClient } from "mem0ai";

let memoryClientInstance: MemoryClient | null = null;

export function getMemoryClient(): MemoryClient {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey) {
        throw new Error("MEM0_API_KEY is not configured in environment");
    }

    if (!memoryClientInstance) {
        memoryClientInstance = new MemoryClient({ apiKey });
    }

    return memoryClientInstance;
}
