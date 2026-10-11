---
name: apex-workflow
description: "Provides internal APEX workflow routing for status, resume, project selection, and next tasks."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

## APEX Workflow

Use this skill to orient an interactive agent without reconstructing workflow state from chat or files.

## Prerequisites

- The workspace has the APEX CLI and MCP server configured.
- The user has selected or identified an APEX project when more than one exists.

## Workflow

1. Call `apex/status` for the selected project.
   For a status-only request, report that result and stop without calling `apex/nextTask`.
   If status returns `runtime_mismatch`, report both versions and its `nextAction`, then stop; every other APEX tool
   fails with `APEX_RUNTIME_MISMATCH` until the user fixes the runtime or workspace version.
2. If the selected project is wrong or absent, use the active client question mechanism to select a project, then repeat
   `apex/status`.
3. If status identifies blockers, gates, or a terminal run, report that kernel state and do not infer a task. For a Gate
   2 or 3 "readiness checkpoint is not recorded" blocker, call `apex/nextTask` once (it retries recording) and report
   the blocker only if it persists.
4. Otherwise route the next step with the `apex-next` skill (`.github/skills/apex-next/SKILL.md`). It maps
   `needs_input`, `needs_review` and `status=task` results to their owner and preserves the exact request, review hash
   or `task.taskId` for that owner task only. It must not add later-stage prerequisites to an earlier task, and it
   continues directly when the active agent already owns the next result. Read task context only for `status=task`, as
   its owner. Do not poll unresolved input or review results; obtain a fresh result after the owning role records
   answers or dispositions.
5. For resume, fetch fresh status instead of relying on an earlier conversation. On an `APEX_STALE` error, refresh
   status and do not reuse a task ID, request ID, journal head, or owner epoch.

Do not infer progress from generated files, conversation history, or routing. If selection is ambiguous, the
interactive agent may use its active client question mechanism before repeating `apex/status`.

## Boundaries

`apex/nextTask` returns `needs_input`, `needs_review`, or `task`. Terminal, blocked, missing-project, authorization,
and stale conditions are represented by status or stable kernel errors; do not invent additional results or transitions.

## Output

Report the project, run, environment, current state, blockers, and one kernel-provided next action.
