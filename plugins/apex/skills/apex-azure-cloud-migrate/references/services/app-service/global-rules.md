> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Global Rules

These rules apply to ALL phases of App Service migration.

## Destructive Action Policy

These actions need their owning authorized task/capability. Remote mutations, destructive or not, require a fresh
preview, current Gate 4 and trusted execution; a chat confirmation is not approval:

- Deleting files or directories
- Overwriting existing code
- Deploying to production environments
- Modifying existing Azure resources
- Removing source-platform resources

## User Confirmation Required

Request missing user-owned choices through the kernel input contract before:

- Selecting Azure subscription
- Selecting Azure region/location
- Accepting deployment scope (execution still needs Gate 4)
- Accepting breaking changes for an authorized implementation task
- Choosing App Service Plan tier (Free, Basic, Standard, Premium)

## Best Practices

- Always use `mcp_azure-mcp_get_azure_bestpractices` tool before generating Azure code
- Prefer managed identity over connection strings or API keys
- **Always use the latest supported runtime stack** — see the App Service [language support
  policy](https://learn.microsoft.com/azure/app-service/language-support-policy) for the supported stacks page per
  language
- Follow Azure naming conventions
- Compare Premium/Standard capabilities with workload evidence; the accepted workload decision manifest selects the SKU
- Enable health checks and diagnostic logging from day one

## Identity-First Authentication (Zero Secrets)

> Enterprise subscriptions commonly enforce policies that block local auth. Always design for identity-based access from
> the start.

- **Storage accounts**: Use identity-based connections with `DefaultAzureCredential`
- **Databases**: Use Microsoft Entra authentication for Azure SQL and PostgreSQL Flexible Server
- **Key Vault**: Use Key Vault references in App Settings (`@Microsoft.KeyVault(SecretUri=...)`)
- **Application Insights**: The connection string supplies endpoint metadata, not authorization. For Entra-authenticated
  ingestion, use a supported SDK/agent and managed identity, declare the required telemetry role and validate support.
  Do not enable local authentication to make an unsupported client work
- **DefaultAzureCredential with UAMI**: Always pass `managedIdentityClientId` explicitly:

  ```javascript
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  });
  ```

## App Service Specifics

- **Always enable HTTPS Only** — set `httpsOnly: true` in Bicep
- **Use 64-bit worker** for production — set `use32BitWorkerProcess: false`
- **Enable Always On** for Standard tier and above to prevent idle unload
- **Configure health check path** — `/healthz` or equivalent endpoint
- **Use deployment slots** for zero-downtime deployments in Standard tier+
- **Set minimum TLS to 1.2** — `minTlsVersion: '1.2'`
- **Enable HTTP/2** and preserve the canonical security baseline
- **Enable managed identity** — prefer User Assigned for multi-resource scenarios
- **Use App Configuration** for shared settings across environments
- **Use Key Vault** for secrets — never store secrets in App Settings directly

## Output Directory

Use only the output path authorized by the task. `<source-folder>-azure/` is an example separate project-local layout,
not permission to create files. Never modify the source directory.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/app-service/global-rules.md).
Load only the reference needed for the active task.
