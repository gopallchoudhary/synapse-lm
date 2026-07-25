export function reciprocalRankFusion(rankedLists, k = config.retrieval.rrfK) {
    const fused = new Map();

    for (const { label, hits } of rankedLists) {
        hits.forEach((h, index) => {
            const rank = index + 1; // 1-based
            const contribution = 1 / (k + rank);
            const existing = fused.get(h.id);

            if (existing) {
                existing.rrfScore += contribution;
                existing.bestScore = Math.max(existing.bestScore, h.score);
                existing.matchedBy.push(label);
            } else {
                fused.set(h.id, {
                    id: h.id,
                    text: h.payload?.text ?? "",
                    source: h.payload?.source ?? null,
                    chunkIndex: h.payload?.chunkIndex ?? null,
                    bestScore: h.score, // best raw vector similarity, for reference
                    rrfScore: contribution,
                    matchedBy: [label],
                });
            }
        });
    }

    return [...fused.values()].sort((a, b) => b.rrfScore - a.rrfScore);
}