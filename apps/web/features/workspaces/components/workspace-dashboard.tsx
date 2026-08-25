"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowUpRight, BookOpen, Clock3, LibraryBig, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useState, type FormEvent } from "react";
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
  useCreateWorkspace,
  useWorkspaces,
} from "~/features/workspaces/hooks/use-workspaces";

type WorkspaceModel = "gpt-4o-mini" | "gpt-4o";

type WorkspaceForm = {
  title: string;
  description: string;
  icon: string;
  defaultModel: WorkspaceModel;
};

const palettes = [
  "from-sky-500/20 via-cyan-500/10 to-transparent",
  "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  "from-amber-500/20 via-orange-500/10 to-transparent",
];

function emptyWorkspaceForm(): WorkspaceForm {
  return {
    title: "",
    description: "",
    icon: "S",
    defaultModel: "gpt-4o-mini",
  };
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(String(value)));
}

function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyWorkspaceForm);
  const createWorkspace = useCreateWorkspace();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createWorkspace.mutate(
      {
        title: form.title,
        description: form.description || undefined,
        icon: form.icon || undefined,
        defaultModel: form.defaultModel,
      },
      {
        onSuccess: () => {
          setForm(emptyWorkspaceForm());
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg" className="w-full sm:w-auto">
            <Plus data-icon="inline-start" />
            New notebook
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a notebook</DialogTitle>
          <DialogDescription>
            Give your research a home. You can add sources after creating it.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          <label className="grid gap-2 text-sm font-medium">
            Title
            <Input
              autoFocus
              required
              maxLength={120}
              placeholder="e.g. Distributed systems notes"
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
              placeholder="What are you trying to understand?"
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
                placeholder="S"
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
          {createWorkspace.error && (
            <p className="text-sm text-destructive" role="alert">
              {createWorkspace.error.message}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={createWorkspace.isPending}>
              {createWorkspace.isPending ? "Creating..." : "Create notebook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspaceDashboard() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const workspacesQuery = useWorkspaces();
  const workspaces = workspacesQuery.data ?? [];
  const filteredWorkspaces = workspaces.filter((workspace) => {
    if (!deferredSearch) return true;
    return `${workspace.title} ${workspace.description ?? ""}`
      .toLowerCase()
      .includes(deferredSearch);
  });

  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl bg-foreground text-sm text-background">
              S
            </span>
            <span className="hidden sm:inline">Synapse LM</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.firstName ? `Welcome back, ${user.firstName}` : "Your learning desk"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-10">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">
                <LibraryBig className="size-4" />
                Research, remembered
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                What are you learning today?
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                Keep your sources together and turn them into understanding,
                one notebook at a time.
              </p>
            </div>
            <CreateWorkspaceDialog />
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Your library
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Notebooks</h2>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search notebooks</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 pl-9"
                placeholder="Search notebooks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {workspacesQuery.isPending ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  className="h-52 animate-pulse rounded-2xl bg-muted"
                  key={item}
                />
              ))}
            </div>
          ) : workspacesQuery.error ? (
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
              Unable to load notebooks: {workspacesQuery.error.message}
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center sm:p-16">
              <BookOpen className="mx-auto size-8 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {search ? "No notebooks match your search" : "Start your first notebook"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {search
                  ? "Try a different title or description."
                  : "Create a focused space for the sources and questions you want to explore."}
              </p>
              {!search && <div className="mt-5"><CreateWorkspaceDialog /></div>}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredWorkspaces.map((workspace, index) => (
                <Link
                  className={`group relative min-h-52 overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${palettes[index % palettes.length]} p-6 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring`}
                  href={`/workspace/${workspace.id}`}
                  key={workspace.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-2xl bg-background/80 text-lg font-semibold shadow-sm">
                      {workspace.icon || "S"}
                    </span>
                    <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-9">
                    <h3 className="truncate text-xl font-semibold tracking-tight">
                      {workspace.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                      {workspace.description || "A new space for your next line of inquiry."}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    Updated {formatDate(workspace.updatedAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
