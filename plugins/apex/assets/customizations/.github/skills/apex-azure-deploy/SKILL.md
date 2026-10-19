---
name: apex-azure-deploy
description: '**WORKFLOW SKILL** — Guides prepared Azure deployments through APEX previews, current runtime gates and trusted execution. WHEN: "run azd deploy", "run azd up", "publish to Azure", "bicep deploy", "terraform apply", "push to production", "deployment recovery". DO NOT USE FOR: app creation (use apex-azure-prepare), preflight (use apex-azure-validate), incidents (use apex-azure-diagnostics).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Deploy

Use this skill for an active operator or deployment task, not as a second deployment engine. Load
[execution boundaries](references/execution-boundaries.md) before a recipe. The kernel owns authorization, previews,
Gate 4, evidence, recovery and state; the selected native provider owns its lifecycle.

## Prerequisites

- `apex/taskContext` identifies the active operation, target, authorization state, and validated evidence references.
- Accepted preparation and validation receipts identify the exact commit, dependency revision, target, governance
  constraints and IaC/package inputs. A Markdown checklist or upstream plan status is not validation proof.
- Before execution, `apex preview` provides a current, complete preview for the selected operation. The current
  runtime's Gate 4 must approve that exact preview; approval binds hashes, recipient, expiry and ownership, not a
  general deploy intent. A lab run has one Gate 1 intent confirmation and this final Gate 4 approval; Gates 2 and 3
  are kernel readiness checkpoints, never approvals. Each apply and destroy needs its own preview and approval.
- Missing, stale, mismatched or incomplete inputs block deployment. Return to their owning task, not automatic
  initialization or infrastructure regeneration.

## Workflow

1. Confirm the requested action: preparation, validation-only and preview-only stop before deployment.
2. Apply the [pre-deploy checklist](references/pre-deploy-checklist.md): accepted subscription/region, exact resource
   group, service tags, selected environment and service-specific prerequisites.
3. Load only the [selected recipe](references/recipes/README.md). Interpret its provider commands against the current
   task and supported track, never as shell permission.
4. Explain semantic changes, destructive actions, ignored/unevaluated items, dependencies and uncertainty in the
   kernel-created preview. Direct the user to the current kernel-provided `apex gate decide` and `apex deploy` ceremonies.
5. Preserve exact lifecycle outcomes: awaiting decision, authorized, executing, succeeded, failed or indeterminate.
   Do not retry an ambiguous side effect; use the [recovery and verification rules](references/preview-recovery-verification.md).
6. Collect scoped read-only verification, endpoint checks and [live role comparisons](references/live-role-verification.md).
   Submit observations through the task's evidence contract; provider success alone does not establish acceptance.
7. Treat SQL identity setup, EF migrations, application delivery and pipeline configuration as separate operations
   when not covered by the approved preview. They are not implicit post-deployment permission.

## Purpose-Bound Delivery: Lab Flow Current, Executors And Production Not Available Yet

The lab gate flow (CP-27 [#456](https://github.com/jonathan-vella/apex-vnext/issues/456)) is current runtime: one Gate 1
intent confirmation, kernel-recorded Gate 2 and 3 readiness checkpoints and the final Gate 4 preview approval, with
required reviews, deterministic checks, risk decisions and each apply or destroy preview and approval still blocking.
`production` is blocked. DECISION-036 and ADR-0007 select the executor and production targets below. They are
**planned**, not shipped behavior; today's previews and qualification handoff stay enforced until the replacements are
implemented and qualified.

- **Executors (CP-26 [#443](https://github.com/jonathan-vella/apex-vnext/issues/443)):** azd is the executor for
  Bicep only; native Terraform CLI executes Terraform with an exact saved plan and normal backend locking. There is no
  azd Terraform path. Provisioning and application delivery stay separate operations.
- APEX never runs `azd up`: no single preview covers provisioning and application delivery.
- **Production (CP-28 [#457](https://github.com/jonathan-vella/apex-vnext/issues/457), setup CP-29
  [#458](https://github.com/jonathan-vella/apex-vnext/issues/458)):** opt-in. A CI-owned run creates the preview, and
  the kernel verifies a candidate-bound human review receipt before apply. OIDC job identity, a triggering actor or an
  environment pause alone is not human approval.
- Qualification of the purpose-bound flow is CP-30 [#455](https://github.com/jonathan-vella/apex-vnext/issues/455).
- `azure.yaml` and workflow generation are static, reviewable CodeGen outputs. `azd pipeline config` is a different
  operation with Azure, Entra and GitHub setting mutations and needs its own preview and approval, not a private
  user-run bypass.

Until the required executor and approval path are implemented and qualified, return an unavailable-capability
blocker; the current Bicep and Terraform tracks keep their existing kernel ceremonies.
Current azd Terraform provisioning replans in `Deploy()` before apply; it cannot execute an already approved saved
Terraform plan, so native Terraform plan/apply remains authoritative. `azd deploy --preview` cannot combine with
`--from-package`, and `azd pipeline config` has no native preview. Do not invent commands, hash-only workarounds or
approval exceptions.

## Boundaries

- Read and diagnostic `az`/`azd` commands may run directly within the accepted task scope, with safe projections and
  bounded output. Their observations do not automatically become accepted evidence.
- Commands that change Azure, Entra or GitHub settings never run directly from this skill. Recipe, CLI, SDK, SQL,
  hooks and pipeline examples are provider context for a trusted operation, not executable deployment shortcuts.
- Do not create, alter, approve, refresh, or extend previews; do not choose a target or grant authorization.
- Do not independently retry, roll back, or reconcile an operation. Provider behavior is not assumed transactional.
- Transform a direct deployment request into an explanation of the exact approved preview and the kernel-provided
  trusted CLI ceremony. A request never bypasses validation, approval, expiry, writer-epoch, or authorization checks.

## References

- [Preview, recovery, and verification](references/preview-recovery-verification.md) - explanation rules and outcome
  semantics.
- [Operational checklist](references/operational-checklist.md) - circuit breakers, drift and verification limits.
- [Global rules](references/global-rules.md) - approvals, targets and security.
- [Troubleshooting](references/troubleshooting.md) and [region availability](references/region-availability.md).
- [azd reference](references/sdk/azd-deployment.md) - environment, hooks, packaging and planned lifecycle.
- Azure Identity SDKs: [Python](references/sdk/azure-identity-py.md), [.NET](references/sdk/azure-identity-dotnet.md),
  [TypeScript](references/sdk/azure-identity-ts.md), [Java](references/sdk/azure-identity-java.md).
- [Upstream coverage](references/upstream-coverage.md) - pinned file inventory, examples and adaptations.

## Output

Return the operation ID, target, lifecycle state, preview expiry, evidence references, blockers, and kernel-provided next
action. Distinguish provider observations from accepted receipts and planned capabilities from available behavior.
