---
name: apex-workflow
description: "Orients the foreground APEX agent for status, resume, missing-project selection and kernel-routed continuation. Refreshes stale context and follows apex-next only when work is runnable. Not an independent state machine, repository maintenance or permission to create a project by default."
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

## Delegated lab gates

Human approval is the default. Only when the user requested continuation and fresh `apex/status` includes a
non-revoked, unexpired `delegation` naming the pending Gate 1 or Gate 4, call `apex/gateDelegate` with its exact
`policyHash` and `consentHash`. For Gate 4 first read the full current `apex/preview`, including all pages, and pass
its exact preview and immutable approval-context hashes. The kernel evaluates consent, run, target, writer, provider
observations, blockers and allowed changes; the agent never decides whether to waive a check.

On success report a **delegated agent decision**, not human preview review, refresh status and continue only within
the user's requested outcome. On any failure report the blocker and stop; do not retry with `gateDecide`, invent
consent, substitute a hash or repair evidence. Policy confirmation is human interactive CLI-only. Delegated destroy
is unsupported and requires a separately previewed normal human approval. Intake confirmations, architecture
questions, governance choices, risk decisions and expired authentication remain human blockers.

## Output

Report the project, run, environment, current state, blockers, and one kernel-provided next action.

## Examples

| Request or state | Required response |
| --- | --- |
| Status in a configured workspace with zero projects | Report the kernel's missing-project state; do not manufacture a workload |
| Resume after chat restart | Read current kernel status, not conversation history or generated-file appearance |
| `runtime_mismatch` or stale request | Report remediation/fresh status and stop using old task IDs and ownership data |
