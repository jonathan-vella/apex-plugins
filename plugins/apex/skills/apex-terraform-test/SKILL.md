---
name: apex-terraform-test
description: "Design receipt-gated Terraform test intent in APEX. Use for unit and integration coverage, assertions, mocks, negative cases, and test-evidence acceptance."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Terraform Test Design

Use this skill for an active Terraform test-design or validation task. It specifies coverage and assertion intent;
authorized capabilities own test materialization, execution, environment access, and evidence production.

## Prerequisites

- `apex/taskContext` identifies the accepted Terraform binding, scoped target, test objective, and acceptance criteria.
- The exact provider and module locks are accepted for the binding under test.
- Required test or validation capability receipts are accepted and current for the same target.

## Workflow

1. Classify the requirement with [Test design](references/test-design.md): deterministic unit, negative validation,
   mock-backed behavior, or integration behavior.
2. Apply [Plan-mode and mock design](references/plan-mode-and-mock-design.md) to define deterministic scope without
   promoting mocked behavior to live-service evidence.
3. Define observable assertions, expected failures, test inputs, and isolation boundaries without assuming unobserved
   provider behavior.
4. Apply [Evidence acceptance](references/evidence-acceptance.md) to distinguish test-design intent from accepted
   execution evidence.
5. Apply [Plan-mode test design](references/plan-mode-test-design.md) for deterministic coverage. Apply-mode and
   real-provider work remain blocked until separately authorized.
6. Submit the test specification through an authorized capability. Return unavailable capabilities, absent environment
   authorization, stale locks, or incomplete evidence as blockers.

## Boundaries

- Do not write or run test files, configure providers, access environments, or mutate files.
- Do not invoke Terraform, inspect provider registries, query cloud state, or create infrastructure.
- A mock-backed result does not establish live-service behavior; an integration result does not authorize deployment.

## References

- [Test design](references/test-design.md) - coverage classification, assertion quality, mocks, and negative cases.
- [Plan-mode and mock design](references/plan-mode-and-mock-design.md) - deterministic coverage and mock boundaries.
- [Evidence acceptance](references/evidence-acceptance.md) - receipt scope, result interpretation, and blocker routing.
- [Plan-mode test design](references/plan-mode-test-design.md) - mock boundary, assertions, and blocked apply-mode
   work.
