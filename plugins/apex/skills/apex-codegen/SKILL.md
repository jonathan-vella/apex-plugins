---
name: apex-codegen
description: "Provides hidden-worker guidance for one bounded APEX IaC generation task with approved intent and binding."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

## APEX Code Generation

Use this skill only inside the hidden CodeGen worker.

## Prerequisites

- `apex/taskContext` supplies approved intent, one selected-track binding, policy obligations, output paths, and limits.
- The task identifies a single dependency-sized generation batch.

## Workflow

1. Call `apex/generateIac` once for the issued task ID, accepted intent, and selected-track binding.
2. Preserve exact module, provider, API, security, naming, ownership, and environment-input obligations.
3. Keep secret values out of generated content; use only typed references supplied by the kernel. Use `apex/stageFile`
   only for additional assigned files before completion.
4. A successful `apex/generateIac` result already completes the issued task and accepts its manifest and handoff.
   Return that receipt and stop. Do not call `apex/completeTask` again or perform follow-up staging, generation,
   validation, delegation, or repository work.
5. Return `needs_input` when a required binding or value is absent.

## Boundaries

Do not execute, format, validate, preview, deploy, write directly to repository paths, or delegate work.

## Output

Return the typed completion or `needs_input` result with affected field IDs.
