"use client";

import {
	FileText,
	Globe,
	MonitorPlay,
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

const sourceTypeMeta: Record<SourceType, { label: string; icon: typeof FileText }> = {
	PDF: { label: "PDF", icon: FileText },
	WEBSITE: { label: "Website", icon: Globe },
	YOUTUBE: { label: "YouTube", icon: MonitorPlay },
	TEXT: { label: "Text", icon: Type },
	MARKDOWN: { label: "Markdown", icon: Type },
};

const statusMeta: Record<SourceStatus, { label: string; className: string }> = {
	READY: {
		label: "Ready",
		className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	},
	PROCESSING: {
		label: "Processing",
		className: "bg-amber-500/10 text-amber-600 animate-pulse dark:text-amber-400",
	},
	PENDING: {
		label: "Queued",
		className: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
	},
	FAILED: {
		label: "Failed",
		className: "bg-destructive/10 text-destructive",
	},
};

function formatDate(value: Date | string) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
	}).format(new Date(String(value)));
}

type AddMode = "text" | "markdown" | "website" | "youtube" | "pdf";

function AddSourceDialog({ workspaceId }: { workspaceId: string }) {
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
					<Button size="sm">
						<Plus data-icon="inline-start" />
						Add source
					</Button>
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

export function SourceManager({ workspaceId }: { workspaceId: string }) {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | SourceStatus>("ALL");
	const deferredSearch = useDeferredValue(search.trim().toLowerCase());
	const sourcesQuery = useSources(workspaceId);
	const deleteSource = useDeleteSource(workspaceId);
	const reprocessSource = useReprocessSource(workspaceId);

	const sources = sourcesQuery.data ?? [];
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

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between gap-2 border-b border-border pb-3">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">Sources</span>
					<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
						{readyCount} ready
					</span>
				</div>
				<AddSourceDialog workspaceId={workspaceId} />
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
							const meta = sourceTypeMeta[source.type];
							const Icon = meta.icon;
							const status = statusMeta[source.status];
							return (
								<li
									className="group rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted/40"
									key={source.id}
								>
									<div className="flex items-start gap-3">
										<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
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
												className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
											>
												{status.label}
											</span>
										</div>
										<div className="flex shrink-0 gap-1 opacity-100 transition-opacity focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0">
											{source.status === "FAILED" && (
												<Button
													aria-label={`Reprocess ${source.title}`}
													disabled={reprocessSource.isPending}
													onClick={() =>
														reprocessSource.mutate({
															workspaceId,
															sourceId: source.id,
														})
													}
													size="icon-sm"
													variant="ghost"
												>
													<RotateCcw />
												</Button>
											)}
											<Button
												aria-label={`Delete ${source.title}`}
												disabled={deleteSource.isPending}
												onClick={() => {
													if (
														window.confirm(
															`Delete "${source.title}"? This removes it from your notebook.`,
														)
													) {
														deleteSource.mutate({
															workspaceId,
															sourceId: source.id,
														});
													}
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
		</div>
	);
}