---
name: apex-operations
description: "Guides the foreground APEX agent during kernel-routed governance import, preview inspection, Gate 4 handoff, inventory, diagnosis, reconciliation and quality. Preserves operation receipts and stop points. Not direct Azure mutation, arbitrary incident mitigation or production setup."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

## APEX Operations

Use this skill when the kernel routes the active foreground `APEX` agent to governance, preview, deployment handoff,
inventory, diagnosis, reconciliation or quality work.

## Prerequisites

- `apex/status` identifies the selected run.
- Task context is required only when the kernel issues a task-backed operation.
- Governance import requires an explicit request and a local path to a reviewed baseline; never load baseline bytes
  into model context.

## Workflow

1. Call `apex/status` first. Status, current preview and recorded inventory reads do not require a task. For task-backed
   operations, call `apex/nextTask` only after status returns runnable work.
2. For `needs_input` or `needs_review`, route by `apex-next` and do not poll or read task context. Only `status=task`
   supplies `task.taskId`; read `apex/taskContext` with that exact ID before the matching operation.
3. For governance candidate selection, call `apex/governanceSelect` with only the reviewed local path. Present the
   returned governance question in chat and submit the exact user answer with `apex/recordInput`. Never choose on the
   user's behalf. Remembered choices return selected state; do not ask again. Use `reopen: true` only when the user
   explicitly asks to reconsider a pending refresh.
4. For a `local` target, or a user-chosen pre-sales start without a subscription baseline, call
   `apex/governanceImport` with the shipped reference baseline. For a subscription target with a reviewed baseline,
   import only the local path. Return the service's `outputHash` and `summary`, never baseline bytes. Import does not
   perform live discovery, map policies, authorize planning or approve a gate.
5. If policy content changed, explain invalidation scope and direct the user to the trusted CLI governance revision
   ceremony. Never infer revision confirmation or use deployment reconciliation for governance revision.
6. Use `apex/preview` only to read the current preview and explain recorded semantic changes, target, expiry,
   destructive actions, unevaluated items and uncertainty. Gate 4 is the final approval for a lab: summarize the
   architecture, cost estimate and accepted risks so it is informed, and require review of the exact preview, target,
   expiry and approval recipient through the trusted terminal ceremony (`node .apex/bin/apex.mjs gate decide --gate 4 ...`);
   never approve Gate 4 through chat or print `${PLUGIN_ROOT}` in user shells. Each apply
   and each destroy has its own preview and approval; a changed preview or intent needs a new one.
   On source candidates containing immutable context binding (#466), preserve the returned `approvalContextHash`
   and full source/risk references. Changed or renewed risk terms require a fresh preview; never repair review
   files or their mutable bases to make approval pass.
7. Use `apex/reconcile` only for an indeterminate operation authorized by the kernel. If no execution receipt exists,
   report that reconciliation cannot establish outcome and keep the blocker for operator or provider resolution. Do not
   repeat deployment or reconciliation.
8. Use `apex/inventory` only to read recorded inventory for the selected run. Use `apex/diagnose` only for a
   task-backed diagnosis after reading task context. For a requested runbook, require accepted diagnosis handoff data;
   absence is a blocker, not permission to invent operational readiness.
9. Report provider and kernel results without claiming transactional rollback, live Azure diagnostics, provider
   certainty or diagnosis beyond the returned bounded status and checks.
10. When a validation worker task appears, delegate `APEX Validator` with the exact `task.taskId` and tell the worker to
    call `apex/taskContext`. When a code generation worker task appears, delegate `APEX CodeGen` the same way. Do not
    delegate Gate 4, governance selection or deployment decisions.
11. After worker completion, `apex/reviewDecide` or any operation completion, call `apex/status`. If a human gate
    (Gate 1 or Gate 4) is pending, report it and stop. Do not call `apex/nextTask` while a human gate is pending.

## Boundaries

For an existing recorded lab delegation, use the narrow
[delegated gate path](../apex-workflow/SKILL.md#delegated-lab-gates) instead of the human Gate 4 stop only for apply.
It requires exact current preview/context hashes and native provider observations. Updates, deletes, replacements,
unknowns, pre-existing creates, material no-ops and out-of-policy resources are blocked. Destroy still needs its own
preview and normal human approval; `azd-env-name` tags and an external cleanup ledger are not run-creation proof.

Required validation, authorization, freshness, writer epoch and approval checks are kernel-controlled. Do not invent
operations, retry effects, mutate infrastructure, run shell/Git/Bicep/Terraform commands, or claim provider inspection
that the current APEX MCP result does not contain. Retail pricing, supported cost-saving recommendations, and general
guarded Azure reads use `apex-azure` under the foreground agent's verified grants. Actual billing, forecasts, budgets,
alerts and commitment records are unavailable. Missing tools are blockers.

For the active task's domain reasoning, use `apex-azure-reliability` for recovery/failure evidence,
`apex-azure-kubernetes` for AKS sizing/identity recommendations, `apex-azure-upgrade` for lifecycle assessment and
`apex-python-diagrams` for figure interpretation. These skills never authorize an unsupported remediation or render.

## Examples

| State or request | Required response |
| --- | --- |
| Reviewed baseline path on a subscription run | Import the path only; do not load the management-group baseline into model context |
| Kernel shows pending Gate 4 | Explain the exact immutable preview/context and trusted terminal ceremony, then stop |
| Provider outcome is indeterminate | Report the recorded operation and authorized reconciliation path; do not blind-retry apply |

## Output

Return the operation ID, state, evidence references, review-package location, blockers, kernel-provided next action and
the reason for stopping.
