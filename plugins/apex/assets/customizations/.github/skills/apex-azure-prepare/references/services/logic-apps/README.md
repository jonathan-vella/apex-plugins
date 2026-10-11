> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Logic Apps

Low-code workflow automation and integration platform.

## When to Use

- Integration-heavy workloads
- Business process automation
- Connecting multiple SaaS services
- Approval and human workflow processes
- Low-code/visual workflow design
- Event-driven orchestration

## Deployment Note

Logic Apps are typically deployed as infrastructure, not application services:

```yaml
# Logic Apps are defined in Bicep infrastructure
```

## Required Supporting Resources

| Resource        | Purpose                        |
| --------------- | ------------------------------ |
| Storage Account | Workflow state (Standard only) |
| Log Analytics   | Monitoring                     |
| API Connections | External service connections   |

## Consumption vs Standard

| Feature        | Consumption      | Standard           |
| -------------- | ---------------- | ------------------ |
| Pricing        | Per execution    | App Service Plan   |
| VNET           | Limited          | Full support       |
| State          | Azure-managed    | Custom storage     |
| Deployment     | ARM/Bicep        | VS Code deployment |
| Multi-workflow | One per resource | Multiple per app   |

## References

- [Bicep Patterns](bicep.md)
- [Triggers](triggers.md)
