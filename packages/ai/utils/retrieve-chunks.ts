import { hydeDocument } from "./hyde-document";
import { queryRewriting } from "./query-rewriting";
import { reciprocalRankFusion } from "./reciprocal-rank-fusion";

export async function retrieveChunks(query: string) {
    const [{ stepBack, rewritten, subQueries }, hyde] = await Promise.all([
        queryRewriting(query),
        hydeDocument(query),
    ]);

    const labelled = [
        { label: "rewrittern", text: rewritten },
        { label: "stepBack", text: stepBack },
        { label: "hyde", text: hyde },
        ...subQueries.map((q, i) => ({ label: `subQuery: ${i + 1}, text: ${q}` })),
    ].filter((text) => typeof text === "string" && text.trim().length > 0);

    const vectors = await embedTexts(labelled.map((q) => q.text));
    const resultsPerQuery = await Promise.all(
        vectors.map((v) => searchByVector(v)),
    );

    const rankedLists = labelled.map((q, i) => ({
        label: q.label,
        hits: resultsPerQuery[i],
    }));

    const fused = reciprocalRankFusion(rankedLists);
    const chunks = fused.slice(0, config.retrieval.finalK);

    return {
        queries: { original: query, rewritten, subQueries, stepBack, hyde },
        chunks,
    };
}