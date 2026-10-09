---
name: apex-terraform-patterns
description: "Apply approved Terraform architecture intent in APEX. Use for hub-spoke, private endpoints, diagnostics, AVM module locks, and CodeGen acceptance."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Terraform Patterns

Use this skill for an active Terraform-bound planning or CodeGen task. It records approved architecture intent and
acceptance criteria; authorized capabilities own source inspection, generation, validation, and lifecycle changes.

## Prerequisites

- `apex/taskContext` identifies an accepted Terraform track task, scoped target, and typed binding inputs.
- Architecture, governance, security, and monitoring decisions are accepted for that target.
- Required capability receipts are accepted, current, target-matched, and include the exact provider and module locks.

## Workflow

1. Select only patterns supported by accepted architecture and track bindings.
2. Apply [Network and observability](references/network-and-observability.md) for hub-spoke, private connectivity,
   and diagnostics intent.
3. Apply [Module locks and CodeGen acceptance](references/module-locks-and-codegen-acceptance.md) for AVM selection,
   exact locks, and evidence requirements.
4. Apply [Module composition and state boundaries](references/module-composition-and-state-boundaries.md) to define
   stable interfaces and record refactoring migration intent.
5. Apply [Plan and change assessment](references/plan-and-change-assessment.md) to classify proposed actions and
   surface replacement, deletion, or stateful-resource risk.
6. Submit typed intent only through an authorized capability. Treat unavailable capabilities, missing locks, stale
   receipts, or unaccepted evidence as blockers.

## Boundaries

- Do not write Terraform, inspect provider sources, resolve versions, invoke Terraform, or mutate files.
- Do not discover cloud resources, validate infrastructure, preview changes, or deploy.
- CodeGen, validation, and operations remain responsible for their own authorized receipts; pattern selection does not
  bypass policy, cost, approval, or deployment gates.

## References

- [Network and observability](references/network-and-observability.md) - hub-spoke, private endpoints, and diagnostics.
- [Module locks and CodeGen acceptance](references/module-locks-and-codegen-acceptance.md) - AVM binding, exact
  locks, and receipt-based acceptance.
- [Module composition and refactor intent](references/module-composition-and-refactor.md) - boundary, interface, and
  state-transition review criteria.
- [Module composition and state boundaries](references/module-composition-and-state-boundaries.md) - output-to-input
  interfaces and refactoring migration intent.
- [Plan and change assessment](references/plan-and-change-assessment.md) - receipt-gated action classification and
  stateful-resource risk review.
