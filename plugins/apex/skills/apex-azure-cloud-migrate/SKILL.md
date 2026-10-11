---
name: apex-azure-cloud-migrate
description: '**WORKFLOW SKILL** — Assesses cross-cloud workloads and guides authorized code conversion to Azure. WHEN: "Lambda to Azure Functions", "Beanstalk to App Service", "Heroku migration", "App Engine to Azure", "Fargate to Container Apps", "GKE migration", "Cloud Run migration", "Spring Boot migration". DO NOT USE FOR: greenfield prep (use apex-azure-prepare), incidents (use apex-azure-diagnostics).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Cloud Migration Guidance

Use this skill only for an active assessment, architecture, planning, or approved implementation-binding task. The
kernel owns task state, evidence freshness, authorization, artifact acceptance, and all state-changing work.
Load [execution boundaries](references/execution-boundaries.md) before a scenario. Assessment does not imply source
discovery, conversion, local tests, deployment or cutover authorization.

## Prerequisites

- `apex/taskContext` identifies the active task, allowed outputs, source evidence, target constraints, and evidence
  references.
- A bounded workload inventory or owner-supplied evidence identifies the source platform, services, runtime, interfaces,
  data classification, and critical dependencies; otherwise return `needs_input`.
- A migration action is available only through a kernel-authorized capability. A migration request does not authorize
  source inspection, code conversion, file creation, testing, or deployment.

## Workflow

1. Resolve assessment-only versus authorized implementation from `apex/taskContext`. Preserve the source; stop at
   the requested stage. Do not create a parallel migration-status state machine.
2. Produce an evidence-bounded readiness assessment. Identify unknowns, compatibility risks, security constraints,
   continuity needs and user-owned choices from accepted source inventory, code/config evidence and documentation.
3. Map each accepted workload concern to a logical Azure target pattern. Record confidence, trade-offs, assumptions,
   dependencies, and unresolved mapping decisions instead of asserting a one-to-one service replacement.
4. Define staged validation intent: assessment acceptance, authorized implementation evidence, isolated functional
   validation, integration validation, and production-readiness evidence. A failed or absent receipt blocks the next
   stage.
5. Submit the assessment or migration plan only through the kernel-authorized capability named in the task envelope.
   Preserve the returned receipt or blocker in the active artifact.
6. Handoff accepted intent to the authorized preparation, implementation, validation, or operations capability. Do not
   state that a workload is migrated, tested, or deployed without accepted receipts for that stage.
7. For Lambda-to-Functions requests, apply
   [Lambda to Functions assessment](references/lambda-to-functions-assessment.md) to the accepted evidence. Return a
   blocker when the task needs source inspection, code conversion, publishing, or cutover.

## Workflow Routing

The active task and accepted inputs determine assessment, architecture, planning, conversion or handoff.
Scenario phases are technical concerns, not permission to advance kernel state. Infrastructure returns to authorized
preparation/CodeGen; local conversion/testing, remote lifecycle work and cutover require their own available capability.
Stop at missing support, pending gates and unaccepted user-owned choices.

## Scenario References

| Source → target | Guidance |
| --- | --- |
| Lambda → Functions | [Scenario](references/services/functions/lambda-to-functions.md), [assessment](references/services/functions/assessment.md), [code conversion](references/services/functions/code-migration.md) |
| Beanstalk → App Service | [Platform, configuration, scaling and RDS mapping](references/services/app-service/beanstalk-to-app-service.md) |
| Heroku → App Service | [Dynos, Procfile, add-ons, identity and pipelines](references/services/app-service/heroku-to-app-service.md) |
| App Engine → App Service | [Standard/Flex, app.yaml, tasks, data and traffic](references/services/app-service/app-engine-to-app-service.md) |
| Fargate → Container Apps | [Scenario](references/services/container-apps/fargate-to-container-apps.md), [assessment](references/services/container-apps/fargate-assessment-guide.md) |
| Kubernetes → Container Apps | [Scenario](references/services/container-apps/k8s-to-container-apps.md), [compatibility](references/services/container-apps/assessment-guide.md) |
| Cloud Run → Container Apps | [Scenario](references/services/container-apps/cloudrun-to-container-apps.md), [assessment](references/services/container-apps/cloudrun-assessment-guide.md) |
| Spring Boot → Container Apps | [Scenario](references/services/container-apps/spring-apps-to-aca.md), [assessment](references/services/container-apps/spring-assessment-guide.md), [dependencies](references/services/container-apps/spring-dependency-patterns.md) |

App Service shares [assessment](references/services/app-service/assessment.md),
[conversion](references/services/app-service/code-migration.md) and
[security rules](references/services/app-service/global-rules.md).
Functions runtime examples cover [JavaScript](references/services/functions/runtimes/javascript.md),
[TypeScript](references/services/functions/runtimes/typescript.md), [Python](references/services/functions/runtimes/python.md),
[C#](references/services/functions/runtimes/csharp.md), [Java](references/services/functions/runtimes/java.md) and
[PowerShell](references/services/functions/runtimes/powershell.md).

Prefer supported GA runtimes verified for the task and bindings where suitable; SDKs remain appropriate for unsupported
binding behavior. Mapping tables are candidates, not accepted SKU decisions. Check current service/runtime limits,
service discovery and DNS differences, identity, data consistency and rollback/cutover ownership.

## Boundaries

- Source inspection, code conversion, output writes and tests need the capability and paths named in the active
  task. When unavailable, return a blocker rather than using the reference as permission for arbitrary shell/SDK work.
- Output-directory and report examples are advisory fields, not new kernel artifacts. Assessment-only stops after
  acceptance; implementation uses an authorized separate output path and leaves source workloads intact.
- Infrastructure belongs to authorized preparation/CodeGen. Native provider lifecycle work stays with its owner;
  a Functions publish, container image push, database migration or source-cloud deletion is not local conversion.
- Read and diagnostic `az`/`azd` calls may run within accepted target scope. Azure, Entra and GitHub setting mutations
  require `apex preview`, the current runtime's Gate 4 approval and trusted deployment. The planned azd (Bicep only)
  and CI-owned production flow (CP-26 to CP-30, DECISION-036) is not available; unsupported work blocks.
- Standalone current/target architecture diagrams use the kernel's Python diagram path, not Mermaid or ASCII
  substitutes. Missing rendering capability is a blocker.
- No secrets in reports/code; preserve current naming, policy tags, AVM-first, identity and network security through
  `apex-azure-defaults`. A scenario's sample SKU/region never overrides accepted decisions.

## References

- [Migration readiness assessment](references/migration-readiness.md) - evidence, risk, and blocker criteria.
- [Workload mapping intent](references/workload-mapping.md) - logical service, identity, data, and observability mapping.
- [Staged validation and handoff](references/staged-validation-handoff.md) - receipt gates and next-task routing.
- [Lambda to Functions assessment](references/lambda-to-functions-assessment.md) - workload mapping, runtime review,
  and blocked-operation boundary.
- [Workflow details](references/workflow-details.md) - reporting, stage ownership and conversion errors.
- [Functions security rules](references/services/functions/global-rules.md) and
  [upstream coverage](references/upstream-coverage.md).

## Output

Return an evidence-bounded migration assessment or plan, requirement traces, capability receipt references, explicit
blockers, and the next kernel-controlled task.
