> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure Service Bus SDK — JavaScript

Package: `@azure/service-bus` |
[README](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/servicebus/service-bus/) | [Full Troubleshooting
Guide](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/servicebus/service-bus/TROUBLESHOOTING.md)

## Common Errors

| Error Code | Cause | Fix |
|------------|-------|-----|
| `ServiceTimeout` | Service didn't respond; or no unlocked sessions | Transient — auto-retried. Verify state if persists |
| `MessageLockLost` | Processing exceeded lock duration or link detached | Reduce processing time, ensure autolock renewal works |
| `SessionLockLost` | Session lock expired or link detached | Re-accept session, keep renewing lock |
| `QuotaExceeded` | Too many concurrent receives | Reduce receivers or use batch receives |
| `MessageSizeExceeded` | Message or batch > max size | Reduce payload. Premium supports individual messages up to 100MB. Batch limit is computed from max message size on the client, so batches can also be impacted |
| `UnauthorizedAccess` | Bad credentials | Verify connection string, SAS, or RBAC roles |

`ServiceBusError` fields: `code`, `retryable`, `name`, `info`, `address`.

## Enable Logging

```bash
# All SDK logs
export AZURE_LOG_LEVEL=verbose

# Or granular control
export DEBUG="azure*,rhea*"

# Errors only
export DEBUG="azure:service-bus:error,azure:core-amqp:error,rhea-promise:error,rhea:events,rhea:frames,rhea:io,rhea:flow"
```

Log to file:

```bash
node app.js > out.log 2>debug.log
```

`rhea:frames` and `rhea:io` log raw AMQP frames that can contain message payloads and credentials, and `verbose` logs
can too. Enable them only with explicit task authorization, and keep only redacted excerpts as evidence.

## Key Issues

- **Socket exhaustion**: Treat `ServiceBusClient` as singleton. Each creates a new AMQP connection. Always call `close()`.
- **Lock lost before expiry**: Can happen on link detach (transient network issue or 10-min idle timeout). Not always
  due to processing time.
- **Batch receive returns fewer messages**: After first message arrives, receiver waits only 1s for additional messages.
  `maxWaitTimeInMs` controls wait for the *first* message only.
- **Autolock renewal not working**: Ensure system clock is accurate. Autolock relies on system time.
- **Batch size limits**: Batch limit is artificially computed on the client from the max message size sent by the
  service. Send large messages individually if batch creation fails.
- **WebSockets**: Pass `webSocketOptions` to `ServiceBusClient` constructor for port 443 connectivity.
- **Distributed tracing**: Experimental OpenTelemetry support via `@azure/opentelemetry-instrumentation-azure-sdk`.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/messaging/azure-servicebus-js.md).
Load only the reference needed for the active task.
