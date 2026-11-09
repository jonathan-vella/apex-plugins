---
name: apex-azure-upgrade
description: '**ANALYSIS SKILL** — Assesses in-Azure lifecycle changes and recommends bounded plans. WHEN: "Consumption to Flex", "Flex readiness", "Linux Consumption retirement", "Redis to AMR", "Redis retirement". DO NOT USE FOR: cross-cloud migration (apex-azure-cloud-migrate), editing app source, executing migrations or arbitrary cluster/runtime upgrades.'
user-invocable: false
disable-model-invocation: false
---

# APEX Azure Upgrade Assessment

Use this skill as domain input to an existing architecture, planning or assessment task. It assesses lifecycle,
compatibility and change-plan intent; it is **not a migration executor**. The deterministic kernel owns task routing,
state, evidence acceptance and approvals. Available `apex/*` calls require the checkout's absolute `workspace`.

## Scenario Scope

| Existing source | Assessment target | Detailed reference |
| --- | --- | --- |
| Functions Consumption (`Y1`), Linux or Windows | Flex Consumption (`FC1`) candidate | [Consumption to Flex](./references/services/functions/consumption-to-flex.md) |
| Functions plan compatibility/reporting | Requirement-linked assessment output | [Functions assessment](./references/services/functions/assessment.md) |
| Azure Cache for Redis Basic/Standard/Premium | Azure Managed Redis candidate | [Redis to AMR](./references/services/redis/redis-to-amr.md) |
| Redis Enterprise/Enterprise Flash | Azure Managed Redis candidate, separate source path | [Redis to AMR](./references/services/redis/redis-to-amr.md) |

Other lifecycle questions can produce a bounded evidence gap and an official-documentation research proposal.
No matching scenario means `unsupported upgrade assessment path`, not permission to improvise an executor.

## Prerequisites

- Accepted context identifies source resource IDs/type/plan, OS/runtime/version, dependency/data ownership,
  target intent, permitted scope, business deadline, downtime/data-loss tolerance and rollback requirements.
- Use [global rules](./references/global-rules.md) for every assessment. Missing target decisions stay unresolved:
  do not choose a subscription, region, runtime or SKU from chat history or upstream defaults.
- [Managed defaults](../apex-azure-defaults/SKILL.md) and accepted governance own naming, tags, regions, security and
  AVM pins. Target SKUs come from `workload-decision-manifest-v1`; scope changes return to the owning decision task.
- Lifecycle dates, language support, service limits and migration mechanics need current official documentation
  with source and retrieval date. A pinned source is historical, not evidence that a deadline or feature is current.

## Assessment Method

1. Identify the exact source and desired target. Disambiguate Redis source product before choosing a guide.
2. Establish scoped read-only inventory from accepted evidence or installed/granted observation capabilities.
   Record setting **names only**, accepted identity mappings, network/domain dependencies and configuration gaps.
3. Evaluate compatibility and prerequisites using the selected reference. Record supported, incompatible,
   unknown and not-applicable outcomes, without declaring an unperformed check passed.
4. Separate infrastructure creation from application code changes/delivery, identity authorization, data movement,
   trigger coordination, DNS/client cutover, rollback and cleanup. Name the owner and unsupported executor for each.
5. Recommend a bounded plan with old/new mappings, compatibility remediation, permission boundaries, data-loss and
   downtime risks, validation expectations and rollback/failback criteria **before** any proposed cutover.
6. Preserve the original resource and data unless an independently approved, supported change explicitly covers
   them. A side-by-side target is a plan candidate, not permission to create it.
7. Return findings to the caller's existing artifact contract. Do not write a progress file, standalone
   `upgrade-assessment-report.md`, app source, IaC or a new workflow state.

## Execution and Evidence Boundaries

- Tool names in source material are capability hints, never grants. Verify installed schemas, scope and authorization.
  No tool availability means an explicit evidence/capability blocker, not login, installation or a shell fallback.
- No Azure/Kubernetes/Entra/GitHub mutations; no kubeconfig, keys, tokens, secret data, package downloads, installs,
  application edits or generic code execution. Existing setting names are not permission to retrieve their values.
- Current resource execution supports Bicep azd provision/preview/down and native Terraform exact saved plans only
  under the existing kernel preview/Gate 4/trusted execution. Production fails closed.
- An infrastructure executor does not execute `flex-migration start`, Redis migration, data copy/import/export,
  runtime modernization, app delivery, trigger drains, DNS/client cutover or arbitrary cluster/app upgrades.
  Return `unsupported migration/cutover executor` for these operations; approval prose cannot create one.
- Never claim a validated plan, compatible runtime, successful restore or safe rollback without accepted evidence.
  Quota/availability, restore duration and performance remain design assumptions unless evidenced, not new gates.
- Price proposed resources only through the granted official Azure MCP
  [cap-aware pricing contract](../apex-azure-defaults/references/retail-pricing.md); capped results stay unpriced.

## Output

Return source/target scope, current lifecycle citations/date, requirement and workload-manifest references,
compatibility matrix, safe inventory, proposed changes by owner/operation, permission/data-loss/downtime boundaries,
rollback/reconciliation plan, evidence freshness/coverage, assumptions and blockers, and kernel-provided next task.

Examples: unverified Windows-to-Linux dependency blocks a Flex compatibility claim; no source principal mapping
blocks identity parity; unknown Redis source SKU blocks path selection; a request to execute cutover is unsupported
even if the infrastructure plan is approved.

## Reference Index

- [Global rules](./references/global-rules.md) — scope, permissions, identity, rollback and unavailable execution.
- [Functions assessment](./references/services/functions/assessment.md) — complete assessment dimensions/output.
- [Consumption to Flex](./references/services/functions/consumption-to-flex.md) — configuration, triggers and rollback.
- [Redis to AMR](./references/services/redis/redis-to-amr.md) — product disambiguation, client/data/auth risks.
- [Upstream coverage](./references/upstream-coverage.md) — exact pinned inventory, adaptations and exclusions.
