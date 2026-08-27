# syntax=docker/dockerfile:1
#
# Synapse LM — API runtime image.
# Runs the Express API from the pnpm monorepo via tsx (raw TS, no bundler).
#
# Prisma generate needs DATABASE_URL at build time (prisma.config.ts loads
# packages/database/env.ts which requires it). Pass it as a build arg:
#   docker build --build-arg DATABASE_URL="$DATABASE_URL" -t gopalchoudhary/synapse-lm .

# -------------------------------------------------------------------------
# Dependencies + build stage
# -------------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ openssl \
    && npm install -g pnpm@9

WORKDIR /app

# Install workspace dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages packages
RUN pnpm install --frozen-lockfile

# Prisma client generation (no DB connection needed, but env.ts requires the URL)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm --filter @repo/database generate

# -------------------------------------------------------------------------
# Runtime stage
# -------------------------------------------------------------------------
FROM node:22-alpine

RUN apk add --no-cache openssl \
    && npm install -g pnpm@9

WORKDIR /app

ENV NODE_ENV=production

# Monorepo source (raw TS is executed via tsx) + installed deps (+ tsx devDep)
COPY --from=builder /app ./

WORKDIR /app
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:8000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

# Auto-run Prisma migrations on start, then boot the API
CMD ["sh", "-c", "pnpm --filter @repo/database exec prisma migrate deploy && pnpm --filter @repo/api exec tsx ./src/index.ts"]