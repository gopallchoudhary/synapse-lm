import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: [
			"packages/*/src/**/*.test.ts",
			"packages/trpc/**/*.test.ts",
			"packages/*/src/**/__tests__/**/*.ts",
		],
		environment: "node",
		globals: true,
	},
});
