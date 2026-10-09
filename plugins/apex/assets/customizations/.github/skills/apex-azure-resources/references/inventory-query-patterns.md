# Inventory and Query Patterns

Use this reference to specify what accepted inventory evidence must answer.
Patterns describe an evidence request; they are not instructions to execute a
query.

## Scope Contract

Every inventory interpretation needs these boundaries:

- Subscription set and resource-group filter, if any.
- Resource types and locations included or excluded.
- Observation time and declared freshness limit.
- Result limit, pagination status, and whether the result is complete.
- Query pattern, projected fields, and redaction status.

Missing boundaries make an inventory result unsuitable for broad claims. Route
the task to the resource-inventory capability with the required boundary,
rather than widening the claim.

## Pattern Selection

- **What exists?** Request an inventory grouped by type, location, or
  subscription. Counts apply only to the recorded scope and observation time.
- **What is in one resource group?** Request a resource-group inventory with
  identifying fields. It does not establish dependencies outside that group.
- **What may be unused?** Request candidates for unattached disks, unassigned
  network interfaces, idle public IPs, or empty backends. A candidate is not
  proof of safe deletion.
- **Which resources lack a tag?** Request tag coverage using the required tag
  keys. Compare those keys with accepted governance evidence.
- **Which resources expose a setting?** Request configuration posture for the
  named property. A missing or dynamic property is not a security conclusion.

## Interpretation Rules

- Preserve case-insensitive resource-type matching in the capability request.
- Use joins only when accepted evidence identifies both datasets and their
  shared scope.
- Treat index latency, pagination, and field redaction as result limitations.
- Do not turn a lookup result into a diagram, remediation plan, or compliance
  conclusion without the separate accepted evidence required for that task.

## Resource Graph Boundary

Azure Resource Graph lookup and provider-specific resource discovery are deferred capabilities. Request a bounded query
pattern and result shape, but do not execute KQL, invoke CLI or SDK tools, or infer omitted pages. Architecture diagram
templates and visualization assets are excluded from inventory guidance; visual output requires separately accepted
inventory evidence and an authorized presentation path.
