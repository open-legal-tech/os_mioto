FROM node:20-alpine AS base
RUN npm install -g pnpm turbo @dotenvx/dotenvx
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS prune

WORKDIR /app
COPY . .

RUN turbo prune @mioto/docs --docker

FROM base AS build
RUN apk add --no-cache libc6-compat python3 bash curl
RUN apk update

WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prune /app/out/full/apps/docs/.env.production ./apps/docs/

RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION \
  bash -c 'export DOTENV_PRIVATE_KEY_PRODUCTION=$(cat /run/secrets/DOTENV_PRIVATE_KEY_PRODUCTION) && \
  pnpm -F editor env:prod -- pnpm config set "//registry.tiptap.dev/:_authToken" $TIPTAP_TOKEN'

COPY tsconfig.base.json tsconfig.base.json

RUN pnpm install

COPY --from=prune /app/out/full/ .

RUN pnpm -F docs build

FROM nginx:alpine AS runtime

COPY --from=build ./app/apps/docs/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build ./app/apps/docs/dist /usr/share/nginx/html

ENV HOST=0.0.0.0
EXPOSE 8080