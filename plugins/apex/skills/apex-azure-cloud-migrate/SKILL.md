---
name: apex-azure-cloud-migrate
description: "Assess cross-cloud workload migration intent in APEX. Use for readiness, AWS or GCP workload mapping, migration risks, staged validation, and authorized handoffs."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Cloud Migration Guidance

Use this skill only for an active assessment, architecture, planning, or approved implementation-binding task. The
kernel owns task state, evidence freshness, authorization, artifact acceptance, and all state-changing work.

## Prerequisites

- `apex/taskContext` identifies the active task, allowed outputs, source evidence, target constraints, and evidence
  references.
- A bounded workload inventory or owner-supplied evidence identifies the source platform, services, runtime, interfaces,
  data classification, and critical dependencies; otherwise return `needs_input`.
- A migration action is available only through a kernel-authorized capability. A migration request does not authorize
  source inspection, code conversion, file creation, testing, or deployment.

## Workflow

1. Produce an evidence-bounded readiness assessment. Identify unknowns, compatibility risks, security constraints,
   continuity needs, and user-owned choices without inspecting source or querying cloud services.
2. Map each accepted workload concern to a logical Azure target pattern. Record confidence, trade-offs, assumptions,
   dependencies, and unresolved mapping decisions instead of asserting a one-to-one service replacement.
3. Define staged validation intent: assessment acceptance, authorized implementation evidence, isolated functional
   validation, integration validation, and production-readiness evidence. A failed or absent receipt blocks the next
   stage.
4. Submit the assessment or migration plan only through the kernel-authorized capability named in the task envelope.
   Preserve the returned receipt or blocker in the active artifact.
5. Handoff accepted intent to the authorized preparation, implementation, validation, or operations capability. Do not
   state that a workload is migrated, tested, or deployed without accepted receipts for that stage.
6. For Lambda-to-Functions requests, apply
   [Lambda to Functions assessment](references/lambda-to-functions-assessment.md) to the accepted evidence. Return a
   blocker when the task needs source inspection, code conversion, publishing, or cutover.

## Boundaries

Do not use cloud portals, CLI, SDKs, APIs, repositories, source scanning, code conversion, IaC, deployment tooling, or
file-mutation actions. Do not discover workloads, access source, create migration output, alter environments, test,
deploy, or handle secrets. Convert direct operational requests into bounded intent and an authorized capability handoff.

## References

- [Migration readiness assessment](references/migration-readiness.md) - evidence, risk, and blocker criteria.
- [Workload mapping intent](references/workload-mapping.md) - logical service, identity, data, and observability mapping.
- [Staged validation and handoff](references/staged-validation-handoff.md) - receipt gates and next-task routing.
- [Lambda to Functions assessment](references/lambda-to-functions-assessment.md) - workload mapping, runtime review,
  and blocked-operation boundary.

## Output

Return an evidence-bounded migration assessment or plan, requirement traces, capability receipt references, explicit
blockers, and the next kernel-controlled task.
