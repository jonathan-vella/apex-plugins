---
name: apex-azure-validate
description: '**WORKFLOW SKILL** — Assess Azure preflight and source-validation evidence. WHEN: "validate my app", "check deployment readiness", "run preflight checks", "validate azure.yaml", "validate Bicep", "validate Azure Functions". DO NOT USE FOR: production troubleshooting (use apex-azure-diagnostics), execution (use apex-azure-deploy).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Validation

Use this skill only for an active validation task. It evaluates the kernel-projected preparation artifacts and evidence
against acceptance criteria; it does not execute checks independently or change lifecycle state.
Read [the authority boundary](references/kernel-boundary.md) before using recipe commands.

## Validation Rules

- Keep validation-only, preview-only and execution requests distinct. Passing checks is not deployment authorization.
- Require accepted preparation, selected-track binding, exact dependency locks and generated-tree receipts.
  Do not require or create a generic `.azure/plan.md` or mark it `Validated`.
- Evaluate source syntax/build, `azure.yaml` service paths, packaging, policy/security mapping, identity permissions,
  backend/network access and preview red flags only where the task authorizes those checks.
- Preserve passed, failed, unperformed and indeterminate outcomes with commands, timestamps, exit results and scope.
  Missing evidence is not a pass; remediation that changes source or intent invalidates dependent proof.
- Direct diagnostic `az`/`azd` output remains an observation until accepted. A token check is not a permission proof;
  a configured account is not a valid token. Never expose credentials or repair roles in validation.
- Role review is report-only and distinguishes management/data planes. Policy validation cannot waive security.
- Treat quota and regional availability as the task's explicit assumptions or evidence obligations, not fabricated facts.

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

- Direct read/diagnostic `az` and `azd` commands may explain a failure within the accepted scope; they do not replace
  trusted validation or preview receipts. Builds, linters and evidence refresh remain capability-owned.
- Do not amend validation proof, bypass a failed criterion, or set a plan to validated.
- Do not deploy or imply that passing a partial check authorizes deployment.
- Transform a request to run a preflight command into a request for the trusted validation capability's evidence. The
  capability and kernel, not this skill, decide whether it can refresh evidence or advance state.

## References

- [Preflight](references/infraops-preflight.md), [roles](references/role-verification.md),
  [policy](references/policy-validation.md) and [availability](references/region-availability.md) - diagnostic checks.
- [Recipe index](references/recipes/README.md) - azd, Azure CLI, Bicep and Terraform command/error guidance;
  execution remains subject to the kernel boundary; azd is the planned Bicep-only executor (CP-26), not available today.

- [Preflight evidence model](references/preflight-evidence.md) - freshness, acceptance outcomes, and remediation
  routing.
- [Operational checklist](references/operational-checklist.md) -
  generated-tree validation, acceptance coverage, and failed-check routing.

## Output

Return the validation state, acceptance-criterion outcomes, evidence references, blockers, and the kernel-provided next
action. Use `indeterminate` when provided evidence cannot establish readiness.
