# Quota Capacity Decision Rules

Use accepted quota evidence as a scoped snapshot. The evidence must identify
the provider, subscription, region, quota resource, limit, usage, unit, and
observation time.

## Resource Mapping

An ARM resource type does not have a universal one-to-one relationship with a
quota resource. One resource type can consume a family quota, a regional
resource-count quota, or multiple quotas. Accept only capability-produced
mapping evidence that names the evaluated quota resource and its unit.

Known mappings are hints for checking a capability result, not a catalog:

| ARM resource type | Quota resources it can consume |
| --- | --- |
| `Microsoft.Compute/virtualMachines` | A VM family vCPU quota, the total regional vCPU quota, and a VM count |
| `Microsoft.App/managedEnvironments` | A managed-environment count |
| `Microsoft.Network/publicIPAddresses` | Public IP address counts, including SKU-specific counts |

Treat the following as blockers:

- No resolved quota resource for the requested demand.
- A mapping for a different provider, resource family, or region.
- Ambiguous units between demand, usage, and limit.
- Evidence that has passed its declared freshness limit.

## Capacity Calculation

For each required quota, calculate:

`remaining capacity = limit - (current usage + requested demand)`

Capacity is sufficient only when every required quota has nonnegative
remaining capacity after the requested demand; an exact fit (remaining
capacity of zero) still passes. Preserve the inputs and result in the typed
planning decision so later validation can repeat the interpretation.

## Decision Outcomes

| Evidence outcome | Planning result |
| --- | --- |
| Every required quota is sufficient | Record a bounded capacity decision for the evaluated scope. |
| A quota is insufficient | Record a blocker and route to an authorized request or region decision. |
| A quota is fixed by a service limit | Record the blocker; do not call it an adjustable quota. |
| Provider or quota surface is unsupported | Record an evidence gap and require a capability result. |

Do not compare regions using different demand assumptions, units, or freshness
windows. A regional comparison is a decision aid, not an authorization to
change the target region.

## Failure Classification

| Signal | Classification |
| --- | --- |
| A "No Limit" or "Unlimited" value without a numeric limit | Unknown quota, not unlimited capacity |
| Unsupported provider, resource, region, or API version | Evidence gap; the same provider through another surface is not a bypass |
| Invalid scope or arguments | Evidence gap; the capability must correct the scope |
| Quota provider not registered for the subscription | Evidence gap; registration needs separate approval |
| Requested demand exceeds the limit | Capacity blocker; propose an increase or region change for approval, neither of which guarantees allocation |

Coverage is specific to resource type, region, subscription, and API version. Unavailable evidence stays unknown.

## Provider And Troubleshooting Boundary

Record provider support, extension or command failure, invalid scope, unavailable quota surface, and service hard-limit
signals as evidence gaps or blockers. Read-only `az quota` checks may run directly, following
[quota CLI commands](quota-cli-commands.md); their output is an observation until accepted as evidence. Quota increases,
provider registration and monitoring configuration change Azure and are routed through `apex deploy` (Gate 4). A
troubleshooting note must not turn into a direct change.
