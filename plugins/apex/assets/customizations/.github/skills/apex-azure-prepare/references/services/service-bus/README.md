> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Service Bus

Enterprise messaging with queues and pub/sub topics.

## When to Use

- Reliable message delivery
- Pub/sub messaging patterns
- Message ordering requirements
- Dead-letter handling
- Transaction support
- Enterprise integration

## Required Supporting Resources

| Resource      | Purpose                                      |
| ------------- | -------------------------------------------- |
| None required | Service Bus is self-contained                |
| Identity      | Managed identity with Service Bus data roles |

## SKU Selection

| SKU      | Features                    | Use Case                    |
| -------- | --------------------------- | --------------------------- |
| Basic    | Queues only, 256KB messages | Simple messaging            |
| Standard | Topics, 256KB messages      | Pub/sub patterns            |
| Premium  | 100MB messages, VNET, zones | Enterprise, high throughput |

## Environment Variables

### Managed Identity (Recommended)

| Variable                              | Value                                |
| ------------------------------------- | ------------------------------------ |
| `SERVICEBUS__fullyQualifiedNamespace` | `<namespace>.servicebus.windows.net` |
| `SERVICEBUS_NAMESPACE`                | Namespace name (for SDK)             |
| `SERVICEBUS_QUEUE`                    | Queue name                           |

**Required RBAC roles:**

- `Azure Service Bus Data Sender` (69a216fc-b8fb-44d8-bc22-1f3c2cd27a39) - for sending
- `Azure Service Bus Data Receiver` (4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0) - for receiving

Connection strings and SAS keys are not part of the contract for new work; the namespace disables local authentication.

## References

- [Bicep Patterns](bicep.md)
- [Messaging Patterns](patterns.md)
