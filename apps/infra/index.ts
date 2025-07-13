import * as pulumi from "@pulumi/pulumi";
import * as docker_build from "@pulumi/docker-build";

import * as resources from "@pulumi/azure-native/resources/v20240701";
import * as operationalinsights from "@pulumi/azure-native/operationalinsights/v20230901";
import * as app from "@pulumi/azure-native/app/v20240802preview";
import * as cognitiveservices from "@pulumi/azure-native/cognitiveservices/v20241001";
import * as registry from "@pulumi/azure-native/containerregistry";
import * as postgresql from "@pulumi/azure-native/dbforpostgresql";
import * as sentry from "@pulumiverse/sentry";
import * as communication from "@pulumi/azure-native/communication";
import * as storage from "@pulumi/azure-native/storage";
import * as azuread from "@pulumi/azuread";
import * as authorization from "@pulumi/azure-native/authorization";

const config = new pulumi.Config();
const scalewayConfig = new pulumi.Config("scaleway");
const azureConfig = authorization.getClientConfigOutput({});

// ------------------------------------------------------------------
// Azure resource group
const resourceGroup = new resources.ResourceGroup("mioto");

// ------------------------------------------------------------------
// Storage Blob

const storageAccount = new storage.StorageAccount("blobstorage", {
  resourceGroupName: resourceGroup.name,
  kind: "StorageV2",
  sku: {
    name: "Standard_LRS",
  },
});

const storageContainer = new storage.BlobContainer("files", {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  publicAccess: storage.PublicAccess.None,
});

const storageKey = storage
  .listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
  })
  .keys.apply((keys) => keys[0].value);

// ------------------------------------------------------------------
// Service Principal

// Create the App Registration
const appSP = new azuread.Application("editor", {
  displayName: "editor",
});

// Create the Service Principal linked to the App
const sp = new azuread.ServicePrincipal("editor-sp", {
  clientId: appSP.clientId,
});

// Create a password (client secret) for the Service Principal
const spPassword = new azuread.ServicePrincipalPassword("editor-sp-password", {
  servicePrincipalId: sp.id,
  endDate: "2099-01-01T00:00:00Z",
});

new authorization.RoleAssignment("editor-sp-role", {
  principalId: sp.objectId,
  principalType: "ServicePrincipal",
  roleDefinitionId:
    "/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe",
  scope: storageAccount.id,
});

// ------------------------------------------------------------------
// Setup log analytics
const workspace = new operationalinsights.Workspace("logs", {
  location: resourceGroup.location,
  resourceGroupName: resourceGroup.name,
  retentionInDays: 30,
  sku: {
    name: operationalinsights.WorkspaceSkuNameEnum.PerGB2018,
  },
});

const sharedKeys = operationalinsights.getSharedKeysOutput({
  resourceGroupName: resourceGroup.name,
  workspaceName: workspace.name,
});

// ------------------------------------------------------------------
// Setup Open AI model deployed on azure
const cognitiveAccount = new cognitiveservices.Account("mioto-ai-account", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  kind: "OpenAI",
  sku: {
    name: "S0",
  },
});

const openaiDeployment = new cognitiveservices.Deployment("mioto-ai", {
  accountName: cognitiveAccount.name,
  properties: {
    model: {
      format: "OpenAI",
      name: "gpt-4o-mini",
      version: "2024-07-18",
    },
  },
  resourceGroupName: resourceGroup.name,
  sku: {
    capacity: 1,
    name: "Standard",
  },
});

const openaiKey = cognitiveservices.listAccountKeysOutput({
  accountName: cognitiveAccount.name,
  resourceGroupName: resourceGroup.name,
}).key1;

// ------------------------------------------------------------------
// Setup sentry for editor

const sentryProjectEditor = new sentry.SentryProject("editor", {
  organization: config.require("sentry_org"),
  platform: "javascript-nextjs",
  resolveAge: 720,
  teams: [config.require("sentry_team")],
});

const sentryKeyEditor = new sentry.SentryKey("sentry-token", {
  organization: config.require("sentry_org"),
  project: sentryProjectEditor.name,
});

// ------------------------------------------------------------------
// Setup sentry for sync-server

const sentryProjectSyncServer = new sentry.SentryProject("sync-server", {
  organization: config.require("sentry_org"),
  platform: "node-express",
  resolveAge: 720,
  teams: [config.require("sentry_team")],
});

const sentryKeySyncServer = new sentry.SentryKey("sync-server-sentry-token", {
  organization: config.require("sentry_org"),
  project: sentryProjectSyncServer.name,
});

// ------------------------------------------------------------------
// Setup DB

let dbConnectionString: pulumi.Output<string> | string | undefined = config.get(
  "db_connection_string",
);

if (!dbConnectionString) {
  const dbServer = new postgresql.Server("server", {
    createMode: postgresql.CreateMode.Default,
    resourceGroupName: resourceGroup.name,
    version: "16",
    administratorLogin: config.require("db_username"),
    administratorLoginPassword: config.requireSecret("db_password"),
    backup: {
      backupRetentionDays: 7,
      geoRedundantBackup: postgresql.GeoRedundantBackupEnum.Disabled,
    },
    sku: {
      tier: "Burstable",
      name: "Standard_B2s",
    },
    storage: {
      storageSizeGB: 64,
    },
  });

  const db = new postgresql.Database("mioto", {
    resourceGroupName: resourceGroup.name,
    serverName: dbServer.name,
  });

  new postgresql.FirewallRule("all", {
    resourceGroupName: resourceGroup.name,
    serverName: dbServer.name,
    startIpAddress: "0.0.0.0",
    endIpAddress: "255.255.255.255",
  });

  dbConnectionString = dbServer.fullyQualifiedDomainName.apply((hostname) =>
    config
      .requireSecret("db_password")
      .apply((password) =>
        db.name.apply(
          (dbName) =>
            `postgresql://${config.require("db_username")}:${password}@${hostname}/${dbName}?sslmode=require`,
        ),
      ),
  );
}

const databaseMigrationImage = new docker_build.Image("image", {
  platforms: ["linux/amd64"],
  context: {
    location: "../../packages/prisma",
  },
  dockerfile: {
    location: "./Dockerfile.migration",
  },
  push: true,
  tags: ["philtechdev/mioto-db-migration:latest"],
  registries: [
    {
      address: "docker.io",
      password: "J*L-8xQMyet3CV8NRtne",
      username: "philtechdev",
    },
  ],
});

// ------------------------------------------------------------------
// Setup azure email

const communicationService = new communication.CommunicationService(
  "comm-service",
  {
    dataLocation: "Europe",
    resourceGroupName: resourceGroup.name,
    location: "global",
  },
);

const emailService = new communication.EmailService("emailService", {
  dataLocation: "Europe",
  emailServiceName: "mioto-transactional-email",
  resourceGroupName: resourceGroup.name,
  location: "global",
});

new communication.Domain("domain", {
  domainManagement: communication.DomainManagement.CustomerManaged,
  resourceGroupName: resourceGroup.name,
  emailServiceName: emailService.name,
  location: "global",
  domainName: "email.mioto.app",
});

const emailConnectionString = communication.listCommunicationServiceKeysOutput({
  communicationServiceName: communicationService.name,
  resourceGroupName: resourceGroup.name,
}).primaryConnectionString;

// ------------------------------------------------------------------
// Setup container environment
const environment = new app.ManagedEnvironment("mioto-env", {
  location: resourceGroup.location,
  resourceGroupName: resourceGroup.name,
  // customDomainConfiguration: {
  //   dnsSuffix: "mioto.app",
  // },
  appLogsConfiguration: {
    destination: "log-analytics",
    logAnalyticsConfiguration: {
      customerId: workspace.customerId,
      sharedKey: sharedKeys.primarySharedKey as unknown as any,
    },
  },
});

// ------------------------------------------------------------------
// Get registry credentials
const credentials = registry.listRegistryCredentialsOutput({
  resourceGroupName: "registry",
  registryName: "MiotoRegistry",
});

const adminUsername = credentials.apply((c) => c.username!);
const adminPassword = credentials.apply((c) => c.passwords![0].value!);

// ------------------------------------------------------------------
// Setup containers

const docsContainer = new app.ContainerApp("docs", {
  environmentId: environment.id,
  location: resourceGroup.location,
  resourceGroupName: resourceGroup.name,
  configuration: {
    secrets: [
      { name: "pwd", value: adminPassword },
      { name: "dotenv-key", value: config.requireSecret("dotenv-key") },
    ],
    registries: [
      {
        server: "miotoregistry.azurecr.io",
        username: adminUsername,
        passwordSecretRef: "pwd",
      },
    ],
    ingress: {
      external: true,
      targetPort: 8080,
      transport: "auto",
    },
    activeRevisionsMode: "Single",
  },
  template: {
    containers: [
      {
        image: config.require("docs_image"),
        name: "docs",
        env: [
          {
            name: "DOTENV_PRIVATE_KEY_PRODUCTION",
            secretRef: "dotenv-key",
          },
        ],
      },
    ],
    scale: {
      maxReplicas: 5,
      minReplicas: 1,
      rules: [
        {
          custom: {
            metadata: {
              concurrentRequests: "50",
            },
            type: "http",
          },
          name: "httpscalingrule",
        },
      ],
    },
  },
});

const syncServer = new app.ContainerApp("sync-server", {
  environmentId: environment.id,
  location: resourceGroup.location,
  resourceGroupName: resourceGroup.name,
  configuration: {
    secrets: [
      { name: "sentry-auth-token", value: sentryKeySyncServer.secret },
      { name: "pwd", value: adminPassword },
      { name: "dotenv-key", value: config.requireSecret("dotenv-key") },
      {
        name: "access-token-secret",
        value: config.requireSecret("access_token_secret"),
      },
      {
        name: "refresh-token-secret",
        value: config.requireSecret("refresh_token_secret"),
      },
      {
        name: "database-url",
        value: dbConnectionString,
      },
      {
        name: "azure-email-connection-string",
        value: emailConnectionString?.apply((val) => {
          if (!val) {
            throw new Error("Email connection string could not be found.");
          }
          return val;
        }),
      },
      {
        name: "aws-s3-secret",
        value: scalewayConfig.requireSecret("secret_key"),
      },
      { name: "azure-storage-key", value: storageKey },
    ],
    registries: [
      {
        server: "miotoregistry.azurecr.io",
        username: adminUsername,
        passwordSecretRef: "pwd",
      },
    ],
    ingress: {
      external: true,
      targetPort: 8081,
      transport: "auto",
    },
    activeRevisionsMode: "Single",
  },
  template: {
    containers: [
      {
        image: config.require("sync_server_image"),
        name: "sync-server",
        env: [
          {
            name: "DOTENV_PRIVATE_KEY_PRODUCTION",
            secretRef: "dotenv-key",
          },
          { name: "SENTRY_DSN", value: sentryKeyEditor.dsnPublic },
          { name: "PORT", value: "8081" },
          {
            name: "ACCESS_TOKEN_SECRET",
            secretRef: "access-token-secret",
          },
          {
            name: "REFRESH_TOKEN_SECRET",
            secretRef: "refresh-token-secret",
          },
          {
            name: "DATABASE_URL",
            secretRef: "database-url",
          },
          {
            name: "AZURE_EMAIL_CONNECTION_STRING",
            secretRef: "azure-email-connection-string",
          },
          { name: "AZURE_STORAGE_KEY", secretRef: "azure-storage-key" },
          { name: "AZURE_STORAGE_ACCOUNT", value: storageAccount.name },
          { name: "AZURE_STORAGE_CONTAINER", value: storageContainer.name },
          { name: "CLIENT_ENDPOINT", value: config.require("client_endpoint") },
          {
            name: "AWS_S3_SECRET_ACCESS_KEY",
            secretRef: "aws-s3-secret",
          },
          {
            name: "AWS_S3_ACCESS_KEY_ID",
            value: scalewayConfig.require("access_key"),
          },
          { name: "SENTRY_AUTH_TOKEN", secretRef: "sentry-auth-token" },
          { name: "SENTRY_PROJECT", value: sentryProjectSyncServer.name },
          { name: "SENTRY_ORG", value: sentryProjectSyncServer.organization },
          { name: "SENTRY_DSN", value: sentryKeyEditor.dsnPublic },
        ],
      },
    ],
    scale: {
      maxReplicas: 5,
      minReplicas: 1,
      rules: [
        {
          custom: {
            metadata: {
              concurrentRequests: "50",
            },
            type: "http",
          },
          name: "httpscalingrule",
        },
      ],
    },
  },
});

const gotenbergPdfEngine = new app.ContainerApp("pdf-engine", {
  environmentId: environment.id,
  location: resourceGroup.location,
  resourceGroupName: resourceGroup.name,
  configuration: {
    secrets: [{ name: "pwd", value: adminPassword }],
    registries: [
      {
        server: "miotoregistry.azurecr.io",
        username: adminUsername,
        passwordSecretRef: "pwd",
      },
    ],
    ingress: {
      external: true,
      targetPort: 3000,
      transport: "auto",
    },
    activeRevisionsMode: "Single",
  },
  template: {
    containers: [
      {
        image: config.require("pdf_engine_image"),
        name: "pdf-engine",
      },
    ],
    scale: {
      maxReplicas: 5,
      minReplicas: 1,
      rules: [
        {
          custom: {
            metadata: {
              concurrentRequests: "50",
            },
            type: "http",
          },
          name: "httpscalingrule",
        },
      ],
    },
  },
});

const SYNCSERVER_HTTP_ENDPOINT = syncServer.latestRevisionFqdn.apply(
  (val) => `https://${val}`,
);

const SYNCSERVER_ENDPOINT = syncServer.latestRevisionFqdn.apply(
  (val) => `wss://${val}`,
);
const GOTENBERG_ENDPOINT = gotenbergPdfEngine.latestRevisionFqdn.apply(
  (val) => `https://${val}`,
);
const DOCS_ENDPOINT = docsContainer.latestRevisionFqdn.apply(
  (val) => `https://${val}`,
);

const miotoEditor = new app.ContainerApp("editor", {
  environmentId: environment.id,
  location: resourceGroup.location,
  resourceGroupName: resourceGroup.name,
  identity: {
    type: "SystemAssigned",
  },
  configuration: {
    ingress: {
      external: true,
      targetPort: 3000,
      transport: "auto",
    },
    secrets: [
      { name: "pwd", value: adminPassword },
      { name: "sentry-auth-token", value: sentryKeyEditor.secret },
      {
        name: "azure-openai-api-key",
        value: openaiKey?.apply((val) => {
          if (!val) {
            throw new Error("Open AI api key could not be found.");
          }
          return val;
        }),
      },
      {
        name: "azure-email-connection-string",
        value: emailConnectionString?.apply((val) => {
          if (!val) {
            throw new Error("Email connection string could not be found.");
          }
          return val;
        }),
      },
      {
        name: "aws-s3-secret",
        value: scalewayConfig.requireSecret("secret_key"),
      },
      {
        name: "access-token-secret",
        value: config.requireSecret("access_token_secret"),
      },
      {
        name: "refresh-token-secret",
        value: config.requireSecret("refresh_token_secret"),
      },
      {
        name: "database-url",
        value: dbConnectionString,
      },
      { name: "dotenv-key", value: config.requireSecret("dotenv-key") },
      { name: "posthog-token", value: config.requireSecret("posthog_token") },
      { name: "azure-storage-key", value: storageKey },
      { name: "azure-client-secret", value: spPassword.value },
    ],
    registries: [
      {
        server: "miotoregistry.azurecr.io",
        username: adminUsername,
        passwordSecretRef: "pwd",
      },
    ],
    activeRevisionsMode: "Single",
  },
  template: {
    containers: [
      {
        image: config.require("editor_image"),
        name: "editor",
        env: [
          { name: "AZURE_CLIENT_ID", value: appSP.clientId },
          { name: "AZURE_TENANT_ID", value: azureConfig.tenantId },
          { name: "AZURE_CLIENT_SECRET", secretRef: "azure-client-secret" },
          { name: "SENTRY_AUTH_TOKEN", secretRef: "sentry-auth-token" },
          {
            name: "AZURE_OPENAI_API_KEY",
            secretRef: "azure-openai-api-key",
          },
          {
            name: "AZURE_EMAIL_CONNECTION_STRING",
            secretRef: "azure-email-connection-string",
          },
          {
            name: "AWS_S3_SECRET_ACCESS_KEY",
            secretRef: "aws-s3-secret",
          },
          {
            name: "ACCESS_TOKEN_SECRET",
            secretRef: "access-token-secret",
          },
          {
            name: "REFRESH_TOKEN_SECRET",
            secretRef: "refresh-token-secret",
          },
          {
            name: "DATABASE_URL",
            secretRef: "database-url",
          },
          { name: "APP_ENV", value: "production" },
          { name: "SENTRY_PROJECT", value: sentryProjectEditor.name },
          { name: "SENTRY_ORG", value: sentryProjectEditor.organization },
          { name: "SENTRY_DSN", value: sentryKeyEditor.dsnPublic },
          { name: "AZURE_STORAGE_KEY", secretRef: "azure-storage-key" },
          { name: "AZURE_STORAGE_ACCOUNT", value: storageAccount.name },
          { name: "AZURE_STORAGE_CONTAINER", value: storageContainer.name },
          {
            name: "AWS_S3_ACCESS_KEY_ID",
            value: scalewayConfig.require("access_key"),
          },
          { name: "CONTACT_EMAIL", value: config.require("contact_email") },
          {
            name: "WITH_EMAIL_SERVICE",
            value: config.get("with_email_service"),
          },
          {
            name: "JWT_ACCESS_EXPIRATION_MINUTES",
            value: config.get("jwt_access_expiration_minutes"),
          },
          {
            name: "JWT_REFRESH_EXPIRATION_DAYS",
            value: config.get("jwt_refresh_expiration_days"),
          },
          {
            name: "RESET_PASSWORD_EXPIRATION_MINUTES",
            value: config.get("specialized_token_expiration_minutes"),
          },
          {
            name: "VERIFY_EMAIL_EXPIRATION_MINUTES",
            value: config.get("specialized_token_expiration_minutes"),
          },
          {
            name: "FILE_UPLOAD_EXPIRATION_MINUTES",
            value: config.get("specialized_token_expiration_minutes"),
          },
          {
            name: "GOTENBERG_ENDPOINT",
            value: GOTENBERG_ENDPOINT,
          },
          {
            name: "SYNCSERVER_ENDPOINT",
            value: SYNCSERVER_ENDPOINT,
          },
          {
            name: "SYNCSERVER_HTTP_ENDPOINT",
            value: SYNCSERVER_HTTP_ENDPOINT,
          },
          {
            name: "DOCS_ENDPOINT",
            value: config.require("docs_endpoint"),
          },
          { name: "CLIENT_ENDPOINT", value: config.require("client_endpoint") },
          {
            name: "SENDER_EMAIL",
            value: config.require("sender_email"),
          },
          {
            name: "DOTENV_PRIVATE_KEY_PRODUCTION",
            secretRef: "dotenv-key",
          },
          { name: "POSTHOG_TOKEN", secretRef: "posthog-token" },
          {
            name: "REGISTER_ACCESS_CODES",
            value: config.get("register_access_codes"),
          },
        ],
      },
    ],
    initContainers: [
      {
        image: databaseMigrationImage.ref,
        name: "migrator",
        env: [
          {
            name: "DATABASE_URL",
            secretRef: "database-url",
          },
        ],
      },
    ],
    scale: {
      maxReplicas: 5,
      minReplicas: 1,
      rules: [
        {
          custom: {
            metadata: {
              concurrentRequests: "50",
            },
            type: "http",
          },
          name: "httpscalingrule",
        },
      ],
    },
  },
});
