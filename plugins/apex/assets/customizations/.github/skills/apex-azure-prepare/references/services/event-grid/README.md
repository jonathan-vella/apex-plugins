> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Event Grid

Serverless event routing for event-driven architectures.

## When to Use

- Event-driven architectures
- Reactive programming patterns
- Decoupled event routing
- Near real-time event delivery
- Fan-out to multiple subscribers

## Required Supporting Resources

| Resource      | Purpose                  |
| ------------- | ------------------------ |
| None required | Event Grid is serverless |
| Key Vault     | Store topic keys         |

## Event Sources

| Type          | Description                                      |
| ------------- | ------------------------------------------------ |
| System Topics | Azure resource events (Storage, Key Vault, etc.) |
| Custom Topics | Your application events                          |
| Event Domains | Multi-tenant event management                    |

## Event Schemas

| Schema            | Use Case                      |
| ----------------- | ----------------------------- |
| Event Grid Schema | Azure native format           |
| CloudEvents 1.0   | CNCF standard, cross-platform |

## Environment Variables

| Variable                   | Value              |
| -------------------------- | ------------------ |
| `EVENTGRID_TOPIC_ENDPOINT` | Topic endpoint URL |

Publishers authenticate with managed identity and the accepted Event Grid data-plane role (for example
`EventGrid Data Sender`); no topic access key is stored. A key-based client is existing-app migration only.

## References

- [Bicep Patterns](bicep.md)
- [Subscriptions](subscriptions.md)
