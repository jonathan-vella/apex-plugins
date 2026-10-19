> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Global Rules

These rules apply to ALL phases of the migration skill.

## Destructive Action Policy

These operations are not authorized by migration intent. Destructive and non-destructive remote mutations need the
owning capability, fresh preview, current Gate 4 and trusted execution; local overwrite/deletion needs its owning task:

- Deleting files or directories
- Overwriting existing code
- Deploying to production environments
- Modifying existing Azure resources
- Removing AWS resources

## User Confirmation Required

Request missing user-owned choices through the kernel input contract before:

- Selecting Azure subscription
- Selecting Azure region/location
- Planning deployment scope (execution still needs Gate 4)
- Accepting breaking code changes for an authorized implementation task

## Best Practices

- Always use `mcp_azure-mcp_get_azure_bestpractices` tool before generating Azure code
- Prefer managed identity over connection strings
- **Always use the latest supported language runtime** — check [supported
  languages](https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages) for the newest GA version.
  Never default to older versions
- **Always prefer bindings over SDKs** — use `input.storageBlob()`, `output.storageBlob()`, `app.storageQueue()`, etc.
  instead of `BlobServiceClient`, `QueueClient`, or other SDK clients. Only use SDK when no binding exists for the
  service
- Follow Azure naming conventions
- Treat Flex Consumption as a candidate, not an automatic selection; the accepted workload decision manifest owns
  hosting/SKU choices

## Identity-First Authentication (Zero API Keys)

> Enterprise subscriptions commonly enforce policies that block local auth. Always design for identity-based access from
> the start.

- **Storage accounts**: Set `allowSharedKeyAccess: false`. Use identity-based connections with
  `AzureWebJobsStorage__credential`, `__clientId`, and service-specific URIs (`__blobServiceUri`, `__queueServiceUri`,
  etc.)
- **Cognitive Services**: Set `disableLocalAuth: true`. Use UAMI + RBAC role (e.g., Cognitive Services User) instead of
  API keys
- **Application Insights**: Set `disableLocalAuth: true`. Use `APPLICATIONINSIGHTS_AUTHENTICATION_STRING` with `ClientId=<uamiClientId>;Authorization=AAD`
- **DefaultAzureCredential with UAMI**: When using User Assigned Managed Identity, always pass `managedIdentityClientId`
  explicitly:

  ```javascript
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
  });
  ```

  Without this, `DefaultAzureCredential` tries SystemAssigned first and fails. Add `AZURE_CLIENT_ID` as an app setting
  mapped to the UAMI client ID.

## Flex Consumption Specifics

- **Always-ready for non-HTTP triggers**: The upstream Flex Consumption scenario uses
  `alwaysReady: [{ name: "blob", instanceCount: 1 }]` to bootstrap its blob-trigger listener. Verify current
  provider/runtime behavior and cost before accepting this configuration; it is not a blanket requirement for every
  non-HTTP trigger
- **Blob trigger with EventGrid source requires queue endpoint**: The blob extension internally uses queues for
  poison-message tracking. Must include `AzureWebJobsStorage__queueServiceUri` even when using blob trigger (not queue
  trigger)
- **Event Grid subscriptions via Bicep/ARM only**: Do NOT create Event Grid event subscriptions via CLI — webhook
  validation fails on Flex Consumption with "response code Unknown". Deploy as Bicep resources using `listKeys()` to
  resolve the `blobs_extension` system key at deployment time (a secret and a recorded exception: keep it out of
  outputs, logs and reports; prefer a keyless queue hand-off or Event Grid trigger design when the workload allows)
- **azd init on non-empty directories**: `azd init --template` refuses non-empty directories. Authorized preparation may
  stage reviewed files in an approved empty project-local directory; preserve source and existing IaC

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/functions/global-rules.md).
Load only the reference needed for the active task.
