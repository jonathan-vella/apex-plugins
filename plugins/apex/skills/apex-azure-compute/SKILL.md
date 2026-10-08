---
name: apex-azure-compute
description: "Assess Azure VM and VM Scale Set choices for active APEX architecture or planning tasks. Use for compute families, capacity, pricing evidence, and VMSS trade-offs."
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Compute

Use this skill only for an active architecture or planning task. It records a bounded compute recommendation; it does
not provision, configure, or operate Azure resources.

## Prerequisites

- `apex/taskContext` identifies the active task, target environment, and workload intent.
- Workload, availability, scaling, region, operating system, and budget are known or explicitly unresolved.
- Current pricing, quota, availability, and documentation evidence is available when the decision needs it.

## Workflow

1. Select a VM or VMSS model and candidate families with [Compute selection](references/compute-selection.md) and
   [Recommendation and scale rules](references/recommendation-and-scale-rules.md).
2. Obtain current, read-only pricing and availability evidence for the target region.
3. Record the selected model, capacity range, evidence time, assumptions, and rejected alternatives in the typed artifact.
4. Return missing or stale evidence as a blocker; submit no state change except through APEX MCP.

## Boundaries

- This skill is advisory; it does not execute commands, edit files, or invoke Azure control-plane operations.
- A capability may supply accepted read-only evidence. Evidence never replaces governance, approval, or deployment checks.
- CodeGen may generate IaC only after kernel authorization.

## References

- [Compute selection](references/compute-selection.md) - VM/VMSS and family trade-offs.
- [Pricing evidence](references/pricing-evidence.md) - comparison method and uncertainty rules.
- [Recommendation and scale rules](references/recommendation-and-scale-rules.md) - source-derived family, VMSS, and
  evidence rules without price lookup operations.
