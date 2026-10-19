---
name: apex-azure-compute
description: '**ANALYSIS SKILL** — Recommends Azure VM families and VM Scale Set designs for APEX architecture and planning decisions, priced read-only. WHEN: "recommend VM size", "choose Azure VM", "GPU VM", "compare VM sizes", "VMSS vs VM", "autoscale VMs". DO NOT USE FOR: quota or SKU availability evidence (use apex-azure-quotas), cost of deployed resources (use apex-azure-cost-optimization).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Compute

Use this skill only for an active architecture or planning task. It records a bounded compute recommendation; it does
not provision, configure, or operate Azure resources.

## Prerequisites

- `apex/taskContext` identifies the active task, target environment, and workload intent.
- Workload type, CPU and memory demand, accelerator or local I/O needs, operating system, region, instance range,
  scaling, availability, and budget are known or explicitly unresolved.

Ask for a missing user-owned input through the kernel input request rather than choosing a default SKU.

## Rules

- **Single VM unless a fleet is evidenced.** Recommend a VM Scale Set only for an explicit autoscale, interchangeable
  fleet, or mixed-size requirement. Prefer Flexible orchestration for a new scale set; the mode cannot change later.
- **Candidates, not a guess.** Compare two or three compatible families. When the workload shape is balanced or
  unclear, a general-purpose family is the first candidate, not an automatic selection.
- **Verify specifications.** Bind vCPU, memory, disk, accelerator, and Spot support to current documentation evidence
  for the intended region, never to memory.
- **Price through the read-only tool.** Use `apex-azure-pricing/get_retail_prices`. A scale set adds no charge of its
  own: estimate per-instance price times the minimum and maximum instance counts.
- **Commitments are review options.** Reservations or savings plans suit long-lived production capacity; present them
  next to pay-as-you-go, never as the default.
- **Availability and quota follow the stage.** During Architecture, record regional availability and quota as
  assumptions, as the architecture stage requires. When a planning or validation task supplies accepted capacity
  evidence, interpret it with `apex-azure-quotas`.

## Workflow

1. Decide VM or VM Scale Set and shortlist families with [compute selection](references/compute-selection.md).
2. For a scale set, shape orchestration, autoscale, availability, and load balancing with
   [recommendation and scale rules](references/recommendation-and-scale-rules.md).
3. Price each candidate with [pricing evidence](references/pricing-evidence.md).
4. Present two or three options with hosting model, size, vCPU and memory, instance range, unit and monthly price,
   fit, and trade-off, then record the selected option and rejected alternatives in the typed artifact.
5. Return missing or stale evidence as a blocker; submit no state change except through APEX MCP.

## Azure CLI and azd

[Azure Retail Prices API](references/retail-prices-api.md) keeps the upstream `curl` and PowerShell price queries.

- **Read and diagnostic** calls (Retail Prices API queries, and listings such as `az vm list-skus` or
  `az vm list-sizes`) may run directly. Their output is an observation; the recommendation still cites accepted
  evidence, and `apex-azure-pricing/get_retail_prices` stays the price evidence source.
- **Commands that change Azure** (creating, resizing or scaling VMs and scale sets, autoscale rules) are never run by
  the agent. They reach Azure only through `apex preview`, the current runtime's Gate 4 decision and `apex deploy`
  (Bicep or Terraform). A CI-owned production run with human approval verified before apply is a planned target
  (DECISION-036), not available today.

## Boundaries

- This skill is advisory; it does not edit files or change Azure resources.
- Evidence never replaces governance, approval, or deployment checks. A published SKU name is not deployment
  feasibility.
- CodeGen may generate IaC only after kernel authorization.

## References

- [Compute selection](references/compute-selection.md) - VM versus VMSS, family map, and size-name decoding.
- [Recommendation and scale rules](references/recommendation-and-scale-rules.md) - orchestration, autoscale,
  networking, and the recommendation record.
- [Pricing evidence](references/pricing-evidence.md) - VM price queries, comparison basis, and uncertainty rules.
- [Azure Retail Prices API](references/retail-prices-api.md) - direct API endpoint, VM queries, filters, response
  fields, and pagination.
