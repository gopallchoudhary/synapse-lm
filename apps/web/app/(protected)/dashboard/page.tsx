import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="min-h-svh bg-background px-4 py-5 text-foreground sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Synapse LM
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your notebooks
            </h1>
          </div>
          <UserButton />
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <p className="text-sm font-medium text-muted-foreground">Phase 1</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Your learning workspace is ready.
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
            Workspace management arrives next. Once it is connected, your
            notebooks and research sources will live here.
          </p>
        </section>
      </div>
    </main>
  );
}
