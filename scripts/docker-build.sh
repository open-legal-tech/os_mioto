#!/bin/bash

IMAGE_TAG=$(jq -r '.version' "$APP_PATH/package.json")
IMAGE_NAME=$(jq -r '.name' "$APP_PATH/package.json" | sed 's|@mioto/||')

if [ -z "$IMAGE_TAG" ]; then
  echo "Error: version not found in package.json."
  exit 1
fi

if [ -z "$IMAGE_NAME" ]; then
  echo "Error: name not found in package.json."
  exit 1
fi

PUSH="${PUSH:-true}"

# Set variables
ACR_NAME="${ACR_NAME}"
ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"

APP_PATH="${APP_PATH}"
MONOREPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$MONOREPO_ROOT" || { echo "Failed to change to monorepo root"; exit 1; }

echo "Setting up buildx instance..."
BUILDER_NAME="platform-builder"

# Check if the builder already exists
if ! docker buildx inspect "$BUILDER_NAME" &>/dev/null; then
    echo "Creating new buildx instance: $BUILDER_NAME"
    docker buildx create --use --name "$BUILDER_NAME"
else
    echo "Using existing buildx instance: $BUILDER_NAME"
    docker buildx use "$BUILDER_NAME"
fi

# Ensure it is bootstrapped
docker buildx inspect "$BUILDER_NAME" --bootstrap

  # Only push if PUSH is set to true
if [ "$PUSH" = true ]; then
  # Log in to Azure Container Registry using Docker login
  echo "Logging in to Azure Container Registry ($ACR_LOGIN_SERVER)..."
  echo "$ACR_PASSWORD" | docker login "$ACR_LOGIN_SERVER" -u "$ACR_USERNAME" --password-stdin

  echo "Pushing image to Azure Container Registry..."
  docker buildx build \
    --platform linux/amd64 \
    --secret id=DOTENV_PRIVATE_KEY_PRODUCTION,env=DOTENV_PRIVATE_KEY_PRODUCTION \
    -t "$ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG" \
    -f "$APP_PATH/Dockerfile" \
    --progress=plain \
    --no-cache \
    --push .
  echo "Image pushed successfully to $ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG"
else
  # Build the image for linux/amd64 architecture
  echo "Building image for platform linux/amd64..."
  docker buildx build \
    --platform linux/amd64 \
    --secret id=DOTENV_PRIVATE_KEY_PRODUCTION,env=DOTENV_PRIVATE_KEY_PRODUCTION \
    -t "$ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG" \
    -f "$APP_PATH/Dockerfile" \
    --progress=plain \
    --no-cache \
    --load .
  echo "Image build successfully"
  echo "Image NOT pushed to registry"
fi