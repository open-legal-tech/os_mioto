FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Necessary configuration to get bun working
RUN apk add --no-cache ca-certificates wget
RUN if [[ $(uname -m) == "aarch64" ]] ; \
  then \
  # aarch64
  wget https://raw.githubusercontent.com/squishyu/alpine-pkg-glibc-aarch64-bin/master/glibc-2.26-r1.apk ; \
  apk add --no-cache --allow-untrusted --force-overwrite glibc-2.26-r1.apk ; \
  rm glibc-2.26-r1.apk ; \
  else \
  # x86_64
  wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk ; \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub ; \
  apk add --no-cache --force-overwrite glibc-2.28-r0.apk ; \
  rm glibc-2.28-r0.apk ; \
  fi
RUN npm install -g pnpm turbo @dotenvx/dotenvx bun
RUN --mount=type=secret,id=TIPTAP_TOKEN \
  pnpm config set "//registry.tiptap.dev/:_authToken" $(cat /run/secrets/TIPTAP_TOKEN)

# ------------------------------------------------------------------
# Prune the monorepo with turborepo
FROM base AS prune
WORKDIR /app
COPY . .
RUN turbo prune @mioto/sync-server --docker

# ------------------------------------------------------------------
# Install and build with pnpm.
FROM base AS pruned-repo
WORKDIR /app
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY tsconfig.base.json tsconfig.base.json
COPY packages/prisma packages/prisma

# ------------------------------------------------------------------
# Install dev dependencies and build the final image.
FROM pruned-repo AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY --from=prune /app/out/full/ .
RUN pnpm -F sync-server build:prod

# ------------------------------------------------------------------
# Install prod dependencies and build the final image.
FROM pruned-repo AS prod-dependencies
WORKDIR /app
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY tsconfig.base.json tsconfig.base.json
COPY packages/prisma packages/prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

# ------------------------------------------------------------------
# Configure and copy everything into the final image.
FROM base
WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app
USER app

COPY --from=build ./app/apps/sync-server/dist ./dist
COPY --from=build ./app/apps/sync-server/.env.production ./dist
COPY --from=build ./app/apps/sync-server/package.json ./dist
COPY --from=prod-dependencies ./app/apps/sync-server/node_modules ./dist/node_modules
COPY --from=prod-dependencies ./app/node_modules ./node_modules

EXPOSE 8081
WORKDIR /app/dist

CMD ["dotenvx", "run", "-f", ".env.production", "--", "node", "./index.js"]