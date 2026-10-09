---
name: apex-requirements
description: "Provides internal APEX requirements guidance for typed intake, scope, constraints, service preferences and Gate 1."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

## APEX Requirements

Use this skill only when the kernel routes the active foreground `APEX` agent to a requirements input request, review
or task.

## Prerequisites

- Call `apex/status` first, then `apex/nextTask` only when status leaves runnable requirements work.
- Task context is read only for `status=task` with a requirements task ID.
- The kernel's returned input request is the authoritative requirements question catalog.
- Apply the user's requested outcome and stop point before work begins. A prior handoff cannot expand scope. For
  intake-only scope, stop after the matching intake context and do not submit artifacts, start review or ask for
  approval.

## Workflow

1. Reuse facts the user already supplied in the current request. Present matching supplied facts as recommended
   confirmations when the kernel asks for them; do not make the user retype them, and do not record them until the user
   confirms or corrects them. Ask only for missing values. Never invent a project value, target, environment, IaC tool,
   service preference, budget posture, unknown, deferral, owner, risk acceptance or approval.
2. For `status=needs_input`, ask every returned question through `ask_user` in chat. Use native single-select or
   multi-select controls without adding or reordering kernel options. If native multi-select is unavailable, show the
   exact kernel options numbered in kernel order, collect the numbers, resolve them back to option values, and confirm
   the complete selection before recording. Invalid, duplicate, empty, ambiguous or out-of-range entries require
   correction. Recommendations are proposals only; never submit them without confirmation.
   When the request includes intake metadata, report the round as `request.intake.ordinal` of
   `request.intake.total` and continue through each remaining intake round only up to the user's requested stop point;
   each round has its own request ID and must be recorded separately.
3. Submit accepted answers only through `apex/recordInput` with the exact request ID, expected head and owner epoch from
   the request, plus one typed answer per question. Preserve arrays and typed values such as classifications,
   compliance selections, explicit deferrals and unknowns. A chat answer is not kernel acceptance; wait for
   `recorded: true` before advancing.
4. After accepted input, call `apex/nextTask` again. Do not poll unresolved input or review. For `needs_review`, present
   the findings in one decision panel and submit permitted decisions through `apex/reviewDecide`.
5. For `status=task`, call `apex/taskContext` with the exact `task.taskId`. If the context is externalized, read it in
   bounded chunks through `apex/readTaskInput`. Use `taskContext.recordedInput` and `outputTemplates` as the complete
   contract; do not read repository schemas or session history.
6. Build the requirements output with business context, measurable success criteria, non-functional requirements,
   security/compliance posture, budget and operations posture, regional constraints and candidate-service rationale for
   Architecture. Treat stated performance and scale values as later-validated goals. If none are provided, record
   `Performance and scale: check later (validated at a later stage)` rather than asking supplemental questions.
7. Treat Azure services as candidates. Recommend viable compute, data, integration, identity and observability options
   with concise fit and trade-off rationale, but never record a service or SKU as an Architecture decision. Capture
   retained, prohibited or preferred services, SKU constraints or an explicit no-preference position.
8. Populate narrative recommendations for access, ingress, DNS, personal-data inventory, retention/deletion,
   data-subject handling and telemetry minimization. Recommendations are proposed, not confirmed requirements,
   assigned owners or compliance evidence.
9. Submit the typed requirements artifact through `apex/requirementsComplete`. Report the materialized read-only Gate 1
   review package under `agent-output/<project>/<run>/`, including requirements, recommendations, SKU preferences and
   challenger findings.
10. Immediately call `apex/nextTask` after submitting requirements. When it returns the `requirements-review` task,
    run the rubber-duck review steps in `apex-next` with that exact `task.taskId`. If rubber-duck is unavailable or the
    capture fails twice, report the pending review task and stop.
11. When `needs_review` returns, do not request task context or run rubber-duck again. Record a disposition for every
    finding: fix, accept or dismiss with a reason, or acknowledge an obligation with an owner. For accept-risk, show
    `owner: <project risk owner>, expires in 90 days`, draft the rationale and ask only for confirmation. Existing
    blocking findings require the normal correction and fresh review path; do not automatically acknowledge, dismiss or
    accept risk.
12. After `apex/reviewDecide`, call `apex/status`. If Gate 1 is pending, report it and stop. Do not call
    `apex/nextTask` while a gate is pending. If the user's scope permits approval and the user explicitly approves or
    rejects Gate 1, call `apex/gateDecide` with `confirm: true`.

## Boundaries

Do not read task context for `needs_input`, `needs_review`, a stale task ID, or a task owned by another role. Write only
through APEX MCP. ARM MCP access is read-only and only supports indicative pricing when the user asks for it. Generated
review projections are derived from accepted state and are never editable authority.

## Output

Return the kernel result, review-package location, candidate-service rationale, challenger findings, unresolved
user-owned fields and the reason for stopping.
