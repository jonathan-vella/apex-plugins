> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure Event Hubs SDK — JavaScript

Package: `@azure/event-hubs` | [README](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/eventhub/event-hubs/) |
[Full Troubleshooting
Guide](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/eventhub/event-hubs/TROUBLESHOOTING.md)

## Common Errors

| Error | Code | Fix |
|-------|------|-----|
| `MessagingError` (connection:forced) | Idle disconnect | Auto-recovers; no action needed |
| `MessagingError` (Unauthorized) | Bad credentials | Verify connection string, SAS, or RBAC roles |
| `MessagingError` (retryable: true) | Transient issue | Auto-retried per `RetryOptions`. If surfaced, all retries exhausted |

`MessagingError` fields: `name`, `code`, `retryable`, `info`, `address`, `errno`, `port`, `syscall`.

## Enable Logging

```bash
# All SDK logs
export AZURE_LOG_LEVEL=verbose

# Or use DEBUG for granular control
export DEBUG="azure*,rhea*"

# Errors only
export DEBUG="azure:*:(error|warning),rhea-promise:error,rhea:events,rhea:frames,rhea:io,rhea:flow"
```

Browser:

```javascript
localStorage.debug = "azure:*:info";
```

`rhea:frames` and `rhea:io` log raw AMQP frames that can contain message payloads and credentials, and `verbose` logs
can too. Enable them only with explicit task authorization, and keep only redacted excerpts as evidence.

## Key Issues

- **Socket exhaustion**: Treat clients as singletons. Each new client creates a new AMQP connection/socket. Always call
  `close()`.
- **412 precondition failures**: Normal during subscription partition ownership negotiation.
- **Partition ownership churn**: Expected when scaling instances. Should stabilize within minutes.
- **High CPU**: Limit to 1.5–3 partitions per CPU core.
- **Subscription stops receiving**: Often a symptom of an underlying race condition during error recovery. File a GitHub
  issue with DEBUG logs.
- **WebSockets**: Pass `webSocketOptions` to client constructor to connect over port 443.

## Checkpointing (BlobCheckpointStore)

Package: `@azure/eventhubs-checkpointstore-blob`

> **Auth:** `DefaultAzureCredential` is for local development. See [auth best
> practices](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```javascript
const { BlobCheckpointStore } = require("@azure/eventhubs-checkpointstore-blob");
const { BlobServiceClient } = require("@azure/storage-blob");

const containerClient = new BlobServiceClient(storageEndpoint, credential)
  .getContainerClient("checkpointstore");
const checkpointStore = new BlobCheckpointStore(containerClient);

const consumerClient = new EventHubConsumerClient(
  consumerGroup, fullyQualifiedNamespace, eventHubName, credential, checkpointStore
);
```

**Common issues:**

- **Soft delete / blob versioning**: Disable both on the storage account — they cause delays during load balancing.
- **412 precondition failures**: Normal during partition ownership negotiation; not an error.
- **Checkpoint frequency**: Call `updateCheckpoint()` per batch, not per event, to reduce storage calls.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/messaging/azure-eventhubs-js.md).
Load only the reference needed for the active task.
