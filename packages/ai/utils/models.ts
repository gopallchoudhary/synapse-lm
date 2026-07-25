// Zod schema definitions for AI utils
import { z } from "zod";

export const queryRewritingSchema = z.object({
	stepBack: z
		.string()
		.describe(
			"A broader higher-level 'step back' question whose answer gives useful background for the original query",
		),
	rewritten: z
		.string()
		.describe(
			"The original query with spelling/grammar fixed and made clear and self-contained. Preserve the original intent",
		),
	subQueries: z
		.array(z.string())
		.describe(
			"Exactly 3 focused sub-questions the original query can be decomposed into.",
		),
});

export type QueryRewritingOutput = z.infer<typeof queryRewritingSchema>;