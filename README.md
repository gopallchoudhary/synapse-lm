# Synapse LM

NotebookLM-inspired learning workspace. Create notebooks, add PDFs / websites / YouTube videos / text, and chat with your sources via RAG. Generate summaries, takeaways, flashcards, quizzes, mind-maps, and reports. Everything is grounded in what you provide.

## Features

- **Notebooks (Workspaces)** — create, search, rename, pick an icon, choose a default model
- **Sources** — PDF (Cloudinary + `unpdf`), website (Firecrawl), YouTube transcripts, text/markdown; chunked, embedded (`text-embedding-3-small`), indexed per-workspace in Pinecone
- **Chat** — streaming chat with citations, retrieved context, rolling conversation summaries, Mem0 long-term memory, and optional Tavily web search via tool calling
- **Studio** — manual artifact generation (Summary / Takeaways / Flashcards / Quiz / Mind Map / Report) with source picker and auto-poll
- **Auth** — Clerk on web (Next.js) and API (Express), webhook syncs users to Postgres

## Stack

| Layer | Tech |
|---|---|
| Monorepo | pnpm workspaces + Turborepo, TypeScript throughout (`type: module`) |
| Web | Next.js 16 (App Router, React 19), Tailwind v4 + shadcn/Base-UI, TanStack Query, tRPC 11, Clerk, `ai` + `@ai-sdk/react` + `streamdown` |
| API | Express 5 + `tsx watch`, `tsup`, tRPC 11 + `trpc-to-openapi` (Scalar at `/docs`, `/openapi.json`), Inngest at `/api/inngest` |
| DB | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`), migrations in `packages/database/prisma` |
| Vectors | Pinecone serverless (AWS us-east-1, 1536-dim cosine, namespace = `workspaceId`) |
| AI | OpenRouter via Vercel AI SDK + OpenAI embeddings |
| Jobs | Inngest (`packages/jobs`, client in `packages/jobs-client`) |
| Other | Cloudinary (PDFs), Mem0, Tavily, Firecrawl, `youtube-transcript`, `unpdf` |

## Repo Layout

```
apps/web        Next.js app  (/, /login, /sign-up, /dashboard, /workspace/[id])
apps/api        Express API  (/trpc, /api, /api/webhooks/clerk/webhook, /workspace/:id/chat|sources, /api/inngest, /health, /docs)
packages/database   Prisma schema + generated client, env loader
packages/trpc       tRPC routers (workspace, source, artifact, chat, test) + OpenAPI
packages/services   business logic (WorkspaceService, SourceService, SourceProcessingService, ChatService, ArtifactService, etc.)
packages/ai         chat model + embeddings
packages/rag        loaders (website/youtube/pdf), chunking, retrieve + system prompt
packages/vector-store  Pinecone wrapper
packages/storage    Cloudinary
packages/memory     Mem0 wrapper
packages/web-search Tavily wrapper
packages/jobs / jobs-client  Inngest
packages/errors, logger, eslint-config, typescript-config
```

## Prerequisites

- Node 18+, pnpm 9
- PostgreSQL (Neon recommended), Pinecone index, Cloudinary account, OpenRouter key, Clerk app, Tavily / Firecrawl / Mem0 keys as needed

## Setup

```bash
pnpm install

# env — single source of truth at repo root (per-package .env are fallback only)
cp .env.example .env
# fill all keys in .env (see table below); apps/web also reads NEXT_PUBLIC_* via Next.js

# database — generate client + apply migrations
pnpm db:generate
pnpm db:migrate
```

Optional: `pnpm db:studio` to inspect data.

## Environment

All local dev keys live in **root `.env`** (loaded by `dotenv -e .env -- turbo run dev` and by `packages/database/env.ts` / `packages/web-search/src/client.ts` self-loaders). Production injects them via hosting env vars (`tsup` build has no dotenv).

`apps/web/.env` is kept only for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Next.js requires it under `apps/web/`).

| Key | Where |
|---|---|
| `DATABASE_URL` | Postgres (Neon) |
| `CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk |
| `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` | Clerk |
| `TAVILY_API_KEY` | Tavily |
| `PINECONE_API_KEY`, `PINECONE_INDEX` | Pinecone |
| `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL` | OpenRouter |
| `FIRECRAWL_API_KEY` | Firecrawl |
| `CLOUDINARY_CLOUD_NAME/PRESET/API_KEY/API_SECRET` | Cloudinary |
| `MEM0_API_KEY` | Mem0 |
| `INNGEST_DEV`, `INNGEST_EVENT_KEY` | Inngest (local: `INNGEST_DEV=1`) |
| `NEXT_PUBLIC_API_URL`, `BASE_URL`, `PORT`, `NODE_ENV` | App wiring |

See `.env.example` for placeholders.

## Run

```bash
# web + api together (root injects .env for both)
pnpm dev
# web:   http://localhost:3000
# api:   http://localhost:8000  (health at /health, docs at /docs)

# Inngest dev (separate terminal, required for source processing + artifacts)
npx inngest-cli@latest dev -u http://localhost:8000/api/inngest
```

Individual apps:

```bash
pnpm --filter web dev        # Next.js only
pnpm --filter @repo/api dev  # Express only (tsx watch)
```

Exposed ngrok for Clerk webhooks:

```bash
ngrok http 8000
# Clerk Dashboard → Webhooks → https://<ngrok>/api/webhooks/clerk/webhook → user.created/updated/deleted
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | `turbo run dev` (web + api) |
| `pnpm build` | `turbo run build` |
| `pnpm lint` | `turbo run lint` (`--max-warnings 0`) |
| `pnpm check-types` | `turbo run check-types` |
| `pnpm format` | Prettier |
| `pnpm test` / `pnpm test:watch` | Vitest (`vitest run` / watch) |
| `pnpm db:generate` | Prisma generate |
| `pnpm db:migrate` | Prisma migrate dev |
| `pnpm db:studio` | Prisma Studio |

Per-package filters: `pnpm --filter web build`, `pnpm --filter @repo/api build`, etc.

## API Surface

- **tRPC** at `/trpc` and REST at `/api` (OpenAPI) via `trpc-to-openapi`: `workspace`, `source`, `artifact`, `chat`, `test`
- **Streaming chat**: `POST /workspace/:workspaceId/chat` (SSE, `ai` UIMessage, `DefaultChatTransport`)
- **PDF upload**: `POST /workspace/:workspaceId/sources/upload` (multipart, `upload-middleware`)
- **Webhooks/queue**: `POST /api/webhooks/clerk/webhook`, `POST /api/inngest`
- **Introspection**: `GET /openapi.json`, `GET /docs` (Scalar), `GET /health`, `GET /`

## Data Model

`User (clerkId)` → `Workspace` → `Source` → `SourceChunk`, `Conversation` → `Message`, `LearningArtifact (SUMMARY/TAKEAWAYS/FLASHCARDS/QUIZ/MINDMAP/REPORT)`

Pipeline: upload (Multer → Cloudinary + `unpdf`) → chunk (`chunkPages`/`chunkText`) → embed + Pinecone upsert (namespace = workspace) → RAG retrieve → streamed answer + citations.

## Identity Note

`ctx.userId` is always the **Clerk external ID**. It is stored only in `User.clerkId` and passed to Mem0/Clerk. All Prisma foreign keys use the internal `User.id` — services resolve `clerkId → id` internally. Client payloads never include `userId`; ownership is enforced via `workspaceService.getWorkspaceByIdAndUserId`.

## Production

- `pnpm build` then `pnpm --filter @repo/api start` (`node dist/index.js`) — expects env vars injected by hosting (Vercel/Neon); no `.env` files are bundled.
- Run `pnpm db:migrate` (or `prisma migrate deploy`) against the production database before first start.
- Configure the same Clerk webhook URL for production.

## Troubleshooting

- `User profile is not synchronized` — webhook hasn't fired yet; check `CLERK_WEBHOOK_SECRET` and ngrok, or re-sign-in (fallback sync runs on first protected request).
- `ECONNREFUSED` on Prisma — check `DATABASE_URL` in root `.env` (Neon requires `?sslmode=require`).
- `PINECONE_API_KEY / CLOUDINARY / OPENROUTER not configured` — fill root `.env` and restart `pnpm dev`.
- `Input parser must be a ZodObject` (OpenAPI) — all tRPC inputs use `z.object` (see `packages/trpc` routes).
