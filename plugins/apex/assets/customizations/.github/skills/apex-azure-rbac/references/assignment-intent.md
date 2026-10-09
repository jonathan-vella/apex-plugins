# Assignment Intent Fields

Represent a future role assignment as typed intent, not direct execution.

| Field | Purpose |
| --- | --- |
| Principal reference | Stable logical identity plus accepted identity-output reference; never expose the physical ID. |
| Principal purpose and type | Workload function and accepted user, group, service-principal, or managed-identity type. |
| Required operation | Narrow action or data access requirement. |
| Permission plane | Control plane, data plane, or explicitly justified combination. |
| Role requirement | Accepted built-in definition ID or a bounded unresolved custom-role requirement. |
| Target scope | Stable target resource reference and environment. |
| Scope rationale | Why resource, resource-group, or subscription scope is necessary. |
| Requirement traceability | IDs of requirements served by the access. |
| Evidence references | Governance, identity, role-catalog, and target-resource evidence identifiers. |
| Assignment identity | Deterministic key derived from scope, principal, and role for idempotent delivery. |
| Caller prerequisite | Evidence that the delivery principal can write role assignments at the target scope. |
| Conditions and expiry | Accepted conditional-access expression, eligible duration, or review point when required. |
| Ordering | Identity and target dependencies that must exist before assignment validation. |
| Delivery path | Selected IaC binding or explicitly approved capability. |

## Idempotence And Authorization

The selected binding must derive assignment identity deterministically from target scope, principal, and role definition.
Random assignment names create duplicates and unstable imports. The future delivery principal needs the
`Microsoft.Authorization/roleAssignments/write` permission at or above the target scope; record missing authorization as
a blocker rather than proposing a broader role for the workload principal.

## Propagation And Validation

Role assignment creation and effective data-plane access are separate signals. Record the later validation operation,
expected target, and bounded propagation handling. Do not treat eventual-consistency delay as permission to retry
indefinitely or to add a second broader assignment.

## Delivery Constraint

Role assignment changes must be represented through the selected IaC binding and approved deployment workflow. Do not
produce Azure CLI commands, raw Bicep/Terraform role-assignment resources, custom-role JSON, or credential material in
the advisory skill output.
