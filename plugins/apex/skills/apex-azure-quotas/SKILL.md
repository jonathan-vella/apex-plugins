---
name: apex-azure-quotas
description: "Guide APEX capacity planning from accepted Azure quota evidence. Use for limits and region comparisons."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Quota Guidance

Use this skill for an active APEX planning or validation task that needs a
capacity decision. Only capability-produced, accepted quota and availability
evidence in `apex/taskContext` is authoritative.

## Prerequisites

- The task specifies the resource demand, provider, candidate region, and
  target subscription.
- Accepted evidence identifies the quota resource, limit, usage, observation
  time, and scope for each evaluated region.

Return a blocker when quota evidence is missing, stale, incomplete, or outside
the requested provider, subscription, region, or resource boundary. Do not
assume a quota value or infer a quota resource name from an ARM resource type.

## Workflow

1. Confirm the evidence scope matches the deployment intent and each candidate
   region.
2. Verify the capability resolved the provider-specific quota resource rather
   than relying on an ARM type-name assumption.
3. Calculate available capacity as `limit - (usage + requested demand)` for
   each applicable quota.
4. Treat a negative result as a capacity blocker; a result of zero exactly
   consumes the remaining quota and is still sufficient. Distinguish either
   case from a service hard limit or an unavailable quota surface.
5. Compare only regions with equally fresh, compatible evidence and preserve
   the selected region's evidence identifier in the typed decision.
6. Route insufficient capacity to an authorized quota-request or deployment
   planning path; do not request increases from this skill.

## Boundaries

- This skill does not discover quotas, check live usage, select subscriptions,
  request increases, configure alerts, or alter resources or files.
- Quota sufficiency is not a deployment approval, price estimate, or service
  availability guarantee.
- A capacity claim may not be extended beyond the accepted provider, region,
  resource family, subscription, and observation time.

## References

- [Capacity decision rules](references/capacity-decision-rules.md) - scope,
  resource-name mapping, calculation, and outcomes.
- [Operational checklist](references/operational-checklist.md) -
   mapping, capacity comparison, and unavailable-surface handling.
