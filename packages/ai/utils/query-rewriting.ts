import { zodResponseFormat } from "openai/helpers/zod";
import { client } from "./get-client";
import { queryRewritingSchema } from "./models";

export async function queryRewriting(query: string) {
	const completion = await client.chat.completions.create({
		model: "gpt-4o-mini",
		temperature: 0.2,
		response_format: zodResponseFormat(queryRewritingSchema, "query_rewriting"),
		messages: [
			{
				role: "system",
				content:
					"You are a query understanding assistant for a retrieval system. " +
					"Given a user's question, produce query variants that help retrieve relevant documents. " +
					"Apply three techniques: (1) step-back prompting -> one broader background question; " +
					"(2) query rewriting -> fix typos/grammar and make the query explicit and self-contained; " +
					"(3) sub-query decomposition -> break the query into exactly 3 focused sub-questions. " +
					"Respond ONLY with the structured JSON.",
			},
			{ role: "user", content: query },
		],
	});

	const rawContent = completion.choices[0]?.message?.content ?? "{}";
	const parsed = queryRewritingSchema.safeParse(JSON.parse(rawContent));

	if (!parsed.success) {
		return {
			stepBack: "",
			rewritten: "",
			subQueries: [],
		};
	}

	return {
		stepBack: parsed.data.stepBack,
		rewritten: parsed.data.rewritten,
		subQueries: parsed.data.subQueries.slice(0, 3),
	};
}