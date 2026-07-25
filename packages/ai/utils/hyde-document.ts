import { client } from "./get-client";


export async function hydeDocument(query: string) {
    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
            {
                role: "system",
                content:
                    "You are an expert writer. Write a concise, factual passage (3-5 sentences) that directly answers " +
                    "the user's question, as if it were an excerpt from a relevant reference document. " +
                    "Write confidently in a neutral, encyclopedic tone. Do not add disclaimers or say you are unsure.",
            },
            { role: "user", content: query },
        ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? "";
}