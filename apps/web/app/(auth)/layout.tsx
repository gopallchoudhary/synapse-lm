export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-svh bg-background px-4 py-4 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/10 sm:min-h-[calc(100svh-3rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-white text-sm font-black text-zinc-950">
              S
            </span>
            Synapse LM
          </div>

          <div className="relative max-w-md">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
              Read deeply. Remember more.
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] xl:text-6xl">
              Turn scattered sources into a clear point of view.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
              Bring your research together, ask better questions, and build
              learning material that stays grounded in what you provided.
            </p>
          </div>

          <p className="relative text-xs text-zinc-500">Your private learning workspace.</p>
        </section>

        <section className="flex min-w-0 items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
