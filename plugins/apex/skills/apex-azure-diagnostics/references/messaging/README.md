> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure Messaging Troubleshooting

Diagnose and resolve issues with Azure Event Hubs and Service Bus SDKs.

## Routing

| Symptom | Guide |
|---------|-------|
| Connection failures, firewall, IP/VNet, WebSocket | [service-troubleshooting.md](service-troubleshooting.md) |
| SDK-specific errors (see language below) | Language guide |

## SDK Troubleshooting by Language

- **Event Hubs**: [Python](azure-eventhubs-py.md) | [Java](azure-eventhubs-java.md) | [JS](azure-eventhubs-js.md) | [.NET](azure-eventhubs-dotnet.md)
- **Service Bus**: [Python](azure-servicebus-py.md) | [Java](azure-servicebus-java.md) | [JS](azure-servicebus-js.md) |
  [.NET](azure-servicebus-dotnet.md)

## Common Issues

| Issue | Category |
|-------|----------|
| AMQP link detach, idle timeout, connection inactive | [service-troubleshooting.md](service-troubleshooting.md) |
| Message lock lost/expired, lock renewal failures | Language-specific SDK guide |
| Session lock errors, session receiver detach | Language-specific SDK guide |
| Duplicate events, checkpoint/offset reset | Language-specific SDK guide |
| Batch >1 MB rejected, partition key conflicts | [service-troubleshooting.md](service-troubleshooting.md) |

## MCP Tools

| Tool | Use |
|------|-----|
| `mcp_azure-mcp_eventhubs` | List namespaces, hubs, consumer groups |
| `mcp_azure-mcp_servicebus` | List namespaces, queues, topics, subscriptions |
| `mcp_azure-mcp_monitor` | Query diagnostic logs with KQL |
| `mcp_azure-mcp_resourcehealth` | Check service health status |
| `mcp_azure-mcp_documentation` | Search Microsoft Learn for troubleshooting docs |

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/messaging/README.md).
Load only the reference needed for the active task.
