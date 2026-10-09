---
name: apex-terraform-import
description: "Assess Terraform adoption of existing Azure resources in APEX. Use for scoped inventory evidence, import mapping, provider and module locks, drift assessment, and adoption attestation."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Terraform Import Assessment

Use this skill for an active Terraform adoption task concerning existing resources. It evaluates accepted inventory and
mapping evidence, then records adoption intent; authorized capabilities own discovery, configuration generation,
stateful operations, validation, and lifecycle changes.

## Prerequisites

- `apex/taskContext` identifies the accepted adoption task, target boundary, resource scope, and acceptance criteria.
- Accepted inventory evidence identifies its observation scope, completeness, redactions, and observation time.
- Required mapping, provider/module lock, and validation capability receipts are accepted and current for that target.

## Workflow

1. Apply [Import assessment](references/import-assessment.md) to match accepted inventory facts to resource mappings
   and ownership boundaries.
2. Apply [Mapping and adoption attestation](references/mapping-and-adoption-attestation.md) to bind each candidate to
   its intended address and accepted outcome evidence.
3. Record a typed adoption proposal with scoped identifiers, exact provider/module locks, expected managed identities,
   and reconciliation criteria.
4. Apply [Adoption attestation](references/adoption-attestation.md) to evaluate authorized outcomes and remaining drift.
5. Apply [Import mapping and reconciliation](references/import-mapping.md) to preserve candidate boundaries and
   expected reconciliation without generating import blocks or executing a stateful operation.
6. Route missing inventory, mapping, stateful-operation, or validation capabilities to the kernel as blockers. Never
   replace a missing receipt with inferred configuration or model memory.

## Boundaries

- Do not query cloud inventories, inspect state, generate configuration, invoke Terraform, or mutate files.
- Do not perform import, preview, apply, or deployment actions.
- Import assessment does not establish ownership, compliance, a drift-free result, or deployment authorization without
  accepted evidence.

## References

- [Import assessment](references/import-assessment.md) - scoped inventory, mappings, locks, and adoption intent.
- [Mapping and adoption attestation](references/mapping-and-adoption-attestation.md) - candidate-to-address evidence
   and outcome review.
- [Adoption attestation](references/adoption-attestation.md) - receipt requirements, reconciliation, and handoff.
- [Import mapping and reconciliation](references/import-mapping.md) - candidate records, drift review, and blocked
   operations.
