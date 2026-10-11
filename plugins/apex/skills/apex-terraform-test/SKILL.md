---
name: apex-terraform-test
description: '**WORKFLOW SKILL** — Design receipt-gated Terraform tests. WHEN: "create terraform test", "write tftest", ".tftest.hcl", "mock provider", "test module", "test assertion". DO NOT USE FOR: Bicep (use apex-bicep-patterns), architecture decisions (use apex-azure-adr), deployment (use apex-azure-deploy).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Terraform Test Design

Use this skill for an active Terraform test-design or validation task. It specifies coverage and assertion intent;
authorized capabilities own test materialization, execution, environment access, and evidence production.
Read [the authority boundary](references/kernel-boundary.md) before loading test examples.

## Test Syntax and Safety

- `.tftest.hcl` tests require Terraform 1.6+, mocks 1.7+; check parallel-execution support against the accepted version.
- A file can contain a test-wide `test` block, file variables, providers/mocks and one or more named `run` blocks.
  Assertions describe observable expected state; variable precedence is run-block, file-level, then other inputs.
- **`command` defaults to `apply`**. Explicitly use `command = plan` for unit tests and mocks for offline execution.
  A real-provider plan can still read Azure; it is not a no-network guarantee.
- Use `expect_failures` for invalid inputs; chain `run.<name>.<output>` only when the dependency is intentional.
- `-filter` selects files, not run names. Inspect all selected runs/providers before requesting execution.
- Apply-mode tests and their automatic cleanup change infrastructure. A broad `terraform test` command is not safe
  merely because one file uses plan mode. Missing bounded live-test authorization is a blocker, not a direct-run route.

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
- Do not independently invoke Terraform, configure providers, mutate state or create infrastructure.
  Authorized read diagnostics explain failures but never replace test receipts.
- A mock-backed result does not establish live-service behavior; an integration result does not authorize deployment.

## References

- [Test examples](references/test-examples.md) - assertions, variables, module blocks, prior runs and negative tests.
- [Mock providers](references/mock-providers.md) - resource/data defaults, overrides and provider aliases.
- [Test patterns](references/test-patterns.md) - unit/integration coverage and CI sketches; mock results are not live proof.
- [Test execution](references/test-execution.md) - filters, parallelism, diagnostics and cleanup hazards.

- [Test design](references/test-design.md) - coverage classification, assertion quality, mocks, and negative cases.
- [Plan-mode and mock design](references/plan-mode-and-mock-design.md) - deterministic coverage and mock boundaries.
- [Evidence acceptance](references/evidence-acceptance.md) - receipt scope, result interpretation, and blocker routing.
- [Plan-mode test design](references/plan-mode-test-design.md) - mock boundary, assertions, and blocked apply-mode
   work.
