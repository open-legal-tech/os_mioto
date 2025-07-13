#!/bin/bash

# Use tput to set bold t# Define bold and green text
bold=$(tput bold)
green=$(tput setaf 2) # 2 is the color code for green
red=$(tput setaf 1) # 1 is the color code for red
reset=$(tput sgr0)

echo "${bold}${green}Install necessary packages with homebrew${reset}"
brew install 1password
brew install caddy docker 1password-cli jq direnv
echo ""

# Load package.json
PACKAGE_JSON_PATH="$(dirname "$(dirname "$0")")/package.json"
## Get node and pnpm versions
NODE_VERSION=$(jq -r '.volta.node' "$PACKAGE_JSON_PATH")
PNPM_VERSION=$(jq -r '.volta.pnpm' "$PACKAGE_JSON_PATH")

echo "${bold}${green}Setup 1password-cli${reset}"
# Configure 1password
if op account list | grep -q "miotolabs.1password.com"; then
    echo "${green}1Password CLI is configured correctly.${reset}"
else
  echo "Please open 1password, login and follow the steps here: https://developer.1password.com/docs/cli/get-started/#step-2-turn-on-the-1password-desktop-app-integration to enable the cli."
  read -p "Press enter to continue once you have completed the steps above."

  # Function to check 1Password CLI configuration
  check_1password_cli() {
    if op account list | grep -q "miotolabs.1password.com"; then
      echo "${green}1Password CLI is configured correctly.${reset}"
    else
      echo "${red}1Password CLI is not configured correctly. Please ensure you have followed the steps correctly.${reset}"
      read -p "Press enter to try again or Ctrl+C to exit."
      check_1password_cli # Recursive call to retry
    fi
  }

  # Initial call to check 1Password CLI configuration
  check_1password_cli
fi
echo ""

echo "${bold}${green}Setup volta to use node and pnpm${reset}"
# Install Volta and setup node and pnpm
## Enable pnpm feature
export VOLTA_FEATURE_PNPM=1
## Install Volta
curl https://get.volta.sh | bash
## Setup volta
volta setup
## Install node and pnpm
volta install node@$NODE_VERSION
volta install pnpm@$PNPM_VERSION

# Setup custom tiptap pro registry
pnpm config set "@tiptap-pro:registry" https://registry.tiptap.dev/
pnpm config set "//registry.tiptap.dev/:_authToken" $(op read op://Secrets/TipTap/credential)

echo "${bold}${green}Installing global npm packages${reset}"
# Install global packages
npm install -g turbo @dotenvx/dotenvx
echo ""

echo "${bold}${green}Install bun${reset}"
# Install bun
curl -fsSL https://bun.sh/install | bash
echo ""

echo "${bold}${green}Setup direnv${reset}"
# Setup direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
direnv allow .
echo ""

echo "${bold}${green}All Done! Please restart your shell or source the configuration file.${reset}"
