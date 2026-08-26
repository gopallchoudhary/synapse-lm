"use client";

import {
	BookOpen,
	FileText,
	HelpCircle,
	Layers,
	Network,
	PanelRightClose,
	PanelRightOpen,
	Plus,
	Sparkles,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { useSources } from "~/features/sources/hooks/use-sources";
import {
	useArtifacts,
	useCreateArtifact,
	useDeleteArtifact,
} from "~/features/learn/hooks/use-artifacts";
import { ArtifactRenderer } from "./artifact-renderers";

const artifactTypes = [
	{
		value: "SUMMARY",
		label: "Summary",
		icon: FileText,
		colorClass: "text-sky-600 dark:text-sky-400",
		badgeBg: "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400",
	},
	{
		value: "TAKEAWAYS",
		label: "Takeaways",
		icon: Layers,
		colorClass: "text-emerald-600 dark:text-emerald-400",
		badgeBg:
			"bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
	},
	{
		value: "FLASHCARDS",
		label: "Flashcards",
		icon: BookOpen,
		colorClass: "text-amber-600 dark:text-amber-400",
		badgeBg:
			"bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
	},
	{
		value: "QUIZ",
		label: "Quiz",
		icon: HelpCircle,
		colorClass: "text-violet-600 dark:text-violet-400",
		badgeBg:
			"bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400",
	},
	{
		value: "MINDMAP",
		label: "Mind map",
		icon: Network,
		colorClass: "text-pink-600 dark:text-pink-400",
		badgeBg:
			"bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400",
	},
	{
		value: "REPORT",
		label: "Report",
		icon: Sparkles,
		colorClass: "text-indigo-600 dark:text-indigo-400",
		badgeBg:
			"bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
	},
] as const;

type ArtifactType = (typeof artifactTypes)[number]["value"];

const statusLabel: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	READY: { label: "Ready", variant: "secondary" },
	PROCESSING: { label: "Processing", variant: "outline" },
	PENDING: { label: "Queued", variant: "outline" },
	FAILED: { label: "Failed", variant: "destructive" },
};

function CreateArtifactDialog({
	workspaceId,
	initialType = "SUMMARY",
	trigger,
}: {
	workspaceId: string;
	initialType?: ArtifactType;
	trigger?: React.ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState<ArtifactType>(initialType);
	const [title, setTitle] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const sourcesQuery = useSources(workspaceId);
	const createArtifact = useCreateArtifact(workspaceId);

	useEffect(() => {
		if (open) {
			setType(initialType);
		}
	}, [open, initialType]);

	const readySources = useMemo(() => {
		return (sourcesQuery.data ?? []).filter(
			(source) => source.status === "READY",
		);
	}, [sourcesQuery.data]);

	function toggleSource(id: string) {
		setSelectedIds((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		);
	}

	function toggleAll() {
		setSelectedIds((current) =>
			current.length === readySources.length
				? []
				: readySources.map((source) => source.id),
		);
	}

	function close() {
		setOpen(false);
		setTitle("");
		setSelectedIds([]);
		setType(initialType);
	}

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (selectedIds.length === 0) return;

		createArtifact.mutate(
			{
				workspaceId,
				type,
				title: title.trim() || undefined,
				sourceIds: selectedIds,
			},
			{ onSuccess: close },
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					trigger 
				}
			/>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create learning artifact</DialogTitle>
					<DialogDescription>
						Choose an artifact type and the ready sources to learn from. You
						must select at least one source.
					</DialogDescription>
				</DialogHeader>

				<form className="grid gap-4" onSubmit={submit}>
					<div className="grid gap-2">
						<p className="text-sm font-medium">Type</p>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
							{artifactTypes.map((item) => {
								const Icon = item.icon;
								const selected = type === item.value;
								return (
									<button
										className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
											selected
												? "border-foreground bg-foreground text-background"
												: "border-border bg-background hover:bg-muted"
										}`}
										key={item.value}
										onClick={() => setType(item.value)}
										type="button"
									>
										<Icon className="size-4" />
										{item.label}
									</button>
								);
							})}
						</div>
					</div>

					<label className="grid gap-2 text-sm font-medium">
						Title{" "}
						<span className="font-normal text-muted-foreground">
							(optional)
						</span>
						<Input
							maxLength={120}
							placeholder="e.g. Chapter 1 summary"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
						/>
					</label>

					<div className="grid gap-2">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">Sources</p>
							<Button
								disabled={readySources.length === 0}
								onClick={toggleAll}
								size="sm"
								type="button"
								variant="ghost"
							>
								{selectedIds.length === readySources.length
									? "Clear all"
									: "Select all"}
							</Button>
						</div>

						{sourcesQuery.isPending ? (
							<div className="space-y-2">
								{[0, 1].map((item) => (
									<div
										key={item}
										className="h-12 animate-pulse rounded-xl bg-muted"
									/>
								))}
							</div>
						) : readySources.length === 0 ? (
							<div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
								No ready sources yet. Add and process at least one source to
								create artifacts.
							</div>
						) : (
							<div className="max-h-48 space-y-2 overflow-auto pr-1">
								{readySources.map((source) => (
									<label
										className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
											selectedIds.includes(source.id)
												? "border-foreground bg-muted"
												: "border-border bg-background hover:bg-muted/40"
										}`}
										key={source.id}
									>
										<input
											checked={selectedIds.includes(source.id)}
											className="mt-0.5 size-4 rounded border-input"
											onChange={() => toggleSource(source.id)}
											type="checkbox"
										/>
										<span className="min-w-0">
											<span className="block truncate font-medium">
												{source.title}
											</span>
											<span className="block truncate text-xs text-muted-foreground">
												{source.type} · {source.id.slice(0, 6)}
											</span>
										</span>
									</label>
								))}
							</div>
						)}

						{selectedIds.length === 0 && readySources.length > 0 && (
							<p className="text-xs text-destructive">
								Select at least one source.
							</p>
						)}
					</div>

					{createArtifact.error && (
						<p className="text-sm text-destructive" role="alert">
							{createArtifact.error.message}
						</p>
					)}

					<DialogFooter>
						<Button
							disabled={createArtifact.isPending || selectedIds.length === 0}
							type="submit"
						>
							{createArtifact.isPending ? "Creating..." : "Create artifact"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export interface StudioPanelProps {
	workspaceId: string;
	isCollapsed?: boolean;
	onToggleCollapse?: () => void;
	onExpand?: () => void;
	selectedArtifactId?: string | null;
	onSelectArtifact?: (id: string | null) => void;
}

export function StudioPanel({
	workspaceId,
	isCollapsed = false,
	onToggleCollapse,
	onExpand,
	selectedArtifactId,
	onSelectArtifact,
}: StudioPanelProps) {
	const artifactsQuery = useArtifacts(workspaceId);
	const deleteArtifact = useDeleteArtifact(workspaceId);
	const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
		null,
	);

	const artifacts = artifactsQuery.data ?? [];
	const effectiveSelectedId = selectedArtifactId ?? internalSelectedId;
	const selected =
		artifacts.find((artifact) => artifact.id === effectiveSelectedId) ??
		artifacts[0] ??
		null;

	const hasPending = artifacts.some(
		(artifact) =>
			artifact.status === "PENDING" || artifact.status === "PROCESSING",
	);

	function selectArtifact(id: string) {
		setInternalSelectedId(id);
		onSelectArtifact?.(id);
	}

	if (isCollapsed) {
		return (
			<div className="flex h-full min-h-0 flex-col items-center justify-between py-1">
				<div className="flex w-full flex-col items-center gap-1.5">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Expand studio"
									className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
									onClick={onToggleCollapse}
									size="icon-sm"
									variant="ghost"
								>
									<PanelRightOpen className="size-4" />
								</Button>
							}
						/>
						<TooltipContent side="left">Expand studio</TooltipContent>
					</Tooltip>

					<div className="flex flex-col items-center gap-1.5 pt-1">
						{artifactTypes.map((item) => {
							const Icon = item.icon;
							return (
								<CreateArtifactDialog
									key={item.value}
									workspaceId={workspaceId}
									initialType={item.value}
									trigger={
										<Tooltip>
											<TooltipTrigger
												render={
													<button
														aria-label={`Create ${item.label}`}
														className={`group relative flex size-8 shrink-0 items-center justify-center rounded-xl border transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${item.badgeBg}`}
														type="button"
													>
														<Icon className="size-3.5" />
														<span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold leading-none text-muted-foreground">
															+
														</span>
													</button>
												}
											/>
											<TooltipContent side="left">
												Create {item.label}
											</TooltipContent>
										</Tooltip>
									}
								/>
							);
						})}
					</div>

					<div className="my-1.5 h-px w-6 bg-border" />

					<div className="flex w-full min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden pr-0.5">
						{artifacts.map((artifact) => {
							const meta =
								artifactTypes.find((item) => item.value === artifact.type) ??
								artifactTypes[0];
							const Icon = meta.icon;
							const status =
								statusLabel[artifact.status] ?? statusLabel.PENDING;
							const isSelected = selected?.id === artifact.id;

							return (
								<Tooltip key={artifact.id}>
									<TooltipTrigger
										render={
											<button
												aria-label={artifact.title}
												className={`group relative flex size-9 shrink-0 items-center justify-center rounded-xl border transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
													meta.badgeBg
												} ${isSelected ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
												onClick={() => {
													selectArtifact(artifact.id);
													onExpand?.();
												}}
												type="button"
											>
												<Icon className="size-4" />
												<span
													className={`absolute -right-0.5 -top-0.5 size-2 rounded-full border border-background ${
														artifact.status === "READY"
															? "bg-emerald-500"
															: artifact.status === "FAILED"
																? "bg-destructive"
																: "bg-amber-500 animate-pulse"
													}`}
												/>
											</button>
										}
									/>
									<TooltipContent
										className="flex max-w-xs flex-col gap-0.5 px-2.5 py-1.5"
										side="left"
									>
										<span className="max-w-[200px] truncate text-xs font-medium">
											{artifact.title}
										</span>
										<span className="text-[10px] text-muted-foreground">
											{meta.label} · {status?.label ?? artifact.status}
										</span>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col items-center gap-1.5 pt-2">
					<CreateArtifactDialog
						workspaceId={workspaceId}
						trigger={
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											aria-label="New artifact"
											className="size-9 rounded-xl border border-dashed border-border bg-background text-muted-foreground shadow-xs hover:border-foreground/50 hover:bg-muted hover:text-foreground"
											size="icon-sm"
											variant="outline"
										>
											<Plus className="size-4" />
										</Button>
									}
								/>
								<TooltipContent side="left">New artifact</TooltipContent>
							</Tooltip>
						}
					/>
					{artifacts.length > 0 && (
						<span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
							{artifacts.length}
						</span>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between gap-2 border-b border-border pb-3">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">Studio</span>
					<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
						{artifacts.length} artifacts
					</span>
					{hasPending && (
						<span
							className="size-2 animate-pulse rounded-full bg-amber-500"
							aria-hidden
						/>
					)}
				</div>
				<div className="flex items-center gap-1">
					<CreateArtifactDialog workspaceId={workspaceId} />
					{onToggleCollapse && (
						<Tooltip>
							<TooltipTrigger
								render={
									<Button
										aria-label="Collapse studio"
										className="text-muted-foreground hover:text-foreground"
										onClick={onToggleCollapse}
										size="icon-sm"
										variant="ghost"
									>
										<PanelRightClose className="size-4" />
									</Button>
								}
							/>
							<TooltipContent side="left">Collapse panel</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 border-b border-border py-3 sm:grid-cols-3">
				{artifactTypes.map((item) => {
					const Icon = item.icon;
					return (
						<CreateArtifactDialog
							key={item.value}
							workspaceId={workspaceId}
							initialType={item.value}
							trigger={
								<button
									className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-all hover:scale-[1.02] hover:bg-muted/50 ${item.badgeBg}`}
									type="button"
								>
									<div className="flex w-full items-center justify-between">
										<Icon className="size-4" />
										<Plus className="size-3 text-muted-foreground opacity-70" />
									</div>
									<span className="text-xs font-medium leading-tight text-foreground">
										{item.label}
									</span>
								</button>
							}
						/>
					);
				})}
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto pr-1 pt-3">
				{artifactsQuery.isPending ? (
					<div className="space-y-2">
						{[0, 1, 2].map((item) => (
							<div
								key={item}
								className="h-16 animate-pulse rounded-xl bg-muted"
							/>
						))}
					</div>
				) : artifactsQuery.error ? (
					<div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
						Unable to load artifacts: {artifactsQuery.error.message}
					</div>
				) : artifacts.length === 0 ? (
					<div className="grid place-items-center rounded-xl border border-dashed border-border p-8 text-center">
						<p className="text-sm font-medium">No learning artifacts yet</p>
						<p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
							Create a summary, flashcards, quiz, or mind map from your ready
							sources above.
						</p>
					</div>
				) : (
					<div className="grid gap-3">
						<ul className="grid gap-2">
							{artifacts.map((artifact) => {
								const meta =
									artifactTypes.find((item) => item.value === artifact.type) ??
									artifactTypes[0];
								const Icon = meta.icon;
								const status =
									statusLabel[artifact.status] ?? statusLabel.PENDING;
								const active = selected?.id === artifact.id;
								return (
									<li key={artifact.id}>
										<button
											className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
												active
													? "border-foreground bg-foreground text-background"
													: "border-border bg-background hover:bg-muted/40"
											}`}
											onClick={() => selectArtifact(artifact.id)}
											type="button"
										>
											<div className="flex min-w-0 items-start gap-2.5">
												<span
													className={`grid size-8 shrink-0 place-items-center rounded-lg border ${
														active
															? "border-background/30 bg-background/20 text-background"
															: meta.badgeBg
													}`}
												>
													<Icon className="size-3.5" />
												</span>
												<span className="min-w-0">
													<span className="block truncate text-sm font-medium">
														{artifact.title}
													</span>
													<span
														className={`mt-0.5 inline-flex items-center gap-1 text-xs ${
															active
																? "text-background/70"
																: "text-muted-foreground"
														}`}
													>
														{meta.label} ·{" "}
														{new Date(
															String(artifact.createdAt),
														).toLocaleDateString()}
													</span>
												</span>
											</div>
											<span className="flex shrink-0 items-center gap-2">
												<Badge
													variant={
														active
															? "secondary"
															: (status?.variant ?? "outline")
													}
												>
													{status?.label ?? artifact.status}
												</Badge>
												<span
													className={`grid size-7 place-items-center rounded-lg border ${
														active
															? "border-background/20 bg-background/10 hover:bg-background/20"
															: "border-border bg-background hover:bg-muted"
													}`}
													onClick={(event) => {
														event.stopPropagation();
														if (window.confirm(`Delete "${artifact.title}"?`)) {
															deleteArtifact.mutate({
																workspaceId,
																artifactId: artifact.id,
															});
														}
													}}
													role="button"
													tabIndex={0}
													onKeyDown={(event) => {
														if (event.key === "Enter" || event.key === " ") {
															event.preventDefault();
															event.stopPropagation();
															if (
																window.confirm(`Delete "${artifact.title}"?`)
															) {
																deleteArtifact.mutate({
																	workspaceId,
																	artifactId: artifact.id,
																});
															}
														}
													}}
												>
													<Trash2 className="size-3.5" />
												</span>
											</span>
										</button>
									</li>
								);
							})}
						</ul>

						{selected && (
							<div className="rounded-xl border border-border bg-background p-4">
								<div className="flex items-center justify-between gap-2">
									<h3 className="text-sm font-semibold">{selected.title}</h3>
									<Badge
										variant={statusLabel[selected.status]?.variant ?? "outline"}
									>
										{statusLabel[selected.status]?.label ?? selected.status}
									</Badge>
								</div>

								{selected.status === "PENDING" ||
								selected.status === "PROCESSING" ? (
									<p className="mt-3 text-sm text-muted-foreground">
										Generating — this updates automatically. Keep Inngest
										running.
									</p>
								) : selected.status === "FAILED" ? (
									<p className="mt-3 text-sm text-destructive">
										{(selected.metadata as { processingError?: string } | null)
											?.processingError ?? "Generation failed. Try again."}
									</p>
								) : (
									<div className="mt-4">
										<ArtifactRenderer
											type={selected.type}
											content={selected.content}
										/>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
