"use client";

import { useCallback, useEffect, useState } from "react";
import {
	ArrowRight,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	RotateCcw,
	RotateCw,
	Shuffle,
	Trophy,
	XCircle,
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

function InteractiveQuiz({
	questions,
}: {
	questions: {
		question: string;
		options: string[];
		correctIndex: number;
		explanation: string;
	}[];
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
	const [showScorecard, setShowScorecard] = useState(false);

	// Sync if incoming questions change
	useEffect(() => {
		setCurrentIndex(0);
		setSelectedAnswers({});
		setShowScorecard(false);
	}, [questions]);

	const total = questions.length;
	const currentQuestion = questions[currentIndex] ?? questions[0];
	const selectedOptionIndex = selectedAnswers[currentIndex];
	const isAnswered = selectedOptionIndex !== undefined;
	const isCorrect =
		isAnswered && currentQuestion
			? selectedOptionIndex === currentQuestion.correctIndex
			: false;

	const score = questions.reduce((acc, q, idx) => {
		return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
	}, 0);
	const answeredCount = Object.keys(selectedAnswers).length;
	const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

	const handleSelect = (index: number) => {
		if (isAnswered) return;
		setSelectedAnswers((prev) => ({
			...prev,
			[currentIndex]: index,
		}));
	};

	const handleNext = () => {
		if (currentIndex < total - 1) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			setShowScorecard(true);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1);
		}
	};

	const handleRetake = () => {
		setSelectedAnswers({});
		setCurrentIndex(0);
		setShowScorecard(false);
	};

	if (total === 0 || !currentQuestion) {
		return <p className="text-sm text-muted-foreground">No questions found in this quiz.</p>;
	}

	if (showScorecard) {
		return (
			<div className="flex flex-col gap-6 py-2">
				{/* Final Scorecard Header */}
				<div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center shadow-xs">
					<div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
						<Trophy className="size-7" />
					</div>

					<h3 className="mt-3 text-lg font-semibold text-foreground">
						{percentage === 100
							? "Perfect Score! 🌟"
							: percentage >= 80
								? "Great Job! 🎉"
								: percentage >= 60
									? "Good Effort! 👍"
									: "Keep Practicing! 📚"}
					</h3>
					<p className="mt-1 text-xs text-muted-foreground">
						You answered {score} out of {total} questions correctly.
					</p>

					<div className="mt-4 flex items-baseline gap-1.5">
						<span className="text-3xl font-bold tracking-tight text-foreground">
							{percentage}%
						</span>
						<span className="text-xs text-muted-foreground">
							({score}/{total})
						</span>
					</div>

					<div className="mt-5 flex items-center gap-2">
						<Button
							className="gap-2 rounded-full px-5 text-xs font-medium"
							onClick={handleRetake}
							size="sm"
							variant="default"
						>
							<RotateCcw className="size-3.5" />
							<span>Retake Quiz</span>
						</Button>
					</div>
				</div>

				{/* Review breakdown of all questions */}
				<div className="flex flex-col gap-3">
					<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Question Review ({total})
					</h4>

					<div className="flex flex-col gap-3">
						{questions.map((q, qIndex) => {
							const userChoice = selectedAnswers[qIndex];
							const isQCorrect = userChoice === q.correctIndex;

							return (
								<div
									className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 text-sm"
									key={`${q.question}-${qIndex}`}
								>
									<div className="flex items-start justify-between gap-2">
										<p className="font-medium text-foreground">
											<span className="mr-1.5 font-semibold text-muted-foreground">
												{qIndex + 1}.
											</span>
											{q.question}
										</p>
										{isQCorrect ? (
											<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
												<CheckCircle2 className="size-3" />
												Correct
											</span>
										) : (
											<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
												<XCircle className="size-3" />
												Incorrect
											</span>
										)}
									</div>

									<div className="grid gap-1.5 pt-1 text-xs">
										{q.options.map((option, optIdx) => {
											const isUserPick = userChoice === optIdx;
											const isActualCorrect = q.correctIndex === optIdx;

											return (
												<div
													className={cn(
														"flex items-center gap-2 rounded-lg border px-3 py-1.5",
														isActualCorrect &&
															"border-emerald-500/50 bg-emerald-500/10 font-medium text-emerald-800 dark:text-emerald-300",
														isUserPick &&
															!isActualCorrect &&
															"border-destructive/40 bg-destructive/10 text-destructive line-through",
														!isUserPick && !isActualCorrect && "border-border/60 bg-muted/20 text-muted-foreground",
													)}
													key={option}
												>
													<span className="font-semibold">
														{String.fromCharCode(65 + optIdx)}.
													</span>
													<span>{option}</span>
													{isActualCorrect && (
														<span className="ml-auto text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
															Correct Answer
														</span>
													)}
													{isUserPick && !isActualCorrect && (
														<span className="ml-auto text-[10px] font-semibold uppercase text-destructive">
															Your Choice
														</span>
													)}
												</div>
											);
										})}
									</div>

									{q.explanation && (
										<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
											<span className="font-medium text-foreground">Explanation: </span>
											{q.explanation}
										</p>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 py-1">
			{/* Header with counter and live score */}
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<div className="flex items-center gap-2 font-medium">
					<span className="font-semibold text-foreground">
						Question {currentIndex + 1}
					</span>
					<span>of {total}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
						Score: {score}/{answeredCount}
					</span>

					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Restart quiz"
									className="size-7 text-muted-foreground hover:text-foreground"
									onClick={handleRetake}
									size="icon-xs"
									variant="ghost"
								>
									<RotateCcw className="size-3.5" />
								</Button>
							}
						/>
						<TooltipContent side="top">Restart quiz</TooltipContent>
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

			{/* Active Question Card */}
			<div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs">
				<div className="flex items-start gap-3">
					<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
						{currentIndex + 1}
					</span>
					<h3 className="text-base font-semibold leading-snug text-foreground">
						{currentQuestion.question}
					</h3>
				</div>

				{/* Option Buttons */}
				<div className="grid gap-2.5 pt-1">
					{currentQuestion.options.map((option, optIdx) => {
						const isSelected = selectedOptionIndex === optIdx;
						const isThisCorrect = currentQuestion.correctIndex === optIdx;

						let stateClasses =
							"border-border/80 bg-card hover:bg-muted/40 hover:border-foreground/40 text-foreground";
						let badgeClasses = "border-border bg-muted/50 text-muted-foreground";

						if (isAnswered) {
							if (isThisCorrect) {
								stateClasses =
									"border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-medium shadow-xs";
								badgeClasses =
									"border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
							} else if (isSelected) {
								stateClasses =
									"border-destructive bg-destructive/10 text-destructive font-medium";
								badgeClasses =
									"border-destructive/30 bg-destructive/20 text-destructive";
							} else {
								stateClasses =
									"border-border/40 bg-muted/20 opacity-50 text-muted-foreground";
								badgeClasses =
									"border-border/40 bg-muted/20 text-muted-foreground";
							}
						}

						return (
							<button
								className={cn(
									"flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all",
									stateClasses,
									!isAnswered && "cursor-pointer active:scale-[0.99]",
									isAnswered && "cursor-default",
								)}
								disabled={isAnswered}
								key={option}
								onClick={() => handleSelect(optIdx)}
								type="button"
							>
								<span
									className={cn(
										"flex size-6 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold",
										badgeClasses,
									)}
								>
									{String.fromCharCode(65 + optIdx)}
								</span>

								<span className="flex-1 leading-relaxed">{option}</span>

								{isAnswered && isThisCorrect && (
									<CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
								)}

								{isAnswered && isSelected && !isThisCorrect && (
									<XCircle className="size-4 shrink-0 text-destructive" />
								)}
							</button>
						);
					})}
				</div>

				{/* Instant Explanation Box (Revealed on Answer) */}
				{isAnswered && (
					<div
						className={cn(
							"mt-1 flex flex-col gap-1.5 rounded-xl border p-3.5 text-xs leading-relaxed",
							isCorrect
								? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200"
								: "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200",
						)}
					>
						<div className="flex items-center gap-1.5 font-semibold">
							<Lightbulb className="size-3.5 shrink-0 text-amber-500" />
							<span>{isCorrect ? "Correct! Well done." : "Not quite right."}</span>
						</div>
						<p className="text-foreground/80">{currentQuestion.explanation}</p>
					</div>
				)}
			</div>

			{/* Navigation Controls */}
			<div className="flex items-center justify-between pt-1">
				<Button
					aria-label="Previous question"
					className="gap-1 rounded-full px-4 text-xs font-medium"
					disabled={currentIndex === 0}
					onClick={handlePrev}
					size="sm"
					variant="outline"
				>
					<ChevronLeft className="size-4" />
					<span>Previous</span>
				</Button>

				<Button
					aria-label={currentIndex === total - 1 ? "Finish quiz" : "Next question"}
					className="gap-1.5 rounded-full px-5 text-xs font-medium shadow-xs"
					disabled={!isAnswered}
					onClick={handleNext}
					size="sm"
					variant={currentIndex === total - 1 ? "default" : "secondary"}
				>
					<span>{currentIndex === total - 1 ? "Finish Quiz" : "Next Question"}</span>
					<ArrowRight className="size-3.5" />
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
		return <InteractiveQuiz questions={data.questions} />;
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