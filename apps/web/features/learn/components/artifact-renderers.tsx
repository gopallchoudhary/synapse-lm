"use client";

type TakeawaysContent = { items: string[] };
type FlashcardsContent = { cards: { front: string; back: string }[] };
type QuizContent = {
	questions: {
		question: string;
		options: string[];
		correctIndex: number;
		explanation: string;
	}[];
};
type MindmapContent = {
	nodes: { id: string; label: string }[];
	edges: { id: string; source: string; target: string }[];
};
type ReportContent = {
	markdown: string;
	sections: { title: string; content: string }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function Prose({ children }: { children: string }) {
	return (
		<div className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground/90">
			{children}
		</div>
	);
}

export function ArtifactRenderer({
	type,
	content,
}: {
	type: string;
	content: unknown;
}) {
	if (!content || !isRecord(content)) {
		return <p className="text-sm text-muted-foreground">No content yet.</p>;
	}

	if (type === "SUMMARY" && typeof content.markdown === "string") {
		return <Prose>{content.markdown as string}</Prose>;
	}

	if (type === "TAKEAWAYS" && Array.isArray((content as TakeawaysContent).items)) {
		const data = content as TakeawaysContent;
		return (
			<ul className="grid gap-2">
				{data.items.map((item, index) => (
					<li
						className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm leading-6"
						key={`${item}-${index}`}
					>
						{item}
					</li>
				))}
			</ul>
		);
	}

	if (type === "FLASHCARDS" && Array.isArray((content as FlashcardsContent).cards)) {
		const data = content as FlashcardsContent;
		return (
			<div className="grid gap-3 sm:grid-cols-2">
				{data.cards.map((card, index) => (
					<div
						className="rounded-xl border border-border bg-card p-4"
						key={`${card.front}-${index}`}
					>
						<p className="text-sm font-medium">{card.front}</p>
						<p className="mt-2 text-sm text-muted-foreground">{card.back}</p>
					</div>
				))}
			</div>
		);
	}

	if (type === "QUIZ" && Array.isArray((content as QuizContent).questions)) {
		const data = content as QuizContent;
		return (
			<div className="grid gap-4">
				{data.questions.map((question, index) => (
					<div className="rounded-xl border border-border p-4" key={`${question.question}-${index}`}>
						<p className="text-sm font-medium">
							{index + 1}. {question.question}
						</p>
						<ul className="mt-3 grid gap-2">
							{question.options.map((option, optionIndex) => (
								<li
									className={`rounded-lg border px-3 py-2 text-sm ${
										optionIndex === question.correctIndex
											? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
											: "border-border bg-muted/30"
									}`}
									key={option}
								>
									{option}
								</li>
							))}
						</ul>
						<p className="mt-3 text-xs leading-5 text-muted-foreground">
							{question.explanation}
						</p>
					</div>
				))}
			</div>
		);
	}

	if (
		type === "MINDMAP" &&
		Array.isArray((content as MindmapContent).nodes) &&
		Array.isArray((content as MindmapContent).edges)
	) {
		const data = content as MindmapContent;
		return (
			<div className="grid gap-4">
				<div className="flex flex-wrap gap-2">
					{data.nodes.map((node) => (
						<span
							className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium"
							key={node.id}
						>
							{node.label}
						</span>
					))}
				</div>
				<ul className="grid gap-1.5 text-xs text-muted-foreground">
					{data.edges.map((edge) => (
						<li key={edge.id}>
							{edge.source} → {edge.target}
						</li>
					))}
				</ul>
			</div>
		);
	}

	if (type === "REPORT" && typeof (content as ReportContent).markdown === "string") {
		const data = content as ReportContent;
		return (
			<div className="grid gap-6">
				<Prose>{data.markdown}</Prose>
				{data.sections?.length ? (
					<div className="grid gap-4">
						{data.sections.map((section, index) => (
							<div className="rounded-xl border border-border p-4" key={`${section.title}-${index}`}>
								<p className="text-sm font-semibold">{section.title}</p>
								<p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
									{section.content}
								</p>
							</div>
						))}
					</div>
				) : null}
			</div>
		);
	}

	return (
		<pre className="overflow-auto rounded-xl bg-muted p-4 text-xs">
			{JSON.stringify(content, null, 2)}
		</pre>
	);
}