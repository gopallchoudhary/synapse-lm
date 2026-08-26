import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt } from "../retrieve.js";

describe("buildChatSystemPrompt", () => {
	it("includes Today is date and base instruction", () => {
		const prompt = buildChatSystemPrompt({ chunks: [] });
		expect(prompt).toContain("You are Chaibook");
		expect(prompt).toMatch(/Today is \d{4}-\d{2}-\d{2}/);
	});

	it("omits web instructions when disabled", () => {
		const prompt = buildChatSystemPrompt({ chunks: [], webSearchEnabled: false });
		expect(prompt).not.toContain("web_search");
		expect(prompt).not.toContain("[W1]");
	});

	it("adds mandatory web_search instructions when enabled", () => {
		const prompt = buildChatSystemPrompt({ chunks: [], webSearchEnabled: true });
		expect(prompt).toContain("web_search");
		expect(prompt).toContain("MUST");
		expect(prompt).toContain("[W1]");
	});

	it("injects webResults as [Wn] blocks when provided", () => {
		const prompt = buildChatSystemPrompt({
			chunks: [],
			webSearchEnabled: true,
			webResults: [
				{ title: "React 19", url: "https://react.dev", content: "React 19 released" },
				{ title: "Next.js", url: "https://nextjs.org", content: "Next.js 15" },
			],
		});
		expect(prompt).toContain("[W1] React 19 (https://react.dev)");
		expect(prompt).toContain("[W2] Next.js (https://nextjs.org)");
		expect(prompt).toContain("Web search results:");
	});

	it("notes no web results when enabled but empty", () => {
		const prompt = buildChatSystemPrompt({ chunks: [], webSearchEnabled: true, webResults: [] });
		expect(prompt).toContain("returned no results");
	});

	it("renders retrieved chunks with [n] citations", () => {
		const prompt = buildChatSystemPrompt({
			chunks: [
				{
					sourceId: "s1",
					sourceTitle: "Doc A",
					sourceType: "PDF",
					chunkId: "c1",
					chunkIndex: 0,
					text: "chunk text",
					score: 0.9,
				},
			],
		});
		expect(prompt).toContain("[1] Doc A (PDF)");
		expect(prompt).toContain("chunk text");
		expect(prompt).toContain("Retrieved context:");
	});

	it("includes page when present", () => {
		const prompt = buildChatSystemPrompt({
			chunks: [
				{
					sourceId: "s1",
					sourceTitle: "Doc A",
					sourceType: "PDF",
					chunkId: "c1",
					chunkIndex: 0,
					page: 3,
					text: "paged text",
					score: 0.9,
				},
			],
		});
		expect(prompt).toContain("page 3");
	});
});
