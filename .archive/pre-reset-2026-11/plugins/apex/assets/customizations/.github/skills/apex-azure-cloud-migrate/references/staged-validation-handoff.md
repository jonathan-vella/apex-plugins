# Staged Validation And Handoff

A migration proceeds through kernel-authorized stages. Passing an earlier stage does not prove a later stage, and no
stage may be skipped because a plan exists.

## Stages

| Stage | Required evidence | Blocker condition |
| --- | --- | --- |
| Assessment | Accepted scope, risks, target intent, and owners | Missing source evidence or unresolved critical risk |
| Implementation | Authorized capability receipt and trace to approved intent | Missing authorization or rejected output |
| Functional validation | Accepted isolated behavior evidence | Failure, missing test evidence, or unsupported runtime |
| Integration validation | Accepted interface, identity, data, and observability evidence | Contract or access mismatch |
| Production readiness | Accepted governance, recovery, operations, and approval evidence | Unaccepted gate or incomplete ownership |

## Handoff Rules

Preserve the producing capability, receipt identifier, status, evidence reference, blockers, and next task. Route work
only to the capability named by the active task envelope. Do not execute, simulate, or claim a handoff, validation, or
deployment.

## Deferred Implementation Boundary

Code migration, source-runtime inspection, local testing, and deployment are provider- or workspace-backed operations.
Until a capability for that operation is separately qualified, record `defer-capability` with the required scope and
acceptance evidence rather than using a CLI, SDK, repository scan, or generated migration output.
