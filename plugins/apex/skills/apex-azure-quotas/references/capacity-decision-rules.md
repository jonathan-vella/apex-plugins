# Quota Capacity Decision Rules

Use accepted quota evidence as a scoped snapshot. The evidence must identify
the provider, subscription, region, quota resource, limit, usage, unit, and
observation time.

## Resource Mapping

An ARM resource type does not have a universal one-to-one relationship with a
quota resource. One resource type can consume a family quota, a regional
resource-count quota, or multiple quotas. Accept only capability-produced
mapping evidence that names the evaluated quota resource and its unit.

Treat the following as blockers:

- No resolved quota resource for the requested demand.
- A mapping for a different provider, resource family, or region.
- Ambiguous units between demand, usage, and limit.
- Evidence that has passed its declared freshness limit.

## Capacity Calculation

For each required quota, calculate:

`remaining capacity = limit - (current usage + requested demand)`

Capacity is sufficient only when every required quota has positive remaining
capacity after the requested demand. Preserve the inputs and result in the
typed planning decision so later validation can repeat the interpretation.

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

## Provider And Troubleshooting Boundary

Record provider support, extension or command failure, invalid scope, unavailable quota surface, and service hard-limit
signals as evidence gaps or blockers. CLI discovery, command execution, monitoring configuration, and quota-increase
workflows are deferred provider capabilities. A troubleshooting note must not turn into a command or a request action.
