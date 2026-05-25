# syntax=docker/dockerfile:1.6
# Multi-stage build for niche-selection-api on ECS Fargate.
# Builds the server workspace only; client SPA is unrelated to this image.

# -------- builder --------
FROM public.ecr.aws/docker/library/node:20-bookworm-slim AS builder

WORKDIR /app

# Prisma needs openssl at runtime/generation
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy root workspace manifests + server manifest (no client; not needed)
COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json

# Copy the rest of the server tree so Prisma schema is present for postinstall
COPY server ./server

# Single-pass install at the workspace root so npm sets up the server symlink.
# Skip the client workspace entirely. Postinstall in server runs `prisma generate`,
# which needs prisma/schema.prisma to be present.
RUN npm install --workspace=server --include-workspace-root=false \
    --ignore-scripts=false --no-audit --no-fund

# -------- runner --------
FROM public.ecr.aws/docker/library/node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r app && useradd -r -g app app

# Bring over the server workspace with its node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/server

USER app

EXPOSE 3000

# package.json start = `node --import tsx src/index.ts`; tsx is in devDeps.
CMD ["npm", "run", "start"]
