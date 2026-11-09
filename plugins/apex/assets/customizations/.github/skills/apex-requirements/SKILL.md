---
name: apex-requirements
description: "Guides the foreground APEX agent during kernel-issued Requirements intake, requirements tasks and review dispositions, ending at the Gate 1 intent confirmation. Preserves scope, typed answers, unknowns and service preferences. Not independent project setup or Architecture SKU selection."
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
2. For `status=needs_input`, ask every returned question through `ask_user` in chat. Use single-select controls without
   adding or reordering kernel options. For a multi-value question that carries a recommendation, first ask one
   single-choice question offering to accept the recommended set (name its values) or customize. Accept maps exactly,
   so record it without a second confirmation. To customize, or when there is no recommendation, use native
   multi-select if the tool offers it; otherwise show the exact kernel options numbered in kernel order, collect the
   numbers, resolve them back to option values, and confirm the complete selection before recording. Name each
   invalid, duplicate, empty, ambiguous or out-of-range entry and why before asking again. `none` is exclusive.
   Recommendations are proposals only; never submit them without the accept answer.
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
   For steps 7 and 8 only, you may ground recommendation text in `apex-azure/cloudarchitect` (`cloudarchitect_design`),
   `apex-azure/documentation` (`microsoft_docs_search`, `microsoft_docs_fetch`) and
   `apex-azure/wellarchitectedframework` (`wellarchitectedframework_serviceguide_get`) with bounded queries, following
   [Design Stage Grounding](../apex-azure-defaults/references/azure-mcp-tools.md#design-stage-grounding). This is
   advisory: label each such recommendation with its source and retrieval time, never record it as a user answer, default
   or confirmed requirement, and never submit a service or SKU as a decision. If a namespace is unavailable or denied,
   state that and continue from the kernel's question catalog; intake never depends on it. `policy` and `bicepschema` are
   not used in Requirements.
9. Submit the typed requirements artifact through `apex/requirementsComplete`. Report the materialized read-only Gate 1
   review package under `agent-output/<project>/<run>/01-requirements/` (the run-level `00-index.md` one folder up links
   every stage), including requirements, recommendations, SKU preferences and
   challenger findings.
10. Immediately call `apex/nextTask` after submitting requirements. When it returns the `requirements-review` task,
    run the rubber-duck review steps in `apex-next` with that exact `task.taskId`. If rubber-duck is unavailable or the
    capture fails twice, report the pending review task and stop.
11. When `needs_review` returns, do not request task context or run rubber-duck again. Record a disposition for every
    finding: fix, accept or dismiss with a reason, or acknowledge an obligation with an owner. For accept-risk, show
    `owner: <project risk owner>, expires in 90 days`, draft the rationale and ask only for confirmation. Existing
    blocking findings require the normal correction and fresh review path; do not automatically acknowledge, dismiss or
    accept risk.
    Deferred validation and obligation owners are separate from the project's `riskOwner`; use the user's explicit
    accountable owner (for example `partner`), not an inferred `customer` default.
12. After `apex/reviewDecide`, call `apex/status`. If Gate 1 is pending, report it and stop. Do not call
    `apex/nextTask` while Gate 1 is pending. Gate 1 is the single intent confirmation: show the user the run's
    purpose (`lab` by default; `production` is unavailable until the CI-owned production flow ships), its target scope
    and the accepted requirements, and say that confirming binds all three. If the user's scope permits it and the
    user explicitly confirms or rejects, call `apex/gateDecide` with `gate: 1`, `decision: "approved"` (confirmed) or
    `"rejected"` (rejected) and `confirm: true`. Never infer the decision. Changing the purpose or target needs a new
    project or run; changed requirements reopen Gate 1.

## Boundaries

An existing recorded lab delegation may replace only the Gate 1 stop in step 12 through
[Delegated lab gates](../apex-workflow/SKILL.md#delegated-lab-gates). It binds exact accepted Requirements and does not
confirm any intake answer, unknown, deferral, obligation or risk on the user's behalf.

To correct a recorded intake answer, read `apex/inputHistory`, build an `input-amendment-v1` with that request ID
and current `baseAnswersHash`, and call `apex/previewInputAmendment`. Present the corrected values, invalidated
reviews/gates and re-approval path. Only after the user explicitly confirms that preview, call `apex/amendInput`
with its `proposalHash` as `expectedHash`, the same amendment and reason, and `confirm: true`. Then resume through
`nextTask`; Requirements and dependent approvals must be reviewed again. If a rubber-duck review is running,
finish it or have the user stop and cancel it from the terminal first. Never delete or recreate a project to
correct an answer, overwrite audit history, or treat Autopilot/Allow All as confirmation.

Do not read task context for `needs_input`, `needs_review`, a stale task ID, or a task owned by another role. Write only
through APEX MCP. Any external observation remains subject to the foreground agent's granted read-only tools;
retail pricing belongs to `apex-azure/pricing` under `apex-azure-defaults`. Requirements
does not choose Architecture SKUs or accept prices from memory. Generated review projections are never editable authority.

## Examples

| Input | Required response |
| --- | --- |
| Kernel `needs_input`, user has already stated a target | Confirm/correct the stated value for that exact question; do not ask for task context |
| Intake-only request reaches its requested stop point | Report recorded context and stop; do not submit requirements, start review or ask for Gate 1 |
| Requirements review resolves and Gate 1 is pending | Show purpose, target and accepted requirements; wait for explicit confirmation without polling |

## Output

Return the kernel result, review-package location, candidate-service rationale, challenger findings, unresolved
user-owned fields and the reason for stopping.
