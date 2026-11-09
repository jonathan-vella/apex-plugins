---
name: apex-codegen
description: "Guides the hidden APEX CodeGen worker for one kernel-issued IaC generation task with accepted intent and selected-track binding. Stops after the generation receipt. Not interactive intake, independent validation, direct repository writes or deployment."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

## APEX Code Generation

Use this skill only inside the hidden CodeGen worker.

## Prerequisites

- `apex/taskContext` supplies approved intent, one selected-track binding, policy obligations, output paths, and limits.
  Call it once. It is intentionally small: inputs listed with `inlined: false` in `inputReferences` are not in `inputs`.
  Read every input listed in `inputReferences`, in order, with `apex/readTaskInput` by `inputHash`, in bounded chunks
  following `nextOffset` until it is absent, before generating.
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

## Examples

| Task outcome | Required response |
| --- | --- |
| Current task has accepted intent and Bicep binding | Generate only that bounded Bicep batch through the issued capability |
| `apex/generateIac` succeeds | Return the accepted manifest/handoff receipt and stop; no duplicate completion or staging |
| Required binding or field is absent | Return the exact missing field/blocker to the parent; never ask the user or select a substitute |
