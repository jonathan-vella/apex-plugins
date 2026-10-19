> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure Service Bus SDK — .NET (C#)

Package: `Azure.Messaging.ServiceBus` |
[README](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/) | [Full
Troubleshooting
Guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/TROUBLESHOOTING.md)

## Common Errors

| Exception | Reason | Fix |
|-----------|--------|-----|
| `ServiceBusException` (ServiceTimeout) | Service didn't respond | Transient — auto-retried. For session accept, means no unlocked sessions |
| `ServiceBusException` (MessageLockLost) | Lock expired or link detached | Renew lock, reduce processing time, check network |
| `ServiceBusException` (SessionLockLost) | Session lock expired | Re-accept session, renew lock before expiry |
| `ServiceBusException` (QuotaExceeded) | Too many concurrent receives | Reduce receivers or use batch receives |
| `ServiceBusException` (MessageSizeExceeded) | Message or batch too large | Reduce payload. Premium tier supports individual messages up to 100MB. Batch limit is artificially computed on the client from the max message size sent by the service, so batches can also be impacted |
| `ServiceBusException` (ServiceBusy) | Request throttled | Auto-retried with 10s backoff. See [throttling docs](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-throttling) |
| `UnauthorizedAccessException` | Bad credentials | Verify connection string, SAS, or RBAC roles |

## Exception Filtering

```csharp
try { /* receive messages */ }
catch (ServiceBusException ex) when (ex.Reason == ServiceBusFailureReason.ServiceTimeout)
{
    // Handle timeout
}
```

## Key Issues

- **Socket exhaustion**: Treat `ServiceBusClient` as singleton. Each creates a new AMQP connection. Always call `CloseAsync`/`DisposeAsync`.
- **Lock lost before expiry**: Can happen on link detach (transient network) or 10-min idle timeout.
- **Processor high concurrency**: May cause hangs with extreme concurrency settings. Test with moderate values.
- **Session processor slow switching**: Tune `SessionIdleTimeout` to reduce wait time between sessions.
- **Batch size limits**: Batch limit is artificially computed on the client from the max message size sent by the
  service. Send large messages individually if batch creation fails.
- **Transactions across entities**: Requires all entities on the same namespace. Set
  `ServiceBusClientOptions.EnableCrossEntityTransactions` to `true` and use the same `ServiceBusClient` for every sender
  and receiver in the transaction.
- **WebSockets**: Use `ServiceBusTransportType.AmqpWebSockets` when AMQP ports (5671, 5672) are blocked.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/messaging/azure-servicebus-dotnet.md).
Load only the reference needed for the active task.
