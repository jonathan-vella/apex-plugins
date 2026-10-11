# Role CLI Commands And Delivery Shapes

Azure CLI commands and IaC shapes ported from the upstream `apex-azure-rbac` skill. Read commands help select and verify
a role; every command that creates a role or an assignment changes Azure and is never run by the agent.

## Command Routing

| Class | Commands | How it runs |
| --- | --- | --- |
| Read and diagnostic | `az role definition list`, `az role assignment list`, `az ad signed-in-user show`, `az ad sp show` | Directly, against the approved scope |
| Changes Azure | `az role definition create`, `az role assignment create`, `az role assignment delete` | Never by the agent. Delivered by the selected IaC binding through `apex preview`, the current runtime's Gate 4 and `apex deploy` (a CI-owned production run with human approval verified before apply is a planned target, DECISION-036) |

Read output is an observation. The typed assignment intent still cites accepted role-catalog, identity and scope
evidence.

## Verify A Role Against The Live Catalog

Preserve every permission block and scope:

```bash
az role definition list \
  --name "<RoleNameOrId>" \
  --query "[].{name:roleName,id:name,permissions:permissions,assignableScopes:assignableScopes}" \
  --output json
```

Evaluate all `permissions[]`: `actions` minus `notActions` for management-plane operations, and `dataActions` minus
`notDataActions` for data-plane operations, with wildcard matching against the requested provider operation. Combine
grants across blocks and applicable assignments; exclusions subtract only from their own grant, not other roles.
Management `*/read` does not grant blob or secret data access. Check assignment scope and inheritance, conditions, deny
assignments and active PIM state separately. A role definition alone does not prove effective access. Missing
permissions or unavailable catalog evidence means unverified, not granted.

Inspect existing assignments at a scope (read-only):

```bash
az role assignment list --scope <scope> --include-inherited --output table
```

Find built-in role candidates in Microsoft Learn first (for example a search for "Azure built-in role read blob
storage"), then verify each candidate here.

## Custom Role Definition

Only when no built-in role fits, scaffold a definition with the required `actions` and `dataActions` only. The JSON is
a reviewable artifact; creating the role changes Azure.

```json
{
  "Name": "<CustomRoleName>",
  "Description": "<purpose>",
  "Actions": ["<provider>/<resource>/<action>"],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": ["/subscriptions/<subscription-id>"]
}
```

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az role definition create --role-definition custom-role.json
```

## Role Assignment

The CLI form documents the operation. In APEX, the assignment ships with the IaC binding below.

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az role assignment create \
  --assignee <objectId|appId> \
  --role "<RoleName>" \
  --scope <scope>
```

### Bicep (AVM, preferred)

AVM resource modules accept a `roleAssignments` array, so assign the role where the module deploys the resource. Pin the
module version from current registry evidence.

```bicep
module storage 'br/public:avm/res/storage/storage-account:<version>' = {
  name: 'storage'
  params: {
    name: storageAccountName
    roleAssignments: [
      {
        principalId: principalId
        roleDefinitionIdOrName: 'Storage Blob Data Reader'
        principalType: 'ServicePrincipal'
      }
    ]
  }
}
```

### Bicep (raw resource on an existing target)

Use `guid()` for the assignment name so assignments are idempotent across deployments, and set
`principalType: 'ServicePrincipal'` for managed identities.

```bicep
param principalId string
param roleDefinitionGuid string
param storageAccountName string

resource targetResource 'Microsoft.Storage/storageAccounts@2026-04-01' existing = {
  name: storageAccountName
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(targetResource.id, principalId, roleDefinitionGuid)
  scope: targetResource
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionGuid)
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Terraform

```hcl
resource "azurerm_role_assignment" "this" {
  scope                = azurerm_resource_group.target.id   # or any resource ID
  role_definition_name = "<RoleName>"                       # for example "Storage Blob Data Reader"
  principal_id         = azurerm_user_assigned_identity.app.principal_id
  principal_type       = "ServicePrincipal"
  # For stable imports and refreshes, lock to the role definition GUID instead:
  # role_definition_id = "/subscriptions/${data.azurerm_subscription.current.subscription_id}/providers/Microsoft.Authorization/roleDefinitions/<role-id-guid>"
}
```

AVM Terraform callers should prefer the
[`Azure/avm-res-authorization-roleassignment`](https://registry.terraform.io/modules/Azure/avm-res-authorization-roleassignment/azurerm/latest)
module over a raw `azurerm_role_assignment` when available.

## Prerequisites For Granting Roles

The identity that runs the routed change needs `Microsoft.Authorization/roleAssignments/write` at or above the target
scope:

- **User Access Administrator**: least privilege for assignment only.
- **Owner**: full access, including assignment.
- **Custom role** with `Microsoft.Authorization/roleAssignments/write`.

Record a missing permission as a blocker. Never propose a broader role for the workload principal to compensate.
