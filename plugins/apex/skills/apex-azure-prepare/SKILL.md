---
name: apex-azure-prepare
description: '**WORKFLOW SKILL** — Prepare traceable Azure app and IaC intent from accepted APEX inputs. WHEN: "create app", "generate Bicep", "generate Terraform", "azure.yaml", "Dockerfile", "function app", "managed identity". DO NOT USE FOR: cross-cloud migration (use apex-azure-cloud-migrate), execution (use apex-azure-deploy), preflight evidence (use apex-azure-validate).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Preparation

Use this skill only for an active requirements, architecture, planning, or CodeGen task. It translates accepted intent
into traceable architecture, plan, and selected-track IaC binding artifacts. The kernel owns task state, approvals,
artifact acceptance, and every repository mutation. Read [the authority boundary](references/kernel-boundary.md)
before loading an upstream-derived reference.

## Prerequisites

- `apex/taskContext` identifies the active task, its allowed outputs, target environment, and evidence references.
- Requirements and any predecessor architecture or governance evidence are accepted and fresh for the active run.
- A selected IaC track is present before a binding is created; otherwise return `needs_input` or a blocker.

## Workflow

1. Trace the accepted requirements to resource, identity, networking, data, diagnostic, recovery, and operational
   decisions. Preserve unknowns and external dependencies as explicit blockers.
2. For architecture tasks, record material Well-Architected trade-offs, evidence references, and user-owned choices
   through the kernel task workflow. Do not infer subscription, policy, quota, or availability facts.
3. For planning tasks, express deployment-neutral logical intent, dependencies, ownership, controls, and acceptance
   obligations. Keep provider syntax and implementation details out of neutral planning intent.
4. Bind the accepted plan to exactly one selected IaC track. Place module, provider, API, parameter, state, and
   ownership details in that binding, while preserving the trace back to planned intent and accepted policy.
5. Use only the kernel-authorized artifact and generation capabilities named by the task envelope. Return their typed
   result, or a blocker when an output, evidence item, or approval is missing.
6. Select only the references needed for the accepted task. Preserve application, CLI, SDK, Docker, Functions and azd
   guidance as design inputs; an example does not grant a generation or execution capability.
7. For Azure Functions intent, assess trigger, identity, network, data, and observability requirements. Record
   unavailable materialization as a future backlog item; do not compose or publish a recipe without a capability.

## Boundaries

- Do not write files directly; selected IaC generation and staging belong to the authorized CodeGen capability.
- Direct read/diagnostic `az` and `azd` commands may run within the accepted scope; their output is not accepted proof.
  Do not select a different identity/subscription, retrieve secrets or execute mutations as a preparation shortcut.
- Do not mark a plan approved, validated, or deployable. Those state transitions are kernel-controlled.
- Transform a request for direct Bicep, Terraform, AZD, or deployment work into the active task's approved binding and
  capability path. A direct-operation request is not authorization to mutate the workspace or Azure.

## Reference Selection

- [Preparation lineage and binding](references/preparation-lineage.md) - evidence flow, artifact distinctions, and
  handoff criteria.
- [Preparation analysis](references/analyze.md), [requirements](references/requirements.md),
  [workspace scan](references/scan.md), [research](references/research.md) and
  [architecture](references/architecture.md) - preparation questions, accepted inputs and ownership.
- [Azure context](references/azure-context.md), [region availability](references/region-availability.md) and
  [limits/quotas](references/resources-limits-quotas.md) - confirmed scope, assumptions and diagnostics.
- [Recipe selection](references/recipe-selection.md) and [generation](references/generate.md) - selected-track
  preparation, not an independent plan lifecycle.
- [Security](references/security.md), [global rules](references/global-rules.md),
  [phase adaptation](references/phases.md) and [binding fields](references/plan-template.md) - kernel-safe handoff.
- [azd configuration](references/recipes/azd/README.md), [Azure CLI](references/recipes/azcli/README.md),
  [Bicep](references/recipes/bicep/README.md) and [Terraform](references/recipes/terraform/README.md) - static
  configuration and provider syntax. azd is the planned executor for Bicep only (CP-26, #443), not available today;
  Terraform uses the native CLI.
- [.NET Aspire](references/aspire.md), [APIM](references/apim.md),
  [Node.js](references/runtimes/nodejs.md), [Functions](references/services/functions/README.md) and
  [Durable Task Scheduler](references/services/durable-task-scheduler/README.md) - select by accepted workload.
- [Specialized routing](references/specialized-routing.md) - topic selection, not an independent workflow owner.
- [azd quick reference](references/sdk/azd-deployment.md) and App Configuration SDK guidance:
  [Java](references/sdk/azure-appconfiguration-java.md), [Python](references/sdk/azure-appconfiguration-py.md),
  [TypeScript](references/sdk/azure-appconfiguration-ts.md).
- [Full topic index](references/content-index.md) - paths for all preserved service, recipe, runtime and SDK references.
  Load the matching topic, not the whole library.

## Output

Return kernel-provided artifact identifiers, requirement traces, binding references, blockers, and the next task. Do
not claim implementation is ready for deployment until validation evidence is accepted.
