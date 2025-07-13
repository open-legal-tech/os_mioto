FROM node:20.18.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm turbo @dotenvx/dotenvx
RUN pnpm config set store-dir ~/.pnpm-store
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS builder
RUN apk add --no-cache libc6-compat python3 bash curl
RUN apk update

FROM builder AS installer
WORKDIR /app

COPY /out/json/ .
COPY /.env.production ./

COPY tsconfig.base.json tsconfig.base.json
COPY /out/full/packages/prisma packages/prisma

RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION \
  bash -c 'export DOTENV_PRIVATE_KEY_PRODUCTION=$(cat /run/secrets/DOTENV_PRIVATE_KEY_PRODUCTION) && \
  pnpm -w env:prod -- pnpm config set "//registry.tiptap.dev/:_authToken" $TIPTAP_TOKEN'

RUN pnpm install

COPY /out/full/ .

ENV SKIP_ENV_VALIDATION=true
# Build the project
RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION \
  --mount=type=cache,id=pnpm,target=/pnpm/store \
  bash -c 'export DOTENV_PRIVATE_KEY_PRODUCTION=$(cat /run/secrets/DOTENV_PRIVATE_KEY_PRODUCTION) && \
  pnpm -w env:prod -- pnpm -F editor build'

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/editor/out/ ./

ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "apps/editor/server.js"]