<!-- ref:plan-template-v1 -->

# Preparation Binding Fields

Adapted from the upstream plan template at `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). Preserve the useful information model, not its Markdown lifecycle.
Do not create a generic plan file or set Planning/Approved/Validated/Deployed status.

## Content Map

| Content | Accepted source or owning task |
| --- | --- |
| Project goal; new, modify or modernize scope | Requirements, including user-work preservation boundaries |
| Classification, scale, budget, recovery objectives | Accepted workload decisions; do not infer an SKU from labels |
| Tenant/subscription, environment and location | Confirmed target in task context; defaults alone are not confirmation |
| Components, frontend/API/worker roles, technologies and paths | Authorized inspection receipt or explicit accepted inputs |
| Recipe rationale, infrastructure language and application host | One selected-track binding and accepted architecture |
| Component-to-service mapping and supporting services | Architecture, identity, networking, diagnostics and recovery decisions |
| Resource demand, quantities, quota units and allocation assumptions | Explicit task assumptions or accepted quota evidence |
| Deployment-neutral intent, dependencies, ownership and controls | Accepted implementation plan |
| Provider APIs/modules, exact locks, parameters, secret references and outputs | Selected-track binding |
| Generated file identities and source-tree hash | CodeGen receipt, never a hand-written file list as proof |
| Validation commands, outcomes, timestamps and scope | Accepted validation evidence; unperformed checks stay unperformed |
| Preview, operation, recipient and approval binding | Kernel preview and Gate 4, never an outline checkbox |
| Observed deployment outputs and operational readiness | Accepted completed-operation evidence, not planned endpoints |

## Provisioning Demand and Evidence

Keep a demand table with resource type, proposed quantity, normalized units, existing usage, applicable limit,
subscription/region, quota name, source/time and diagnostic uncertainty. Do not populate blank evidence with “zero”.

For a task requiring quota diagnostics, the read-only command shapes are:

```bash
az quota list --scope "/subscriptions/<subscription>/providers/<provider>/locations/<region>"
az quota show --resource-name "<quota-name>" \
  --scope "/subscriptions/<subscription>/providers/<provider>/locations/<region>"
az quota usage show --resource-name "<quota-name>" \
  --scope "/subscriptions/<subscription>/providers/<provider>/locations/<region>"
```

A generic `BadRequest` does not prove unsupported capability. Diagnose scope, parameters, permissions and provider
support first. Only then use a service-specific live limit/usage source or documented Portal/support confirmation.
Published defaults are not observed subscription limits.

For a documented count quota only, Resource Graph can observe counts:

```bash
az graph query --subscriptions "<subscription>" \
  -q "resources | where type == '<ARM-type>' and location == '<region>' | count"
```

Omit the region filter for subscription-wide quotas. Counts are not vCPU usage: normalize maximum VM/pool instance
counts by accepted SKU vCPUs, including autoscale/surge, and check both family and regional totals.
Quota headroom does not prove SKU restrictions or physical allocation. Architecture records explicit assumptions;
deployment-readiness obligations are enforced only by the active kernel task.

Read [limits and quotas](resources-limits-quotas.md), [availability](region-availability.md) and
[Azure quotas](../../apex-azure-quotas/SKILL.md) when needed. No quota-increase command is authorized by this reference.
