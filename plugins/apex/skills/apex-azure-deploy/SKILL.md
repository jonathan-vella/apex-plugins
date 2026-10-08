---
name: apex-azure-deploy
description: "Explain approved APEX Azure deployment previews and lifecycle outcomes. Use for approved changes, recovery, verification, and trusted CLI handoff."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Deployment Guidance

Use this skill only for an active operator or deployment task. It explains the exact kernel-provided approved preview,
its lifecycle position, recovery state, and verification evidence. Deployment itself is reserved to trusted CLI
ceremonies and kernel authorization.

## Prerequisites

- `apex/taskContext` identifies the active operation, target, authorization state, and validated evidence references.
- `apex/preview` provides the current, unexpired preview created for that active operation.
- The preview and validation evidence match the target and artifact revision selected by the kernel. A missing,
  mismatched, expired, or partial preview is a blocker.

## Workflow

1. Read the current kernel-created preview only. Explain its semantic changes, target, expiry, destructive actions,
   ignored or unevaluated items, dependencies, and uncertainty without adding inferred changes.
2. State the lifecycle condition exactly as projected: awaiting decision, authorized, executing, succeeded, failed, or
   indeterminate. Do not infer completion from files, portal state, or chat history.
3. Explain the recovery path returned by the kernel. For an indeterminate operation, direct reconciliation through the
   trusted lifecycle rather than retrying the side effect.
4. Explain verification evidence, including the observations required to establish the expected post-operation state.
5. Direct the operator to the trusted `apex gate decide` and `apex deploy` CLI ceremonies when the kernel marks them as
   the next action. Do not expose deployment commands, substitute another tool, or invoke a deployment operation.

## Boundaries

- Do not run or provide direct AZD, Azure CLI, Bicep, Terraform, ARM, portal, or SDK deployment instructions.
- Do not create, alter, approve, refresh, or extend previews; do not choose a target or grant authorization.
- Do not independently retry, roll back, or reconcile an operation. Provider behavior is not assumed transactional.
- Transform a direct deployment request into an explanation of the exact approved preview and the kernel-provided
  trusted CLI ceremony. A request never bypasses validation, approval, expiry, writer-epoch, or authorization checks.

## References

- [Preview, recovery, and verification](references/preview-recovery-verification.md) - explanation rules and outcome
  semantics.
- [Operational checklist](references/operational-checklist.md) -
   preconditions, circuit-breaker routing, drift, and verification limits.

## Output

Return the operation ID, target, lifecycle state, preview expiry, evidence references, blockers, and kernel-provided next
action. Describe only facts supplied by the active task and preview itself.
