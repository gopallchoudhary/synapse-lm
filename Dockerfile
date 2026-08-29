# syntax=docker/dockerfile:1
#
# Synapse LM — API runtime image.
# Runs the Express API from the pnpm monorepo via tsx (raw TS, no bundler).

# -------------------------------------------------------------------------
# Dependencies + build stage
# -------------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ openssl \
    && npm install -g pnpm@9

WORKDIR /app

# 1. Install workspace dependencies (manifests first for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

COPY packages/ai/package.json packages/ai/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/errors/package.json packages/errors/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/jobs/package.json packages/jobs/package.json
COPY packages/jobs-client/package.json packages/jobs-client/package.json
COPY packages/logger/package.json packages/logger/package.json
COPY packages/memory/package.json packages/memory/package.json
COPY packages/rag/package.json packages/rag/package.json
COPY packages/services/package.json packages/services/package.json
COPY packages/storage/package.json packages/storage/package.json
COPY packages/trpc/package.json packages/trpc/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/vector-store/package.json packages/vector-store/package.json
COPY packages/web-search/package.json packages/web-search/package.json

RUN pnpm install --frozen-lockfile

# 2. Source code (copied after install so dependency layers stay cached)
COPY . .

# 3. Prisma client generation (dummy URL satisfies env.ts validation; no DB connection needed at build time)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN pnpm --filter @repo/database generate

# -------------------------------------------------------------------------
# Runtime stage
# -------------------------------------------------------------------------
FROM node:22-alpine

RUN apk add --no-cache openssl \
    && npm install -g pnpm@9

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 8000

# Monorepo source (raw TS is executed via tsx) + installed deps (+ tsx devDep)
COPY --from=builder /app ./

# Healthcheck with start-period allowing time for auto-migrations
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:8000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

# Auto-run Prisma migrations on start, then exec api start script directly
CMD ["sh", "-c", "pnpm --filter @repo/database exec prisma migrate deploy && exec pnpm --filter @repo/api start"]