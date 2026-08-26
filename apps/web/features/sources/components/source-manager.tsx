"use client";

import {
	FileCode,
	FileText,
	Globe,
	MonitorPlay,
	PanelLeftClose,
	PanelLeftOpen,
	Plus,
	RotateCcw,
	Search,
	Trash2,
	Type,
} from "lucide-react";
import {
	useDeferredValue,
	useMemo,
	useRef,
	useState,
	type FormEvent,
} from "react";
import { Button } from "~/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
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
import { Textarea } from "~/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import {
	useCreateTextSource,
	useDeleteSource,
	useImportWebsite,
	useImportYoutube,
	useReprocessSource,
	useSources,
	useUploadPdf,
} from "~/features/sources/hooks/use-sources";

type SourceType = "PDF" | "WEBSITE" | "YOUTUBE" | "TEXT" | "MARKDOWN";
type SourceStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

const sourceTypeMeta: Record<
	SourceType,
	{ label: string; icon: typeof FileText; colorClass: string; badgeBg: string }
> = {
	PDF: {
		label: "PDF",
		icon: FileText,
		colorClass: "text-red-600 dark:text-red-400",
		badgeBg: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
	},
	WEBSITE: {
		label: "Website",
		icon: Globe,
		colorClass: "text-blue-600 dark:text-blue-400",
		badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
	},
	YOUTUBE: {
		label: "YouTube",
		icon: MonitorPlay,
		colorClass: "text-rose-600 dark:text-rose-400",
		badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
	},
	TEXT: {
		label: "Text",
		icon: Type,
		colorClass: "text-amber-600 dark:text-amber-400",
		badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
	},
	MARKDOWN: {
		label: "Markdown",
		icon: FileCode,
		colorClass: "text-emerald-600 dark:text-emerald-400",
		badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
	},
};

const statusMeta: Record<SourceStatus, { label: string; className: string; dotClass: string }> = {
	READY: {
		label: "Ready",
		className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		dotClass: "bg-emerald-500",
	},
	PROCESSING: {
		label: "Processing",
		className: "bg-amber-500/10 text-amber-600 animate-pulse dark:text-amber-400",
		dotClass: "bg-amber-500 animate-pulse",
	},
	PENDING: {
		label: "Queued",
		className: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
		dotClass: "bg-sky-500 animate-pulse",
	},
	FAILED: {
		label: "Failed",
		className: "bg-destructive/10 text-destructive",
		dotClass: "bg-destructive",
	},
};

function formatDate(value: Date | string) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
	}).format(new Date(String(value)));
}

type AddMode = "text" | "markdown" | "website" | "youtube" | "pdf";

function AddSourceDialog({
	workspaceId,
	trigger,
}: {
	workspaceId: string;
	trigger?: React.ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<AddMode>("text");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [url, setUrl] = useState("");
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const createText = useCreateTextSource(workspaceId);
	const importWebsite = useImportWebsite(workspaceId);
	const importYoutube = useImportYoutube(workspaceId);
	const uploadPdf = useUploadPdf(workspaceId);

	const activeMutation = useMemo(() => {
		if (mode === "website") return importWebsite;
		if (mode === "youtube") return importYoutube;
		if (mode === "pdf") return uploadPdf;
		return createText;
	}, [mode, createText, importWebsite, importYoutube, uploadPdf]);

	function reset() {
		setTitle("");
		setContent("");
		setUrl("");
		setPdfFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function close() {
		reset();
		setOpen(false);
	}

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const options = {
			onSuccess: close,
		};

		if (mode === "text") {
			createText.mutate(
				{
					workspaceId,
					type: "TEXT",
					title: title.trim(),
					content: content.trim(),
				},
				options,
			);
			return;
		}

		if (mode === "markdown") {
			createText.mutate(
				{
					workspaceId,
					type: "MARKDOWN",
					title: title.trim(),
					content: content.trim(),
				},
				options,
			);
			return;
		}

		if (mode === "website") {
			importWebsite.mutate(
				{
					workspaceId,
					url: url.trim(),
					title: title.trim() || undefined,
				},
				options,
			);
			return;
		}

		if (mode === "youtube") {
			importYoutube.mutate(
				{
					workspaceId,
					url: url.trim(),
					title: title.trim() || undefined,
				},
				options,
			);
			return;
		}

		if (pdfFile) {
			uploadPdf.mutate(
				{ file: pdfFile, title: title.trim() || undefined },
				options,
			);
		}
	}

	const modeTabs: { value: AddMode; label: string }[] = [
		{ value: "text", label: "Text" },
		{ value: "markdown", label: "Markdown" },
		{ value: "website", label: "Website" },
		{ value: "youtube", label: "YouTube" },
		{ value: "pdf", label: "PDF" },
	];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					trigger ?? (
						<Button size="sm">
							<Plus data-icon="inline-start" />
							Add source
						</Button>
					)
				}
			/>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Add a source</DialogTitle>
					<DialogDescription>
						Bring in a document, link, or note. Sources are processed
						automatically before you chat with them.
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-1 overflow-x-auto rounded-xl bg-muted/70 p-1" role="tablist">
					{modeTabs.map((tab) => (
						<button
							aria-selected={mode === tab.value}
							className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
								mode === tab.value
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
							key={tab.value}
							onClick={() => setMode(tab.value)}
							role="tab"
							type="button"
						>
							{tab.label}
						</button>
					))}
				</div>

				<form className="grid gap-4" onSubmit={submit}>
					{(mode === "text" ||
						mode === "markdown" ||
						mode === "website" ||
						mode === "youtube") && (
						<label className="grid gap-2 text-sm font-medium">
							Title
							<Input
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder={
									mode === "website" || mode === "youtube"
										? "Optional"
										: "Give this source a name"
								}
							/>
						</label>
					)}

					{(mode === "text" || mode === "markdown") && (
						<label className="grid gap-2 text-sm font-medium">
							Content
							<Textarea
								required
								autoFocus
								className="min-h-40"
								value={content}
								onChange={(event) => setContent(event.target.value)}
								placeholder="Paste or write the material you want to study..."
							/>
						</label>
					)}

					{(mode === "website" || mode === "youtube") && (
						<label className="grid gap-2 text-sm font-medium">
							URL
							<Input
								required
								autoFocus
								value={url}
								onChange={(event) => setUrl(event.target.value)}
								placeholder={
									mode === "website"
										? "https://example.com/article"
										: "https://youtube.com/watch?v=..."
								}
							/>
						</label>
					)}

					{mode === "pdf" && (
						<div className="grid gap-2 text-sm font-medium">
							PDF file
							<label className="grid cursor-pointer place-items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center transition-colors hover:bg-muted">
								<input
									ref={fileInputRef}
									accept="application/pdf"
									className="sr-only"
									type="file"
									onChange={(event) =>
										setPdfFile(event.target.files?.[0] ?? null)
									}
								/>
								<FileText className="size-6 text-muted-foreground" />
								<span className="text-sm font-medium">
									{pdfFile ? pdfFile.name : "Choose a PDF to upload"}
								</span>
								<span className="text-xs text-muted-foreground">
									Up to 10MB
								</span>
							</label>
						</div>
					)}

					{activeMutation.error && (
						<p className="text-sm text-destructive" role="alert">
							{activeMutation.error.message}
						</p>
					)}

					<DialogFooter>
						<Button
							type="submit"
							disabled={
								activeMutation.isPending ||
								(mode === "pdf" && !pdfFile) ||
								(mode === "text" && !content.trim()) ||
								(mode === "markdown" && !content.trim()) ||
								((mode === "website" || mode === "youtube") && !url.trim())
							}
						>
							{activeMutation.isPending ? "Adding..." : "Add source"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export interface SourceManagerProps {
	workspaceId: string;
	isCollapsed?: boolean;
	onToggleCollapse?: () => void;
	onExpand?: () => void;
	selectedSourceId?: string | null;
	onSelectSource?: (id: string | null) => void;
}

export function SourceManager({
	workspaceId,
	isCollapsed = false,
	onToggleCollapse,
	onExpand,
	selectedSourceId,
	onSelectSource,
}: SourceManagerProps) {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | SourceStatus>("ALL");
	const deferredSearch = useDeferredValue(search.trim().toLowerCase());
	const sourcesQuery = useSources(workspaceId);
	const deleteSource = useDeleteSource(workspaceId);
	const reprocessSource = useReprocessSource(workspaceId);

	const sources = sourcesQuery.data ?? [];
	const [sourceToDelete, setSourceToDelete] = useState<(typeof sources)[number] | null>(null);
	const filtered = sources.filter((source) => {
		if (statusFilter !== "ALL" && source.status !== statusFilter) return false;
		if (!deferredSearch) return true;
		return `${source.title} ${source.url ?? ""}`
			.toLowerCase()
			.includes(deferredSearch);
	});

	const readyCount = sources.filter((source) => source.status === "READY").length;
	const hasPending = sources.some(
		(source) => source.status === "PENDING" || source.status === "PROCESSING",
	);

	const statusChips: { value: "ALL" | SourceStatus; label: string }[] = [
		{ value: "ALL", label: "All" },
		{ value: "READY", label: "Ready" },
		{ value: "PROCESSING", label: "Processing" },
		{ value: "FAILED", label: "Failed" },
	];

	if (isCollapsed) {
		return (
			<div className="flex h-full min-h-0 flex-col items-center justify-between py-1">
				<div className="flex w-full flex-col items-center gap-2">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Expand sources"
									className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
									onClick={onToggleCollapse}
									size="icon-sm"
									variant="ghost"
								>
									<PanelLeftOpen className="size-4" />
								</Button>
							}
						/>
						<TooltipContent side="right">Expand sources</TooltipContent>
					</Tooltip>

					<AddSourceDialog
						workspaceId={workspaceId}
						trigger={
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											aria-label="Add source"
											className="size-9 rounded-xl border border-dashed border-border bg-background text-muted-foreground shadow-xs hover:border-foreground/50 hover:bg-muted hover:text-foreground"
											size="icon-sm"
											variant="outline"
										>
											<Plus className="size-4" />
										</Button>
									}
								/>
								<TooltipContent side="right">Add source</TooltipContent>
							</Tooltip>
						}
					/>

					<div className="my-1 h-px w-6 bg-border" />

					<div className="flex w-full min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden pr-0.5">
						{sources.map((source) => {
							const meta = sourceTypeMeta[source.type] ?? sourceTypeMeta.TEXT;
							const Icon = meta.icon;
							const status = statusMeta[source.status] ?? statusMeta.PENDING;
							const isSelected = selectedSourceId === source.id;

							return (
								<Tooltip key={source.id}>
									<TooltipTrigger
										render={
											<button
												aria-label={source.title}
												className={`group relative flex size-9 shrink-0 items-center justify-center rounded-xl border transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
													meta.badgeBg
												} ${isSelected ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
												onClick={() => {
													onSelectSource?.(source.id);
													onExpand?.();
												}}
												type="button"
											>
												<Icon className="size-4" />
												<span
													className={`absolute -right-0.5 -top-0.5 size-2 rounded-full border border-background ${status.dotClass}`}
												/>
											</button>
										}
									/>
									<TooltipContent className="flex max-w-xs flex-col gap-0.5 px-2.5 py-1.5" side="right">
										<span className="max-w-[200px] truncate text-xs font-medium">
											{source.title}
										</span>
										<span className="text-[10px] text-muted-foreground">
											{meta.label} · {status.label}
										</span>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</div>

				{sources.length > 0 && (
					<div className="pt-2 text-center">
						<span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
							{sources.length}
						</span>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between gap-2 border-b border-border pb-3">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">Sources</span>
					<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
						{readyCount} ready
					</span>
				</div>
				{onToggleCollapse && (
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Collapse sources"
									className="text-muted-foreground hover:text-foreground"
									onClick={onToggleCollapse}
									size="icon-sm"
									variant="ghost"
								>
									<PanelLeftClose className="size-4" />
								</Button>
							}
						/>
						<TooltipContent side="right">Collapse panel</TooltipContent>
					</Tooltip>
				)}
			</div>

			<div className="pt-3">
				<AddSourceDialog
					workspaceId={workspaceId}
					trigger={
						<Button
							variant="outline"
							className="w-full rounded-full border-border/80 bg-background text-foreground shadow-xs hover:bg-muted font-medium text-sm gap-2 h-9"
						>
							<Plus className="size-4" />
							Add sources
						</Button>
					}
				/>
			</div>

			<div className="grid gap-2 py-3">
				<label className="relative block">
					<span className="sr-only">Search sources</span>
					<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="h-8 pl-8 text-sm"
						placeholder="Search sources"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
				</label>
				<div className="flex gap-1 overflow-x-auto pb-0.5">
					{statusChips.map((chip) => (
						<button
							className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring ${
								statusFilter === chip.value
									? "border-foreground bg-foreground text-background"
									: "border-border bg-background text-muted-foreground hover:text-foreground"
							}`}
							key={chip.value}
							onClick={() => setStatusFilter(chip.value)}
							type="button"
						>
							{chip.label}
						</button>
					))}
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto pr-1">
				{sourcesQuery.isPending ? (
					<div className="space-y-2">
						{[0, 1, 2].map((item) => (
							<div key={item} className="h-16 animate-pulse rounded-xl bg-muted" />
						))}
					</div>
				) : sourcesQuery.error ? (
					<div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
						Unable to load sources: {sourcesQuery.error.message}
					</div>
				) : hasPending && sources.length === 0 ? (
					<div className="rounded-xl border border-dashed border-border p-6 text-center">
						<p className="text-sm font-medium text-muted-foreground">
							No sources yet
						</p>
						<p className="mt-1 text-xs leading-5 text-muted-foreground/80">
							Add a PDF, website, video, or note to start building your
							research base.
						</p>
					</div>
				) : filtered.length === 0 ? (
					<div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
						{search || statusFilter !== "ALL"
							? "No sources match your filters."
							: "No sources yet."}
					</div>
				) : (
					<ul className="space-y-2">
						{filtered.map((source) => {
							const meta = sourceTypeMeta[source.type] ?? sourceTypeMeta.TEXT;
							const Icon = meta.icon;
							const status = statusMeta[source.status] ?? statusMeta.PENDING;
							const isSelected = selectedSourceId === source.id;

							return (
								<li
									className={`group rounded-xl border p-3 transition-colors hover:bg-muted/40 ${
										isSelected
											? "border-foreground bg-muted/20 ring-1 ring-foreground/20"
											: "border-border bg-background"
									}`}
									key={source.id}
									onClick={() => onSelectSource?.(source.id)}
								>
									<div className="flex items-start gap-3">
										<span
											className={`grid size-9 shrink-0 place-items-center rounded-lg border ${meta.badgeBg}`}
										>
											<Icon className="size-4" />
										</span>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium">
												{source.title}
											</p>
											<p className="mt-0.5 truncate text-xs text-muted-foreground">
												{meta.label}
												{source.url ? ` · ${source.url}` : ""} ·{" "}
												{formatDate(source.createdAt)}
											</p>
											<span
												className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
											>
												<span className={`size-1.5 rounded-full ${status.dotClass}`} />
												{status.label}
											</span>
										</div>
										<div className="flex shrink-0 gap-1 opacity-100 transition-opacity focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0">
											{source.status === "FAILED" && (
												<Button
													aria-label={`Reprocess ${source.title}`}
													disabled={reprocessSource.isPending}
													onClick={(e) => {
														e.stopPropagation();
														reprocessSource.mutate({
															workspaceId,
															sourceId: source.id,
														});
													}}
													size="icon-sm"
													variant="ghost"
												>
													<RotateCcw />
												</Button>
											)}
											<Button
												aria-label={`Delete ${source.title}`}
												disabled={deleteSource.isPending}
												onClick={(e) => {
													e.stopPropagation();
													setSourceToDelete(source);
												}}
												size="icon-sm"
												variant="ghost"
											>
												<Trash2 />
											</Button>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<AlertDialog
				open={Boolean(sourceToDelete)}
				onOpenChange={(open) => !open && setSourceToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogMedia className="bg-destructive/10 text-destructive">
							<Trash2 className="size-5" />
						</AlertDialogMedia>
						<AlertDialogTitle>Delete source</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete{" "}
							<span className="font-semibold text-foreground">
								&ldquo;{sourceToDelete?.title}&rdquo;
							</span>
							? This removes it from your notebook and grounding context.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (!sourceToDelete) return;
								const targetId = sourceToDelete.id;
								if (selectedSourceId === targetId) {
									onSelectSource?.(null as never);
								}
								setSourceToDelete(null);
								deleteSource.mutate({
									workspaceId,
									sourceId: targetId,
								});
							}}
							variant="destructive"
						>
							Delete source
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}