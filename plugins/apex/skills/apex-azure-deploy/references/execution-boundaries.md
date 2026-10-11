# Deployment Execution Boundaries

## Authority and Accepted Inputs

Read `apex/taskContext` with the session checkout/worktree's absolute `workspace`. Use only its operation, target,
accepted artifacts, receipts and allowed outputs. Skill loading, a checklist, a provider command, a chat confirmation
or an upstream `Validated` status grants no execution authority. Never write a separate plan/status workflow.

The kernel owns previews, approvals, evidence acceptance, freshness, writer ownership, retry/reconciliation decisions
and task transitions. The native provider owns provisioning and application lifecycle semantics; recipes explain that
provider, not a generic replacement engine. Missing capabilities or stale inputs block work.

## Command Classes

- **Read/diagnostic:** scoped `az` and `azd` reads may run directly. Bound time, count and target; project safe fields.
  Use `azd env get-value` for named non-secret keys, never dump an environment or app setting values. Record query,
  timestamp, target, completeness, redactions and producer; submit observations through the task's evidence contract.
- **Local preparation:** package installation, `azd init`, environment selection/settings, generated files, compilers
  and local tests need a task authorizing those paths/actions. They cannot silently alter approved deployment inputs.
  Any resulting input/package change invalidates the old preview; request new validation/preview.
- **Remote mutations:** Azure, Entra and GitHub setting changes run only through a fresh `apex preview`, the current
  runtime's `apex gate decide` Gate 4 approval and trusted `apex deploy`. Direct `az`, `azd`, SDK, SQL, Terraform,
  Kubernetes, hooks, credential creation and portal writes are not shortcuts. All mutations need approval, not only
  destructive ones. A CI-owned production run with human approval verified before apply is a planned target only.

Provider mutation snippets in these references are **context**, not commands for the agent to execute. SQL DDL,
EF migrations, role grants, image builds/pushes, restarts, logging configuration, pipeline setup and app delivery must
be covered explicitly or treated as separate operations. `--yes`, `--no-prompt`, `--approve` and CI environment
approvals are not kernel approval.

## Current Versus Planned Support

Today's Bicep track uses `az deployment group|sub what-if` and bound `create`; Terraform uses a saved
`terraform plan -out` and applies that exact saved plan. Only the kernel-created preview is approvable.
An ad hoc what-if or local plan is an observation, not an authorization receipt. Current runtime gates and the
existing qualification handoff stay enforced until their replacements are implemented and qualified.

**Executor and production delivery is planned (DECISION-036, ADR-0007).** The lab gate flow (CP-27
[#456](https://github.com/jonathan-vella/apex-vnext/issues/456)) is current runtime: one Gate 1 intent confirmation,
kernel-recorded Gate 2 and 3 readiness checkpoints and the final Gate 4 preview approval, with each apply or destroy
needing its own preview and approval; `production` is blocked. Do not claim any of the following exists today:

1. Executors (CP-26 [#443](https://github.com/jonathan-vella/apex-vnext/issues/443)): azd executes Bicep only, bound
   to source, parameters and environment. Native Terraform CLI executes Terraform from an exact saved plan with normal
   backend locking and unchanged dependencies. There is no azd Terraform adapter.
2. Provisioning and application delivery are separate operations; a service-delivery preview binds the service list
   and package digests. `azure.yaml` and workflow generation are static CodeGen output; `azd pipeline config` creates
   Entra identities, federation, roles and GitHub variables, so it needs its own preview and approval and is not a
   private user-run bypass.
3. Production (CP-28 [#457](https://github.com/jonathan-vella/apex-vnext/issues/457), setup CP-29
   [#458](https://github.com/jonathan-vella/apex-vnext/issues/458)): opt-in and CI-owned. GitHub Actions owns the
   execution run and preview, and the kernel verifies a candidate-bound human review receipt before apply. OIDC job
   identity, the triggering actor or an environment pause is not human approval; missing approval features or failed
   checks block production. Protected artifacts, anti-replay and audit still apply.
4. Qualification of the purpose-bound flow is CP-30 [#455](https://github.com/jonathan-vella/apex-vnext/issues/455).

APEX **never runs `azd up`**. Upstream mentions explain historical combined provision/build/deploy behavior only;
there is no single approval that can safely cover it. Unsupported operations return a blocker, not weaker gates.

## Known CP-26 Implementation Constraints

Read-only upstream inspection recorded in [CP-26](https://github.com/jonathan-vella/apex-vnext/issues/443) found:

- azd Terraform provisioning `Deploy()` calls `plan()` again before `Apply()` in azd 1.34.0 and current upstream.
  That path cannot apply the exact previously approved saved Terraform plan, which is why Terraform stays on the
  native CLI. A hash-only check does not excuse replanning.
- Current `azd deploy --preview` rejects combination with `--from-package`. A service-list/package-digest-bound
  preview needs an explicitly supported design; do not claim native azd provides it.
- `azd pipeline config` has remote Azure/Entra/GitHub side effects and **no native preview**. Its distinct APEX
  preview and approval operation is unimplemented and requires explicit scope, not a guessed `--preview` flag.

These are fail-closed blockers, not approval exceptions.

## Defaults, Evidence and Recovery

Use [APEX Azure defaults](../../apex-azure-defaults/SKILL.md) for canonical naming, region, policy-precedence tags,
AVM-first, HTTPS/TLS, identity, private data services and no hardcoded secrets. Typed governance and the accepted
workload decision manifest own constraints/SKUs; upstream sample regions and SKU tables are not selections.
Upstream capability/tool names and versioned code are reference hints, not proof of installed tools or current support.

Retain review findings/dispositions, approvals, commit/dependency hashes, recipient, expiry, ownership and evidence
freshness. Changes require renewed evidence/preview/approval. Provider failure may be partial or indeterminate:
never assume rollback, repeat a side effect or delete resources as cleanup. Follow the kernel's reconciliation path.
