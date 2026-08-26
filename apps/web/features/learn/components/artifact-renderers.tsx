"use client";

import { useCallback, useEffect, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	RotateCw,
	Shuffle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

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

function FlashcardsCarousel({
	cards,
}: {
	cards: { front: string; back: string }[];
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [studyCards, setStudyCards] = useState(cards);

	// Sync if incoming cards change
	useEffect(() => {
		setStudyCards(cards);
		setCurrentIndex(0);
		setIsFlipped(false);
	}, [cards]);

	const total = studyCards.length;
	const currentCard = studyCards[currentIndex] ?? studyCards[0];

	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => {
			if (prev < total - 1) {
				setIsFlipped(false);
				return prev + 1;
			}
			return prev;
		});
	}, [total]);

	const handlePrev = useCallback(() => {
		setCurrentIndex((prev) => {
			if (prev > 0) {
				setIsFlipped(false);
				return prev - 1;
			}
			return prev;
		});
	}, []);

	const handleFlip = useCallback(() => {
		setIsFlipped((prev) => !prev);
	}, []);

	const handleRestart = () => {
		setIsFlipped(false);
		setCurrentIndex(0);
	};

	const handleShuffle = () => {
		setIsFlipped(false);
		setCurrentIndex(0);
		setStudyCards((prev) => [...prev].sort(() => Math.random() - 0.5));
	};

	// Keyboard controls: Left/Right arrows for Prev/Next, Spacebar/Enter to Flip
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
			) {
				return;
			}
			if (event.key === "ArrowRight") {
				event.preventDefault();
				handleNext();
			} else if (event.key === "ArrowLeft") {
				event.preventDefault();
				handlePrev();
			} else if (event.key === " " || event.key === "Enter") {
				event.preventDefault();
				handleFlip();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleNext, handlePrev, handleFlip]);

	if (!currentCard || total === 0) {
		return <p className="text-sm text-muted-foreground">No flashcards found.</p>;
	}

	return (
		<div className="flex flex-col gap-4 py-1">
			{/* Study bar & Counter */}
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<div className="flex items-center gap-1.5 font-medium">
					<span className="font-semibold text-foreground">
						Card {currentIndex + 1}
					</span>
					<span>of {total}</span>
				</div>

				<div className="flex items-center gap-1">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Shuffle flashcards"
									className="size-7 text-muted-foreground hover:text-foreground"
									onClick={handleShuffle}
									size="icon-xs"
									variant="ghost"
								>
									<Shuffle className="size-3.5" />
								</Button>
							}
						/>
						<TooltipContent side="top">Shuffle order</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Restart from card 1"
									className="size-7 text-muted-foreground hover:text-foreground"
									onClick={handleRestart}
									size="icon-xs"
									variant="ghost"
								>
									<RotateCcw className="size-3.5" />
								</Button>
							}
						/>
						<TooltipContent side="top">Restart from beginning</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{/* Progress track */}
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-foreground transition-all duration-300 ease-out"
					style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
				/>
			</div>

			{/* 3D Flip Card */}
			<div
				aria-label={`Flashcard ${currentIndex + 1} of ${total}. Click to flip.`}
				className="group relative h-64 w-full cursor-pointer select-none [perspective:1000px] sm:h-72"
				onClick={handleFlip}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						handleFlip();
					}
				}}
				role="button"
				tabIndex={0}
			>
				<div
					className={cn(
						"relative h-full w-full rounded-2xl border transition-all duration-500 [transform-style:preserve-3d] shadow-2xs hover:shadow-sm",
						isFlipped
							? "border-emerald-500/40 bg-card [transform:rotateY(180deg)]"
							: "border-border bg-card",
					)}
				>
					{/* Front: Question */}
					<div className="absolute inset-0 flex flex-col justify-between p-6 [backface-visibility:hidden]">
						<div className="flex items-center justify-between">
							<span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
								Question
							</span>
							<span className="text-[11px] text-muted-foreground/80">
								Click or Space to flip
							</span>
						</div>

						<div className="my-auto flex max-h-40 items-center justify-center overflow-y-auto px-4 text-center">
							<p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
								{currentCard.front}
							</p>
						</div>

						<div className="flex items-center justify-center text-center">
							<span className="text-xs text-muted-foreground/60">
								{currentIndex + 1} / {total}
							</span>
						</div>
					</div>

					{/* Back: Answer */}
					<div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-muted/30 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-muted/15">
						<div className="flex items-center justify-between">
							<span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
								Answer
							</span>
							<span className="text-[11px] text-muted-foreground/80">
								Click or Space to return
							</span>
						</div>

						<div className="my-auto flex max-h-40 items-center justify-center overflow-y-auto px-4 text-center">
							<p className="text-sm font-normal leading-relaxed text-foreground/90 sm:text-base">
								{currentCard.back}
							</p>
						</div>

						<div className="flex items-center justify-center text-center">
							<span className="text-xs text-muted-foreground/60">
								{currentIndex + 1} / {total}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Three Action Buttons: Prev, Flip, Next */}
			<div className="flex items-center justify-center gap-3 pt-1">
				<Button
					aria-label="Previous card"
					className="gap-1 rounded-full px-4 text-xs font-medium"
					disabled={currentIndex === 0}
					onClick={(event) => {
						event.stopPropagation();
						handlePrev();
					}}
					size="sm"
					variant="outline"
				>
					<ChevronLeft className="size-4" />
					<span>Prev</span>
				</Button>

				<Button
					aria-label="Flip card"
					className="gap-1.5 rounded-full px-5 text-xs font-medium shadow-2xs hover:bg-muted"
					onClick={(event) => {
						event.stopPropagation();
						handleFlip();
					}}
					size="sm"
					variant="secondary"
				>
					<RotateCw
						className={cn(
							"size-3.5 transition-transform duration-300",
							isFlipped && "rotate-180",
						)}
					/>
					<span>Flip</span>
				</Button>

				<Button
					aria-label="Next card"
					className="gap-1 rounded-full px-4 text-xs font-medium"
					disabled={currentIndex === total - 1}
					onClick={(event) => {
						event.stopPropagation();
						handleNext();
					}}
					size="sm"
					variant="outline"
				>
					<span>Next</span>
					<ChevronRight className="size-4" />
				</Button>
			</div>
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
		return <FlashcardsCarousel cards={data.cards} />;
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