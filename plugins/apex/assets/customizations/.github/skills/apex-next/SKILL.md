---
name: apex-next
description: "Routes the next APEX kernel step inside the same APEX agent by mapping owner roles to stage skills, hidden workers or captured rubber-duck reviews."
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

## APEX Next

Route the next APEX step from kernel state. The kernel selects the owner role; the foreground `APEX` agent remains
active and loads the mapped skill, delegates one hidden worker, or runs one captured rubber-duck review.

## Prerequisites

- The workspace has the APEX CLI and MCP server configured.
- A project is selected unless the current operation is project listing, creation, selection, replacement or deletion.

## Workflow

1. Call `apex/status` first. For a status-only request, no selected project, a pending gate, a blocker, or a terminal
   run, report the kernel state and stop.
2. Call `apex/nextTask` only after status leaves runnable work for the selected project. Do not call it again for the
   same unanswered input request or unresolved review, and do not poll.
3. Map the kernel result to a same-agent skill or hidden worker. Do not ask the user to choose a role and do not search
   session history.

   | Kernel result or `ownerRole`         | Same-agent skill or worker       |
   | ------------------------------------ | -------------------------------- |
   | `coordinator`                        | `apex-workflow`                  |
   | `requirements`                       | `apex-requirements`              |
   | `approver`                           | `apex-workflow`                  |
   | `governance-operator`                | `apex-operations`                |
   | `architect`                          | `apex-architecture`              |
   | `planner`                            | `apex-planning`                  |
   | `bicep-codegen`                      | worker `APEX CodeGen`            |
   | `terraform-codegen`                  | worker `APEX CodeGen`            |
   | `validator`                          | worker `APEX Validator`          |
   | `deployment-operator`                | `apex-operations`                |
   | `deployment-approver`                | `apex-operations`                |
   | `inventory-operator`                 | `apex-operations`                |
   | `diagnostician`                      | `apex-operations`                |
   | `diagnostic-operator`                | `apex-operations`                |
   | `quality-owner`                      | `apex-operations`                |
   | `quality-evaluator`                  | `apex-operations`                |
   | `rubber-duck-review`                 | built-in `rubber-duck` (below)   |
   | `request.intake`                     | `apex-requirements`              |
   | `request.decision`                   | `apex-architecture`              |
   | `request.governance`                 | `apex-operations`                |
   | `needs_review` for Gate 1            | `apex-requirements`              |
   | `needs_review` for Gate 2            | `apex-architecture`              |
   | `needs_review` for Gate 3            | `apex-planning`                  |

   Treat `status=needs_input`, `status=needs_review`, `status=task` and the exact `task.taskId` as authoritative
   result shapes; never coerce one shape into another.
   If a role or result is not mapped, report the unmapped role and stop; do not invent an owner.
4. Continue in the same foreground `APEX` agent for every same-agent skill. Load the mapped skill and carry the user's
   requested outcome, exact stop point and prohibited operations verbatim. Continue only until that requested outcome
   reaches its next stop point.
5. For a worker task, delegate through `task` with the exact `task.taskId`. Tell the worker to call
   `apex/taskContext` with that task ID for complete inputs, acceptance criteria and output paths. Include the user's
   requested outcome and stop boundary. Do not provide model, model-policy or reasoning-effort.
6. After worker completion or same-agent stage completion, call `apex/status`. If a gate is pending, report it and stop.
   Never call `apex/nextTask` after `apex/reviewDecide` or `apex/reviewComplete` while a gate is pending.

## Rubber-duck reviews

The Requirements, Architecture and Plan reviews run in the built-in `rubber-duck` agent. A managed hook saves its exact
output and the kernel derives the findings from that capture; this agent never writes, edits or restates findings.

1. Call `apex/taskContext` with the exact `task.taskId` and read `reviewRequest`.
2. Call `task` once with `agent_type: "rubber-duck"`, `mode: "sync"` and `prompt` set to `reviewRequest.prompt`
   exactly as returned. Copy it character for character; add nothing before or after it and do not summarize or
   extend it. Do not provide model, model-policy or reasoning-effort.
3. Call `apex/reviewComplete` with only the task ID. Do not pass, interpret or correct rubber-duck's answer.
4. If `apex/reviewComplete` fails, branch on the error. For a missing capture, run rubber-duck once more with the same
   prompt. For `APEX_CONFLICT` or `APEX_STALE`, do not run rubber-duck: call `apex/nextTask` and follow what it returns.
   For any other failure, call `apex/nextTask`. Run rubber-duck again only when `apex/nextTask` returns a new
   `rubber-duck-review` task, and use that task's prompt. Then call `apex/reviewComplete` again. If that second attempt
   fails, stop and report the error to the user. Never complete a review task with `apex/completeTask` or author
   findings yourself.
5. When `apex/nextTask` returns `needs_review`, load the stage skill for that gate. Record a disposition for every
   finding through `apex/reviewDecide`: fix (`revise`), accept (`accept-risk`), or dismiss with a reason; Requirements
   obligations may also be acknowledged with an owner. Gates still need the user's explicit approval.

## Boundaries

- No `/agent` switching, Agent picker directions, copyable specialist prompts or interactive specialist handoffs.
- Delegate only `APEX CodeGen` and `APEX Validator`. Run built-in `rubber-duck` only for a kernel `rubber-duck-review`
  task, with the exact kernel prompt; any other rubber-duck answer is advice and never kernel evidence.
- Never delegate intake, user questions, gate decisions, governance selection, or any other interactive work.
- Never collect, answer, summarize or record a question unless the kernel returned it to the active `APEX` agent.
- Never replace invalid choices with defaults or recommendations.
- Never use `session_store_sql`, SQL, session-history searches or tool discovery to route work.

## Output

Report the mapped skill or worker, the kernel task/request/review identifier, the carried stop point, and the next
action. If the requested outcome is complete, summarize and stop.
