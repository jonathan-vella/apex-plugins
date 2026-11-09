---
name: apex-azure-compute
description: '**ANALYSIS SKILL** — Recommends Azure VM families and VM Scale Set designs for APEX architecture and planning decisions, priced read-only. WHEN: "recommend VM size", "choose Azure VM", "GPU VM", "compare VM sizes", "VMSS vs VM", "autoscale VMs". DO NOT USE FOR: quota or SKU availability evidence (use apex-azure-quotas), deployed cost optimization (use apex-azure-cost-optimization).'
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
- **Price through the read-only tool.** Use `apex-azure/pricing` with command `pricing_get`. A scale set adds no charge
  of its
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

## Pricing Source

Use only the guarded `apex-azure/pricing` command `pricing_get`, following the central
[retail pricing contract](../apex-azure-defaults/references/retail-pricing.md). Do not query the Retail Prices API
directly or use a CLI/REST fallback when the guarded command is unavailable. Regional availability and quota remain
separate evidence, interpreted through `apex-azure-quotas`.

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
- [Azure Retail Prices API](references/retail-prices-api.md) - explains why managed APEX uses guarded MCP pricing
  instead of direct API queries.
