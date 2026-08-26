import { describe, expect, it } from "vitest";
import { formatTavilyResultsForPrompt } from "../client.js";

describe("formatTavilyResultsForPrompt", () => {
	it("returns no-results message for empty", () => {
		expect(formatTavilyResultsForPrompt({ query: "hello", results: [] })).toBe(
			"No web results were found.",
		);
	});

	it("numbers results as [Wn] with title and url", () => {
		const formatted = formatTavilyResultsForPrompt({
			query: "test",
			results: [
				{ title: "A", url: "https://a.com", content: "alpha" },
				{ title: "B", url: "https://b.com", content: "beta" },
			],
		});
		expect(formatted).toContain("[W1] A (https://a.com)");
		expect(formatted).toContain("[W2] B (https://b.com)");
		expect(formatted).toContain("alpha");
		expect(formatted).toContain("Web search results:");
	});

	it("includes summary when answer present", () => {
		const formatted = formatTavilyResultsForPrompt({
			query: "test",
			answer: "summary text",
			results: [{ title: "A", url: "https://a.com", content: "c" }],
		});
		expect(formatted).toContain("Summary: summary text");
	});

	it("omits summary block when answer absent", () => {
		const formatted = formatTavilyResultsForPrompt({
			query: "test",
			results: [{ title: "A", url: "https://a.com", content: "c" }],
		});
		expect(formatted).not.toContain("Summary:");
	});
});
