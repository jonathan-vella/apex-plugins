---
name: apex-terraform-patterns
description: '**UTILITY SKILL** — Apply Terraform patterns to accepted APEX intent. WHEN: "hub-spoke Terraform", "private endpoint module", "AVM-TF composition", "diagnostic settings", "plan interpretation", "module refactor". DO NOT USE FOR: Bicep (use apex-bicep-patterns), decisions (use apex-azure-adr), execution (use apex-azure-deploy).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Terraform Patterns

Use this skill for an active Terraform-bound planning or CodeGen task. It records approved architecture intent and
acceptance criteria; authorized capabilities own source inspection, generation, validation, and lifecycle changes.
Read [the authority boundary](references/kernel-boundary.md) and
[Azure defaults](../apex-azure-defaults/SKILL.md) before adapting a sample.

## Pattern Rules

- Use AVM first and exact accepted module pins. Provider constraints and the lockfile must match the binding;
  upstream `~> 4.0`/Terraform version floors are compatibility context, not permission to upgrade.
- Wire outputs to inputs; use stable keyed `for_each` for named resources, and guard optional outputs.
- Preserve platform and private-DNS ownership. Do not duplicate central or DINE-managed components.
- Prefer managed identity and Entra/OIDC backend authentication; never fall back to access keys or SAS.
- Preserve moved-block migration intent; state adoption and migration are separate authorized operations.
- Inspect set-type phantom diffs against actual actions. Use `ignore_changes` only for explicitly external ownership,
  not to hide Terraform-owned drift.
- Keep diagnostics, budget inputs and telemetry decisions aligned with the accepted policy and workload contracts.
- Apply only the exact saved plan approved at Gate 4. A script prompt or bootstrap flag is never approval.

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

- Do not independently write Terraform, initialize providers, mutate state, validate or deploy.
- Direct read/diagnostic `az` and registry reads may explain accepted inputs, not replace receipts or freshness.
- CodeGen, validation, and operations remain responsible for their own authorized receipts; pattern selection does not
  bypass policy, cost, approval, or deployment gates.

## References

- [Hub-spoke](references/hub-spoke-pattern.md), [private endpoints](references/private-endpoint-pattern.md),
  [common patterns](references/common-patterns.md), [budget](references/budget-pattern.md) and
  [module composition](references/module-composition.md) - full HCL patterns.
- [Plan interpretation](references/plan-interpretation.md), [AVM pitfalls](references/avm-pitfalls.md),
  [provider compatibility](references/avm-provider-compatibility.md) and
  [AVM authoring](references/avm-authoring-requirements.md) - action review and exact-schema requirements.
- [Refactoring](references/refactor-module.md), [Entra provider](references/azuread-pattern.md),
  [scaffold](references/project-scaffold.md), [best-practice examples](references/tf-best-practices-examples.md) and
  [CodeGen checklist](references/codegen-validation-checklist.md) - bounded generation inputs.
- [Backend bootstrap](references/bootstrap-backend-template.md) and
  [deployment script adaptation](references/deploy-script-template.md) - security and phase/state requirements,
  not direct mutation scripts.

- [Network and observability](references/network-and-observability.md) - hub-spoke, private endpoints, and diagnostics.
- [Module locks and CodeGen acceptance](references/module-locks-and-codegen-acceptance.md) - AVM binding, exact
  locks, and receipt-based acceptance.
- [Module composition and refactor intent](references/module-composition-and-refactor.md) - boundary, interface, and
  state-transition review criteria.
- [Module composition and state boundaries](references/module-composition-and-state-boundaries.md) - output-to-input
  interfaces and refactoring migration intent.
- [Plan and change assessment](references/plan-and-change-assessment.md) - receipt-gated action classification and
  stateful-resource risk review.
