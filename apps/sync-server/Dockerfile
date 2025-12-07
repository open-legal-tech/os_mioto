FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Necessary configuration to get bun working
RUN apk add --no-cache ca-certificates wget bash
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

FROM base AS build
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
  pnpm -w env:prod -- pnpm -F sync-server build'

# ------------------------------------------------------------------
# Configure and copy everything into the final image.
FROM base
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app
USER app

COPY --from=build ./app .

EXPOSE 8081

CMD ["dotenvx", "run", "-f", ".env.production", "--", "node", "apps/sync-server/dist/index.js"]