# Deployment Global Rules

Read [execution boundaries](execution-boundaries.md). These rules replace upstream chat-confirmation and generic
plan-status authority, not the technical deployment checks.

## Destructive Actions and Approval

Deletion, replacement, reset, production delivery, data/schema change, permission changes and cutover need an exact
preview and current Gate 4. Non-destructive mutations need the same authorization. Explain blast radius, retained data,
dependencies, reversibility and cost. Chat confirmation, provider flags or approval of a prior operation is insufficient.
Missing approval blocks work; an indeterminate outcome requires kernel reconciliation, not automatic cleanup.

## Subscription, Location and Environment

Use the accepted project/environment target. A detected default subscription or environment is not user selection.
Reuse unchanged accepted context only while its freshness and dependency revision remain valid. Request missing or
changed user-owned choices through the kernel input contract; never assume a region from a recipe sample.

Apply [Azure defaults](../../apex-azure-defaults/SKILL.md) and typed governance, naming, policy tag precedence, AVM
selection, workload SKU decisions and security. Verify the exact resource-group location and service capacity before
preview. A changed target or service set requires validation and a new preview; it is not error recovery in place.

## No Independent Preparation or State

Missing manifests, infrastructure, package digests or validation evidence return to their owning task. Do not create
a generic plan, set a `Validated` status, select a new target, regenerate IaC or initialize azd from a deployment task.
Apply the [pre-deploy checklist](pre-deploy-checklist.md); it collects readiness, never provisions.

## Port Source

Adapted from [upstream global rules](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/global-rules.md).
