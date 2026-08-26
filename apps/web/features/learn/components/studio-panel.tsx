"use client";

import {
	BookOpen,
	FileText,
	HelpCircle,
	Layers,
	Network,
	Plus,
	Sparkles,
	Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
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
import { useSources } from "~/features/sources/hooks/use-sources";
import {
	useArtifacts,
	useCreateArtifact,
	useDeleteArtifact,
} from "~/features/learn/hooks/use-artifacts";
import { ArtifactRenderer } from "./artifact-renderers";

const artifactTypes = [
	{ value: "SUMMARY", label: "Summary", icon: FileText },
	{ value: "TAKEAWAYS", label: "Takeaways", icon: Layers },
	{ value: "FLASHCARDS", label: "Flashcards", icon: BookOpen },
	{ value: "QUIZ", label: "Quiz", icon: HelpCircle },
	{ value: "MINDMAP", label: "Mind map", icon: Network },
	{ value: "REPORT", label: "Report", icon: Sparkles },
] as const;

type ArtifactType = (typeof artifactTypes)[number]["value"];

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	READY: { label: "Ready", variant: "secondary" },
	PROCESSING: { label: "Processing", variant: "outline" },
	PENDING: { label: "Queued", variant: "outline" },
	FAILED: { label: "Failed", variant: "destructive" },
};

function CreateArtifactDialog({ workspaceId }: { workspaceId: string }) {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState<ArtifactType>("SUMMARY");
	const [title, setTitle] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const sourcesQuery = useSources(workspaceId);
	const createArtifact = useCreateArtifact(workspaceId);

	const readySources = useMemo(() => {
		return (sourcesQuery.data ?? []).filter((source) => source.status === "READY");
	}, [sourcesQuery.data]);

	function toggleSource(id: string) {
		setSelectedIds((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
		);
	}

	function toggleAll() {
		setSelectedIds((current) =>
			current.length === readySources.length ? [] : readySources.map((source) => source.id),
		);
	}

	function close() {
		setOpen(false);
		setTitle("");
		setSelectedIds([]);
		setType("SUMMARY");
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
					<Button size="sm">
						<Plus data-icon="inline-start" />
						New
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create learning artifact</DialogTitle>
					<DialogDescription>
						Choose an artifact type and the ready sources to learn from. You must select at least one
						source.
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
						Title <span className="font-normal text-muted-foreground">(optional)</span>
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
								{selectedIds.length === readySources.length ? "Clear all" : "Select all"}
							</Button>
						</div>

						{sourcesQuery.isPending ? (
							<div className="space-y-2">
								{[0, 1].map((item) => (
									<div key={item} className="h-12 animate-pulse rounded-xl bg-muted" />
								))}
							</div>
						) : readySources.length === 0 ? (
							<div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
								No ready sources yet. Add and process at least one source to create artifacts.
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
											<span className="block truncate font-medium">{source.title}</span>
											<span className="block truncate text-xs text-muted-foreground">
												{source.type} · {source.id.slice(0, 6)}
											</span>
										</span>
									</label>
								))}
							</div>
						)}

						{selectedIds.length === 0 && readySources.length > 0 && (
							<p className="text-xs text-destructive">Select at least one source.</p>
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

export function StudioPanel({ workspaceId }: { workspaceId: string }) {
	const artifactsQuery = useArtifacts(workspaceId);
	const deleteArtifact = useDeleteArtifact(workspaceId);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const artifacts = artifactsQuery.data ?? [];
	const selected = artifacts.find((artifact) => artifact.id === selectedId) ?? artifacts[0] ?? null;

	const hasPending = artifacts.some(
		(artifact) => artifact.status === "PENDING" || artifact.status === "PROCESSING",
	);

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between gap-2 border-b border-border pb-3">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">Studio</span>
					<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
						{artifacts.length} artifacts
					</span>
					{hasPending && (
						<span className="size-2 animate-pulse rounded-full bg-amber-500" aria-hidden />
					)}
				</div>
				<CreateArtifactDialog workspaceId={workspaceId} />
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto pr-1 pt-3">
				{artifactsQuery.isPending ? (
					<div className="space-y-2">
						{[0, 1, 2].map((item) => (
							<div key={item} className="h-16 animate-pulse rounded-xl bg-muted" />
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
							Create a summary, flashcards, quiz, or mind map from your ready sources.
						</p>
					</div>
				) : (
					<div className="grid gap-3">
						<ul className="grid gap-2">
							{artifacts.map((artifact) => {
								const meta = statusLabel[artifact.status] ?? statusLabel.PENDING;
								const active = selected?.id === artifact.id;
								return (
									<li key={artifact.id}>
										<button
											className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
												active
													? "border-foreground bg-foreground text-background"
													: "border-border bg-background hover:bg-muted"
											}`}
											onClick={() => setSelectedId(artifact.id)}
											type="button"
										>
											<span className="min-w-0">
												<span className="block truncate text-sm font-medium">
													{artifact.title}
												</span>
												<span
													className={`mt-1 inline-flex items-center gap-1 text-xs ${
														active ? "text-background/70" : "text-muted-foreground"
													}`}
												>
													{artifact.type} · {new Date(String(artifact.createdAt)).toLocaleDateString()}
												</span>
											</span>
											<span className="flex shrink-0 items-center gap-2">
												<Badge variant={active ? "secondary" : (meta?.variant ?? "outline")}>{meta?.label ?? artifact.status}</Badge>
												<span
													className={`grid size-7 place-items-center rounded-lg border ${
														active
															? "border-background/20 bg-background/10"
															: "border-border bg-background"
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
															if (window.confirm(`Delete "${artifact.title}"?`)) {
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
									<Badge variant={statusLabel[selected.status]?.variant ?? "outline"}>
										{statusLabel[selected.status]?.label ?? selected.status}
									</Badge>
								</div>

								{selected.status === "PENDING" || selected.status === "PROCESSING" ? (
									<p className="mt-3 text-sm text-muted-foreground">
										Generating — this updates automatically. Keep Inngest running.
									</p>
								) : selected.status === "FAILED" ? (
									<p className="mt-3 text-sm text-destructive">
										{(selected.metadata as { processingError?: string } | null)?.processingError ??
											"Generation failed. Try again."}
									</p>
								) : (
									<div className="mt-4">
										<ArtifactRenderer type={selected.type} content={selected.content} />
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