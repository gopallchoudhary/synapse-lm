import { describe, expect, it } from "vitest";
import { chunkPages, chunkText } from "../chunking/splitter.js";

describe("chunkText", () => {
	it("splits long text into numbered chunks", () => {
		const text = Array.from({ length: 5 }, (_, i) => `Paragraph ${i}. `.repeat(30)).join("\n\n");
		const chunks = chunkText(text, { chunkSize: 500, chunkOverlap: 50 });
		expect(chunks.length).toBeGreaterThan(1);
		chunks.forEach((chunk, index) => {
			expect(chunk.index).toBe(index);
			expect(chunk.content.trim().length).toBeGreaterThan(0);
		});
	});

	it("respects word boundaries when possible", () => {
		const text = "Hello world. This is a test. Another sentence here.";
		const chunks = chunkText(text, { chunkSize: 20, chunkOverlap: 0 });
		expect(chunks.length).toBeGreaterThan(0);
		expect(chunks[0]?.content).toContain("Hello");
	});

	it("skips empty input", () => {
		expect(chunkText("   ")).toHaveLength(0);
		expect(chunkText("")).toHaveLength(0);
	});

	it("attaches shared metadata", () => {
		const chunks = chunkText("hello world hello world", {
			chunkSize: 10,
			metadata: { sourceId: "abc" },
		});
		chunks.forEach((chunk) => {
			expect(chunk.metadata).toEqual({ sourceId: "abc" });
		});
	});

	it("uses character slicing fallback with overlap", () => {
		const text = "a".repeat(2500);
		const chunks = chunkText(text, { chunkSize: 1000, chunkOverlap: 100 });
		expect(chunks.length).toBeGreaterThan(1);
		expect(chunks[0]?.content.length).toBe(1000);
	});
});

describe("chunkPages", () => {
	it("preserves page numbers in metadata", () => {
		const pages = ["First page content. ".repeat(10), "Second page content. ".repeat(10)];
		const chunks = chunkPages(pages, { chunkSize: 200 });
		chunks.forEach((chunk) => {
			expect(chunk.metadata).toBeDefined();
			expect([1, 2]).toContain((chunk.metadata as { page: number }).page);
		});
	});

	it("skips empty pages and numbers globally", () => {
		const pages = ["   ", "Real content here. ".repeat(5), ""];
		const chunks = chunkPages(pages, { chunkSize: 200 });
		expect(chunks.length).toBeGreaterThan(0);
		chunks.forEach((chunk, index) => {
			expect(chunk.index).toBe(index);
		});
	});

	it("returns empty for all-whitespace pages", () => {
		expect(chunkPages(["   ", "\n\n"])).toHaveLength(0);
	});
});
