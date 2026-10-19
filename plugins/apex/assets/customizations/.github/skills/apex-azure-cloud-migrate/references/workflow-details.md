# Migration Reporting and Handoff

Read [execution boundaries](execution-boundaries.md). The kernel owns stages, status, artifact acceptance and
continuation; do not create or update an independent `migration-status.md` workflow.

## Status Reporting

A report can project the kernel's receipts without advancing them:

| Concern | Report only what is evidenced |
| --- | --- |
| Assessment | Accepted inventory, source/target mapping, risk and owner choices |
| Code conversion | Authorized conversion receipt, source/output paths and requirement traces |
| Functional tests | Accepted isolated results, runtime/tool versions and failures |
| Integration | Identity, data, service-discovery, interface and observability coverage |
| Production readiness | Governance, continuity/cutover, recovery and approval evidence |

Use the active task's allowed artifact/output contract. Example report headings and directory layouts in scenario
references are useful field guidance, not replacement schemas or permission to write files.
Assessment-only stops after acceptance. Missing conversion/testing capability returns a blocker, not an invented stage.

## Handoff

Preserve producing capability, receipt, evidence hash, scope, status and blockers. Return mapped requirements and
unresolved user choices to the kernel-selected preparation/architecture/planning task. Infrastructure is authorized
CodeGen work; migration acceptance never skips those gates. Deployment, data migration and cutover each need their
own accepted validation, preview and approval.

## Errors

| Error | Assessment or authorized owner action |
| --- | --- |
| Unsupported runtime | Verify current target documentation and accepted toolchain; block unsupported conversion |
| No direct service mapping | Compare alternatives and record semantic gaps; do not silently choose a SKU |
| Incompatible pattern/dependency | Load the scenario/runtime guide, record behavior/test gaps and return to conversion owner |
| `azd init --template` rejects non-empty directory | If preparation is authorized, stage reviewed files in an approved project-local empty directory; preserve source and existing IaC |
| Missing schema/package/identity/transport | Block the next stage; renew the owning inputs, never weaken checks |

## Port Source

Adapted from [the upstream workflow details](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/workflow-details.md).
