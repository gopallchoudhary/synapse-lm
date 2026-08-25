import { UserButton } from "@clerk/nextjs";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-svh bg-background px-4 py-5 text-foreground sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Workspace
            </p>
            <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              Notebook {id}
            </h1>
          </div>
          <UserButton />
        </header>

        <section className="grid min-h-[60svh] place-items-center rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <div className="max-w-md">
            <p className="text-sm font-medium text-muted-foreground">Phase 2</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              This notebook is ready for sources.
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Sources, chat, and Studio tools will be added to this workspace
              in the next phases.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
