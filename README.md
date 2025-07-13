# Mioto

**mioto** is an open-source workflow manager built with a [Turbo](https://turbo.build/) monorepo structure. It enables efficient, modular, and scalable workflow orchestration.

## Features

- ⚡ Turbo-powered monorepo
- 📦 Dependency management with [`pnpm`](https://pnpm.io/)
- 🧩 Modular architecture for extensibility
- 🛠 Node and package management via [`Volta`](https://volta.sh/)
- ☁️ Infrastructure as code with [`Pulumi`](https://www.pulumi.com/)
- 🚀 Easy local development setup

---

## Getting Started

### Prerequisites

Install [Volta](https://volta.sh) to manage Node and pnpm versions:

```bash
curl https://get.volta.sh | bash
volta install node
volta install pnpm
```

Clone the repository:

```bash
git clone https://github.com/yourusername/mioto.git
cd mioto
```

Install dependencies:

```bash
pnpm install
```

### Running Locally

Start the development server:

```bash
pnpm serve
```

---

## Deployments

Deployment is managed using [Pulumi](https://www.pulumi.com/), with infrastructure provisioned on Microsoft Azure.

### Requirements

- An Azure account
- The [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated:

  ```bash
  az login
  ```

- [Pulumi CLI](https://www.pulumi.com/docs/install/) installed and configured

### Deploying

Navigate to the infrastructure project directory:

```bash
cd apps/infra
pulumi up
```

### Manual Steps Required

- **Domain Setup** – Must be completed manually after *every* deployment. Be sure to update DNS records accordingly.
- **Email Domain Setup** – This is a one-time manual setup during the initial deployment to configure email services correctly.

---

## License

This project is licensed under the [MIT License](LICENSE).
