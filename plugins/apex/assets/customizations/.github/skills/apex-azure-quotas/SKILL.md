---
name: apex-azure-quotas
description: '**UTILITY SKILL** — Interprets accepted Azure quota and SKU availability evidence for APEX capacity decisions; neither proves allocation capacity. WHEN: "check quotas", "quota exceeded", "vCPU limit", "service limits", "SKU availability", "SKU restrictions", "compare regions for capacity". DO NOT USE FOR: VM size selection (use apex-azure-compute), cost analysis (use apex-azure-cost-optimization).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Quota Guidance

Use this skill for an active APEX planning or validation task that needs a capacity decision. Only
capability-produced, accepted quota and availability evidence in `apex/taskContext` is authoritative. During
Architecture, regional availability and quota are recorded assumptions, not checks; this skill applies when a later
task supplies capacity evidence.

## Three Separate Checks

| Check | Question | Evidence |
| --- | --- | --- |
| Quota headroom | Does the subscription limit leave room for the demand? | Provider quota resource, limit, usage, unit |
| SKU availability | Is the SKU offered to this subscription in the region and required zones? | SKU listing with restrictions and zones |
| Allocation capacity | Will the platform place the resources now? | Unknown until deployment |

Each check is independent. A sufficient quota does not prove the SKU is offered, and an offered SKU with quota can still
fail allocation at deployment. None of them is deployment approval.

## Prerequisites

- The task specifies the resource demand, provider, candidate region, required zones, and target subscription.
- Accepted evidence identifies the quota resource, limit, usage, unit, observation time, and scope for each evaluated
  region, and the SKU availability status when the decision depends on it.

Return a blocker when evidence is missing, stale, incomplete, or outside the requested provider, subscription, region,
or resource boundary. Do not assume a quota value or infer a quota resource name from an ARM resource type.

Read-only checks with the Azure CLI need Azure CLI 2.50 or later signed in with `az login`, the `quota` extension
(`az extension add --name quota`) and `Reader` on the scope. Submitting an increase needs `Quota Request Operator`,
held by the identity that runs the routed change.

## Workflow

1. Confirm the evidence scope matches the deployment intent and each candidate region.
2. Verify the capability resolved the provider-specific quota resource rather than relying on an ARM type-name
   assumption.
3. Calculate remaining capacity as `limit - (usage + requested demand)` for each applicable quota, including both
   family and total regional limits where both apply.
4. Treat a negative result as a capacity blocker; a result of zero exactly consumes the remaining quota and is still
   sufficient. Distinguish either case from a service hard limit or an unavailable quota surface.
5. Apply the SKU availability status contract in [SKU availability](references/sku-availability.md) when the decision
   names a SKU or zones.
6. Compare only regions with equally fresh, compatible evidence and preserve the selected region's evidence identifier
   in the typed decision.
7. Route insufficient capacity to an authorized quota-request or deployment planning path with a proposed buffer. The
   increase is a routed change (see below); never submit it from this skill.

## Azure CLI and azd

[Quota CLI commands](references/quota-cli-commands.md) and [quota workflows](references/quota-workflows.md) keep the
upstream `az quota` commands, and [SKU availability](references/sku-availability.md) keeps the per-service listing
commands.

- **Read and diagnostic** commands (`az quota list`, `az quota show`, `az quota usage list|show`,
  `az quota request status list|show`, `az vm list-skus`, `az provider show`) may run directly against the approved
  subscription and region. Their output is an observation; a typed capacity decision still cites accepted evidence
  from `apex/taskContext`.
- **Commands that change Azure** (`az quota update`, `az quota create`, `az provider register`) are never run by the
  agent. They reach Azure only through `apex preview`, the current runtime's Gate 4 decision and `apex deploy` (Bicep
  or Terraform). A CI-owned production run with human approval verified before apply is a planned target
  (DECISION-036), not available today. References mark these commands with `# Changes Azure`.

## Boundaries

- This skill does not select subscriptions, submit quota increases, register providers, configure alerts, or alter
  resources or files. Live quota and usage reads are observations, not accepted evidence.
- Quota sufficiency is not a deployment approval, price estimate, or service availability guarantee.
- A capacity claim may not be extended beyond the accepted provider, region, resource family, subscription, and
  observation time.

## References

- [Quota CLI commands](references/quota-cli-commands.md) - `az quota` command reference, evidence and fallback,
  checked headroom helper, name mapping, and troubleshooting.
- [Quota workflows](references/quota-workflows.md) - check, compare regions, routed increase, and list workflows.
- [Capacity decision rules](references/capacity-decision-rules.md) - scope, resource-name mapping, calculation,
  failure classification, and outcomes.
- [SKU availability](references/sku-availability.md) - status contract, per-service evidence, and deployment-time
  allocation failures.
- [Operational checklist](references/operational-checklist.md) - mapping, capacity comparison, and unavailable-surface
  handling.
