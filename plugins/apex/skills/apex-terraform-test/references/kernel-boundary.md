# vNext Authority and Command Boundary

This boundary applies to every imported reference and example in this skill. Upstream phase labels, recipes,
sample paths, templates and CLI sequences are technical context, not a second workflow or an executable runbook.

## Accepted Inputs and Outputs

Use `apex/taskContext` with the current absolute `workspace` to obtain the active task, allowed outputs, accepted
requirements, architecture, governance, selected-track binding, receipts and freshness policy. Reuse unchanged accepted
decisions; chat history, environment defaults and source files cannot replace acceptance or approval evidence.

The kernel owns task state, artifact acceptance, gates, evidence and writer authority. There is no standalone
`.azure/plan.md` lifecycle, numbered-agent handoff, skill-owned approval, or skill-owned `Validated` status.
Generation, staging, builds, provider initialization, state inspection and tests use only the capabilities authorized
by the task envelope. An example or imported template does not register a capability. Return unavailable materialization
as a blocker or future backlog item; never run a substitute script.

## Canonical Infrastructure Contracts

Read [Azure defaults](../../apex-azure-defaults/SKILL.md) and use runtime `azureDefaults`, `securityInvariants`, the
accepted governance/tag contract and `workload-decision-manifest-v1`. Policy tag casing and values win; for greenfield
fallback follow [tag precedence](../../apex-azure-defaults/references/tag-precedence.md), not old PascalCase examples.
Sample locations, service versions, SKUs, names, address ranges, quotas and prices are not accepted decisions.

Use AVM first with exact accepted module locks. Raw resources and application templates explain syntax; they require
an accepted AVM-coverage exception where applicable. Do not weaken HTTPS/TLS, managed identity, Entra-only data access,
no public blob/no shared key or production private-networking requirements to make an example work.
Key-based SDK examples describe existing-app migration only; generate credential-free clients for new work.
Quota and regional availability remain explicit Architecture assumptions unless the task requires accepted evidence;
unknown headroom is never zero or unlimited, and published limits never prove allocation.

## Commands and Evidence

Direct read/diagnostic `az` and `azd` commands are allowed for the approved tenant, subscription and disclosure scope.
They produce observations, not accepted evidence. Redact secrets, tokens and connection strings; `azd env get-values`
can contain credentials. Accepted results must match scope, exact source/dependency revision, timestamps and freshness.
Do not retrieve secret values or switch identities as a troubleshooting shortcut.

Commands that change Azure, Entra, GitHub settings or managed Terraform state never run directly by the agent.
Today they require `apex preview`, a separate human decision at Gate 4 via `apex gate decide`, and
`apex deploy --preview <hash>`. Approval binds the exact preview, actor, target, operation, recipient, commit,
dependency revision, writer epoch and expiry. A changed preview requires new approval.
Readiness, source generation and a successful partial check never authorize apply.

Current native deployment tracks are Bicep and Terraform (`IacTool` is `bicep` or `terraform`): Bicep previews use
`az deployment group|sub what-if`; Terraform applies only the exact saved plan approved at Gate 4.
Provider mutation commands retained in examples are syntax for those bounded operations, never instructions to execute.
An environment flag, shell confirmation, local plan status, CI environment approval or OIDC job identity is not an
APEX gate decision. Never suppress provider errors, refresh approval in CI, or execute an unbound fallback.

## Purpose-Bound Delivery

Lab runs (CP-27, #456) confirm intent once at Gate 1 (purpose, target and requirements), record Gates 2 and 3 as
kernel readiness checkpoints and approve the final deployment preview at Gate 4. Required reviews, deterministic
checks, risk decisions and each apply or destroy preview and approval remain blocking; a readiness checkpoint is never
human approval. `production` is blocked. The preview binding and qualification handoff above stay enforced.
DECISION-036 and ADR-0007 select the following target; **none of it is shipped behavior**:

- Executors: azd is the executor for **Bicep only** (CP-26, #443). Native Terraform CLI is the Terraform path with
  exact saved plans, normal backend locking and unchanged dependencies. There is no azd Terraform adapter.
- APEX **never runs `azd up`**. Provisioning and application deployment stay separate operations.
- Production (CP-28, #457; setup CP-29, #458): opt-in and CI-owned, with a verified candidate-bound human review
  receipt before apply. OIDC job identity or an environment pause alone is not human approval.
- Static `azure.yaml` and GitHub Actions generation is reviewable preparation, not pipeline setup or approval.
  Commands that configure identities, federated credentials, role assignments or GitHub settings are
  operator-owned setup that this skill never runs.

Report unsupported azd, pipeline-setup, state-adoption and live-test execution as blockers. An older reference that
says “run”, “deploy”, “update plan” or “approve” must be read through these boundaries, never as current runtime
availability or independent mutation authority. Documentation or skill text does not unblock production.
