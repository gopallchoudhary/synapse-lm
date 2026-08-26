"use client";

import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  LayoutPanelTop,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { TooltipProvider } from "~/components/ui/tooltip";
import {
  useDeleteWorkspace,
  useUpdateWorkspace,
  useWorkspace,
} from "~/features/workspaces/hooks/use-workspaces";
import { ThemeToggle } from "~/components/theme-toggle";
import { ChatPanel } from "~/features/chat/components/chat-panel";
import { SourceManager } from "~/features/sources/components/source-manager";
import { StudioPanel } from "~/features/learn/components/studio-panel";
import { cn } from "~/lib/utils";

type WorkspaceModel = "gpt-4o-mini" | "gpt-4o";

type SettingsForm = {
  title: string;
  description: string;
  icon: string;
  defaultModel: WorkspaceModel;
};

const LAYOUT_STORAGE_KEY = "synapse:workspace-panel-layout:v1";

const panelCard =
  "flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] dark:ring-1 dark:ring-white/[0.06]";

export function WorkspaceShell({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const workspaceQuery = useWorkspace(workspaceId);
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);
  const [isStudioCollapsed, setIsStudioCollapsed] = useState(false);

  const sourcesPanelRef = useRef<PanelImperativeHandle | null>(null);
  const studioPanelRef = useRef<PanelImperativeHandle | null>(null);

  const [defaultLayout] = useState<Record<string, number> | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  });

  function handleLayoutChanged(layout: Record<string, number>) {
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  function toggleSources() {
    const panel = sourcesPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      panel.expand();
      setIsSourcesCollapsed(false);
    } else {
      panel.collapse();
      setIsSourcesCollapsed(true);
    }
  }

  function expandSources() {
    sourcesPanelRef.current?.expand();
    setIsSourcesCollapsed(false);
  }

  function toggleStudio() {
    const panel = studioPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      panel.expand();
      setIsStudioCollapsed(false);
    } else {
      panel.collapse();
      setIsStudioCollapsed(true);
    }
  }

  function expandStudio() {
    studioPanelRef.current?.expand();
    setIsStudioCollapsed(false);
  }

  const [form, setForm] = useState<SettingsForm>({
    title: "",
    description: "",
    icon: "S",
    defaultModel: "gpt-4o-mini",
  });

  useEffect(() => {
    if (!workspaceQuery.data) return;
    setForm({
      title: workspaceQuery.data.title,
      description: workspaceQuery.data.description ?? "",
      icon: workspaceQuery.data.icon ?? "S",
      defaultModel:
        workspaceQuery.data.defaultModel === "gpt-4o" ? "gpt-4o" : "gpt-4o-mini",
    });
  }, [workspaceQuery.data]);

  if (workspaceQuery.isPending) {
    return <div className="min-h-svh animate-pulse bg-muted" />;
  }

  if (workspaceQuery.error || !workspaceQuery.data) {
    return (
      <main className="grid min-h-svh place-items-center bg-background p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Notebook not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {workspaceQuery.error?.message || "This notebook may have been deleted."}
          </p>
          <Button className="mt-6" onClick={() => router.push("/dashboard")}>
            Back to notebooks
          </Button>
        </div>
      </main>
    );
  }

  const workspace = workspaceQuery.data;

  function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateWorkspace.mutate(
      {
        workspaceId,
        data: {
          title: form.title,
          description: form.description,
          icon: form.icon,
          defaultModel: form.defaultModel,
        },
      },
      { onSuccess: () => setSettingsOpen(false) },
    );
  }

  function removeWorkspace() {
    if (!window.confirm(`Delete "${workspace.title}"? This cannot be undone.`)) return;
    deleteWorkspace.mutate({ workspaceId }, {
      onSuccess: () => router.push("/dashboard"),
    });
  }

  return (
    <main className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-20 shrink-0 border-b border-border/70 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              aria-label="Back to notebooks"
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
              href="/dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground text-sm font-semibold text-background shadow-sm">
              {workspace.icon || "S"}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Notebook
              </p>
              <h1 className="truncate text-base font-semibold sm:text-lg">{workspace.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" size="sm">
                    <Settings2 data-icon="inline-start" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notebook settings</DialogTitle>
                  <DialogDescription>
                    Adjust how this notebook is named and which model it uses by default.
                  </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={submitSettings}>
                  <label className="grid gap-2 text-sm font-medium">
                    Title
                    <Input
                      required
                      maxLength={120}
                      value={form.title}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, title: event.target.value }))
                      }
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Description
                    <Textarea
                      maxLength={500}
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      Icon
                      <Input
                        maxLength={8}
                        value={form.icon}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, icon: event.target.value }))
                        }
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Default model
                      <select
                        className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        value={form.defaultModel}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            defaultModel: event.target.value as WorkspaceModel,
                          }))
                        }
                      >
                        <option value="gpt-4o-mini">GPT-4o mini</option>
                        <option value="gpt-4o">GPT-4o</option>
                      </select>
                    </label>
                  </div>
                  {updateWorkspace.error && (
                    <p className="text-sm text-destructive" role="alert">
                      {updateWorkspace.error.message}
                    </p>
                  )}
                  <DialogFooter>
                    <Button type="submit" disabled={updateWorkspace.isPending}>
                      {updateWorkspace.isPending ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
                <div className="border-t border-border pt-4">
                  <Button
                    className="w-full sm:w-auto"
                    disabled={deleteWorkspace.isPending}
                    onClick={removeWorkspace}
                    variant="destructive"
                  >
                    {deleteWorkspace.isPending ? "Deleting..." : "Delete notebook"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <UserButton />
          </div>
        </div>
      </header>

      <TooltipProvider delay={100}>
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 min-h-0 flex-col p-3 sm:p-4 lg:p-5">
          <div className="hidden flex-1 min-h-0 w-full lg:flex">
            <ResizablePanelGroup
              orientation="horizontal"
              id="synapse-workspace-layout"
              defaultLayout={defaultLayout}
              onLayoutChanged={handleLayoutChanged}
              className="h-full w-full min-h-0 gap-1.5"
            >
              <ResizablePanel
                id="sources"
                collapsible
                minSize="220px"
                maxSize="450px"
                defaultSize="310px"
                collapsedSize="56px"
                panelRef={sourcesPanelRef}
                onResize={(size) => {
                  setIsSourcesCollapsed(size.inPixels <= 68);
                }}
                className={cn(
                  panelCard,
                  "transition-[padding] duration-150 ease-out",
                  isSourcesCollapsed ? "p-2" : "p-5 sm:p-6"
                )}
              >
                <SourceManager
                  workspaceId={workspaceId}
                  isCollapsed={isSourcesCollapsed}
                  onToggleCollapse={toggleSources}
                  onExpand={expandSources}
                  selectedSourceId={selectedSourceId}
                  onSelectSource={setSelectedSourceId}
                />
              </ResizablePanel>

              <ResizableHandle withHandle className="mx-0.5 cursor-col-resize" />

              <ResizablePanel
                id="chat"
                minSize="340px"
                className={cn(panelCard, "p-5 sm:p-6 flex-1 min-w-0")}
              >
                <ChatPanel workspaceId={workspaceId} />
              </ResizablePanel>

              <ResizableHandle withHandle className="mx-0.5 cursor-col-resize" />

              <ResizablePanel
                id="studio"
                collapsible
                minSize="260px"
                maxSize="480px"
                defaultSize="350px"
                collapsedSize="56px"
                panelRef={studioPanelRef}
                onResize={(size) => {
                  setIsStudioCollapsed(size.inPixels <= 68);
                }}
                className={cn(
                  panelCard,
                  "transition-[padding] duration-150 ease-out",
                  isStudioCollapsed ? "p-2" : "p-5 sm:p-6"
                )}
              >
                <StudioPanel
                  workspaceId={workspaceId}
                  isCollapsed={isStudioCollapsed}
                  onToggleCollapse={toggleStudio}
                  onExpand={expandStudio}
                  selectedArtifactId={selectedArtifactId}
                  onSelectArtifact={setSelectedArtifactId}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 min-h-0 flex-col gap-3 lg:hidden"
          >
            <TabsList className="grid w-full grid-cols-3 p-1">
              <TabsTrigger value="sources" className="gap-1.5">
                <FileText className="size-4" />
                Sources
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-1.5">
                <MessageSquare className="size-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="studio" className="gap-1.5">
                <LayoutPanelTop className="size-4" />
                Studio
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="sources"
              className="flex flex-1 min-h-0 flex-col overflow-hidden data-[state=inactive]:hidden"
            >
              <div className={`${panelCard} flex flex-1 min-h-0 flex-col p-5`}>
                <SourceManager
                  workspaceId={workspaceId}
                  selectedSourceId={selectedSourceId}
                  onSelectSource={setSelectedSourceId}
                />
              </div>
            </TabsContent>
            <TabsContent
              value="chat"
              className="flex flex-1 min-h-0 flex-col overflow-hidden data-[state=inactive]:hidden"
            >
              <div className={`${panelCard} flex flex-1 min-h-0 flex-col p-5`}>
                <ChatPanel workspaceId={workspaceId} />
              </div>
            </TabsContent>
            <TabsContent
              value="studio"
              className="flex flex-1 min-h-0 flex-col overflow-hidden data-[state=inactive]:hidden"
            >
              <div className={`${panelCard} flex flex-1 min-h-0 flex-col p-5`}>
                <StudioPanel
                  workspaceId={workspaceId}
                  selectedArtifactId={selectedArtifactId}
                  onSelectArtifact={setSelectedArtifactId}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </main>
  );
}
