---
name: apex-azure-validate
description: "Assess APEX Azure preflight evidence. Use for freshness, acceptance criteria, readiness blockers, and validated handoff decisions."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Validation

Use this skill only for an active validation task. It evaluates the kernel-projected preparation artifacts and evidence
against acceptance criteria; it does not execute checks independently or change lifecycle state.

## Prerequisites

- `apex/taskContext` identifies the validation scope, target, required evidence, freshness policy, and acceptance
  criteria.
- Required preparation artifacts and the selected IaC binding are accepted by the kernel.
- The task envelope supplies the authorized validation capability or evidence results. Missing or stale evidence is a
  blocker, not an invitation to re-create it from local files, chat history, or model memory.

## Workflow

1. Confirm that each required preparation output is present, accepted, and traceable to the active run and target.
2. Evaluate evidence freshness using the policy and timestamps projected by the kernel. Report expired, mismatched,
   incomplete, or indeterminate evidence exactly as returned.
3. Compare the authorized validation results with the task's functional, security, governance, build, and deployment
   acceptance criteria. Keep a failed check distinct from an unavailable check.
4. Return the kernel-provided validation result and unresolved criteria. When remediation changes intent or bindings,
   route back to the owning preparation task rather than editing artifacts directly.
5. Hand off only an accepted validation result to the next kernel-selected lifecycle task.

## Boundaries

- Do not run previews, builds, linters, IaC validators, authentication checks, or Azure queries directly.
- Do not amend validation proof, bypass a failed criterion, or set a plan to validated.
- Do not deploy or imply that passing a partial check authorizes deployment.
- Transform a request to run a preflight command into a request for the trusted validation capability's evidence. The
  capability and kernel, not this skill, decide whether it can refresh evidence or advance state.

## References

- [Preflight evidence model](references/preflight-evidence.md) - freshness, acceptance outcomes, and remediation
  routing.
- [Operational checklist](references/operational-checklist.md) -
  generated-tree validation, acceptance coverage, and failed-check routing.

## Output

Return the validation state, acceptance-criterion outcomes, evidence references, blockers, and the kernel-provided next
action. Use `indeterminate` when provided evidence cannot establish readiness.
