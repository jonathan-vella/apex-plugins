> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Code Migration Phase

Migrate source platform web application code to Azure App Service.

## Prerequisites

- Assessment accepted; an available conversion capability and exact source/output paths are authorized by the active task
- Best practices loaded via `mcp_azure-mcp_get_azure_bestpractices` tool

## Rules

- Create all output in `<source-folder>-azure/` — never modify the source directory
- Use latest GA runtime stack for the target language
- Prefer managed identity over connection strings or API keys
- Use App Configuration for shared settings, Key Vault for secrets
- Always configure health check endpoint

## Steps

1. **Load Best Practices** — Use `mcp_azure-mcp_get_azure_bestpractices` tool for App Service guidance
2. **Create Project Structure** — Set up the project inside the output directory
3. **Migrate Application Code** — Adapt source code for App Service runtime
4. **Update Dependencies** — Replace platform-specific SDKs with Azure equivalents
5. **Configure Startup** — Set startup command or create Dockerfile
6. **Migrate Environment Variables** — Map to App Settings / App Configuration / Key Vault
7. **Configure Database Connections** — Switch to Azure database services with managed identity
8. **Add Health Check** — Implement `/healthz` endpoint for App Service health monitoring
9. **Set Up Logging** — Integrate Application Insights SDK

## Key Configuration Files

### Startup Command

For non-Docker deployments, configure the startup command in App Service:

| Runtime | Default Start | Custom Start |
|---------|--------------|--------------|
| Node.js | `npm start` | Set in Configuration → General Settings |
| Python | `gunicorn app:app` | `gunicorn --bind=0.0.0.0 --timeout 600 app:app` |
| Java | Auto-detected | `-Dserver.port=80` |
| .NET | Auto-detected | `dotnet myapp.dll` |

### Dockerfile (When Needed)

Use a Dockerfile when the app requires custom system dependencies or multi-process setups:

```dockerfile
ARG NODE_IMAGE
FROM ${NODE_IMAGE}
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

The task must supply a reviewed supported-runtime base image with an immutable digest; this example chooses neither
a runtime version nor a mutable tag.

> ⚠️ **Port**: App Service injects `PORT` env var. Always bind to `process.env.PORT || 8080`.

### Application Insights Integration

```javascript
// Add as FIRST import in entry point
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoCollectRequests(true)
  .setAutoCollectExceptions(true)
  .start();
```

## Database Migration Patterns

| Source | Azure Target | Connection Pattern |
|--------|--------------|--------------------|
| RDS PostgreSQL | Azure Database for PostgreSQL Flexible Server | Managed identity + `@azure/identity` |
| RDS MySQL | Azure Database for MySQL Flexible Server | Managed identity + `@azure/identity` |
| RDS SQL Server | Azure SQL Database | Managed identity + `@azure/identity` |
| Heroku Postgres | Azure Database for PostgreSQL Flexible Server | Managed identity |
| Cloud SQL | Azure SQL / PostgreSQL Flexible Server | Managed identity |
| MongoDB Atlas | Azure Cosmos DB for MongoDB | Connection string → managed identity |

### Managed Identity Database Connection (Node.js)

```javascript
const { DefaultAzureCredential } = require('@azure/identity');
const { Client } = require('pg');

async function main() {
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  });
  const token = await credential.getToken('https://ossrdbms-aad.database.windows.net/.default');

  const client = new Client({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: token.token,
    ssl: { rejectUnauthorized: true },
    port: 5432
  });
  await client.connect();
  // ... use client
}

main().catch(console.error);
```

> ⚠️ Wrap in `async function main()` — top-level `await` is not supported in CommonJS or many Node.js entrypoints. For
> ESM, top-level await works only with `"type": "module"` in `package.json`.

## Static Assets & CDN

If the source app serves static assets, consider:

1. **Azure Blob Storage + CDN** for static files
2. **Azure Front Door** for global distribution
3. **App Service built-in static file serving** for simple cases

## Background Workers

| Source Pattern | Azure Equivalent |
|---------------|------------------|
| Heroku Worker dyno | WebJobs (continuous) or separate Container App |
| Beanstalk Worker tier | WebJobs or Azure Functions |
| App Engine service (worker) | WebJobs or Azure Functions |
| Cron jobs | WebJobs (triggered) or Azure Functions Timer trigger |

## Handoff to apex-azure-prepare

Return accepted conversion evidence, source/output traces and unresolved requirements to the kernel-selected task.
Authorized preparation/CodeGen owns `azure.yaml`, IaC and security; validation and deployment keep their separate
receipts, preview and current Gate 4. See [workflow details](../../workflow-details.md).
Never update a parallel migration-status file or mark code complete without acceptance.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/app-service/code-migration.md).
Load only the reference needed for the active task.
