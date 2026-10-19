> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure Service Bus SDK — Java

Package: `azure-messaging-servicebus` |
[README](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/servicebus/azure-messaging-servicebus/) | [Full
Troubleshooting
Guide](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/servicebus/azure-messaging-servicebus/TROUBLESHOOTING.md)

## Common Errors

| Exception | Cause | Fix |
|-----------|-------|-----|
| `AmqpException` (unauthorized-access) | Bad credentials or missing permissions | Verify connection string, SAS, or RBAC roles |
| `AmqpException` (connection:forced) | Idle connection or transient network issue | Auto-recovers; no action needed |
| `ServiceBusException` (MESSAGE_LOCK_LOST) | Lock expired during processing | Reduce processing time, disable auto-complete, settle manually |

## Key Issues

### Processor hangs with high prefetch + maxConcurrentCalls

`Update disposition request timed out.` — Client stops processing new messages.

**Cause**: Thread starvation when thread pool size ≤ `maxConcurrentCalls`.

**Fix**:

```bash
# Increase reactor thread pool
-Dreactor.schedulers.defaultBoundedElasticSize=<value greater than concurrency>
```

Also set `prefetchCount(0)` to disable prefetch. This is more frequent in AKS environments.

### Implicit prefetch in ServiceBusReceiverClient

Even with prefetch disabled in the builder, `receiveMessages` API can re-enable prefetch implicitly. See [SyncReceiveAndPrefetch](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/SyncReceiveAndPrefetch.md).

### Autocomplete issues

Autocomplete and auto-lock-renewal have known issues with buffered/prefetched messages.

**Fix**: Use `disableAutoComplete()` and `.maxAutoLockRenewalDuration(Duration.ZERO)`, then settle messages explicitly.

## Enable Logging

Configure via SLF4J:

```xml
<logger name="com.azure.messaging.servicebus" level="DEBUG"/>
```

See [Java SDK logging
docs](https://learn.microsoft.com/azure/developer/java/sdk/troubleshooting-messaging-service-bus-overview) for details.

## Filing Issues

Include: namespace tier, entity type/config, machine specs, max heap (`-Xmx`), `maxConcurrentCalls`, `prefetchCount`,
autoComplete setting, traffic pattern, and DEBUG-level logs (±10 min from issue).

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/messaging/azure-servicebus-java.md).
Load only the reference needed for the active task.
