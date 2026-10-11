<!-- ref:azuread-pattern-v1 -->

# Entra Provider Ownership and Application Lifecycle

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). Entra changes require a supported bounded operation and Gate 4;
an opt-in flag or permission grant is not approval.

## Existing Identity First

Use accepted existing application/principal identifiers when identity ownership is external to the workload.
Do not hardcode tenant-specific GUIDs or create an application because a lookup failed.
Preserve tenant, principal type, owner, accepted least-privilege roles and narrow resource scope.

```hcl
data "azuread_application" "api" {
  object_id = var.accepted_api_application_object_id
}

resource "azurerm_role_assignment" "workload" {
  scope                = var.accepted_resource_scope
  role_definition_name = var.accepted_least_privilege_role
  principal_id         = var.accepted_workload_principal_id
}
```

Role creation is provider syntax only; never run it directly or infer a role from this example.
Parameter materialization belongs to the accepted binding; it does not introduce an unversioned environment manifest.
Terraform execution applies the exact saved approved plan, not a fresh `-var-file` apply.

## New Application as an Explicit Decision

Record why existing identities cannot meet the accepted requirement, the tenant, naming, owner/break-glass identities,
permissions, credential/federation posture, lifecycle and destruction risk. The task must authorize that output.

```hcl
resource "azuread_application" "api" {
  display_name = "${var.project}-${var.environment}-api"
  owners = distinct(concat(
    [var.accepted_deployer_object_id],
    var.accepted_break_glass_object_ids
  ))

  lifecycle {
    prevent_destroy = true
    # Only if IAM explicitly owns this field:
    ignore_changes = [owners]
  }
}

resource "azuread_service_principal" "api" {
  client_id = azuread_application.api.client_id

  lifecycle {
    prevent_destroy = true
  }
}
```

Validate exact provider schema and accepted owner identities. `prevent_destroy` is a lifecycle control, not approval.
Ignore only externally owned fields; do not hide identity drift.

## Permission and Governance Evidence

Graph permission requirements depend on delegated/application access, Entra roles, ownership and the operation.
Do not assert that querying `/me/oauth2PermissionGrants` proves effective permissions or that
`Application.ReadWrite.All` is always required. Use accepted permission evidence and
[Entra app registration](../../apex-entra-app-registration/SKILL.md)/
[RBAC](../../apex-azure-rbac/SKILL.md) to assess the actual least-privilege requirement.
A read failure is a blocker, not permission to broaden access.

For applicable policy, bind each constraint to the exact generated block and accepted attestation evidence.
The kernel owns current governance and CodeGen receipt schemas; do not synthesize old `L2` or recall sidecars.
