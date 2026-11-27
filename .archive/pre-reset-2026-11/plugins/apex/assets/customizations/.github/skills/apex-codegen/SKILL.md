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

1. Author and stage real IaC files for the selected track with `apex/stageFile` (`azure.yaml` and `infra/main.bicep` for
   Bicep; `versions.tf`, `provider.tf`, `variables.tf`, `main.tf`, `outputs.tf` for Terraform):
   - Use `id.replaceAll("-", "_")` as each planned resource's top-level Bicep `module`/`resource` symbol or Terraform
     label so every manifest entry maps cleanly.
   - Declare typed `param`s / `variable`s for `environment-inputs` (including `deferred` deployment-time inputs; use
     `@secure()` / `sensitive = true` for secret references and never emit literal secrets or fake Key Vault IDs).
   - Pin the exact AVM module versions (`br/public:avm/res/<group>/<module>:<version>`) and native API versions from
     `iac-binding`, wire cross-resource references via symbolic outputs/properties, and satisfy all `deny` controls in
     `policy-property-map` plus the APEX security baseline.
2. Call `apex/generateIac` (`{ taskId }`) to format, compile-check (`bicep build` / `bicep lint`), and seal the staged
   tree. If `generateIac` reports a compiler or lint error, update the staged file via `apex/stageFile` (passing
   `expectedSha` from the prior `stageFile` receipt) and call `apex/generateIac` again.
3. A successful `apex/generateIac` result already completes the issued task and accepts its manifest and handoff.
   Return that receipt and stop. Do not call `apex/completeTask` again or perform follow-up staging, generation,
   validation, delegation, or repository work.
4. Return `needs_input` only when an accepted plan artifact cannot be read or contains an irreconcilable contradiction;
   `deferred` entries in `environment-inputs` are expected deployment-time parameters, not CodeGen blockers.

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
