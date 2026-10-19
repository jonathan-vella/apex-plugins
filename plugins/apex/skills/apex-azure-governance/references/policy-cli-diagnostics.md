# Policy CLI Diagnostics

Read-only Azure CLI commands for Azure Policy, ported from the upstream `azure-defaults` governance discovery reference
and the `azure-governance-discovery` skill. Accepted governance evidence still comes only from `apex governance select`
and `apex governance import` (or the reference baseline); these commands help explain, cross-check or diagnose it.

## Command Routing

| Class | Commands | How it runs |
| --- | --- | --- |
| Read and diagnostic | `az account show`, `az rest --method GET` on policy assignments, `az policy assignment list`, `az policy assignment show`, `az policy definition show`, `az policy set-definition show`, `az policy state list`, `az graph query` on `PolicyResources` | Directly, against the approved subscription and management-group ancestry |
| Changes Azure | `az policy assignment create`, `az policy assignment delete`, `az policy exemption create`, `az policy remediation create` | Never by the agent. There is no override path in APEX; a policy or exemption change is a governance owner's routed change through `apex preview`, the current runtime's Gate 4 and `apex deploy` (a CI-owned production run with human approval verified before apply is a planned target, DECISION-036) |

A diagnostic result is an observation. It never replaces, refreshes or renews accepted governance evidence; collection
age is measured from the accepted snapshot.

## Discovery Commands

### 1. REST API (includes management-group-inherited policies)

```bash
SUB_ID=$(az account show --query id -o tsv)
az rest --method GET \
  --url "https://management.azure.com/subscriptions/${SUB_ID}/providers/Microsoft.Authorization/policyAssignments?api-version=2022-06-01" \
  --query "value[].{name:name, displayName:properties.displayName, scope:properties.scope, enforcementMode:properties.enforcementMode, policyDefinitionId:properties.policyDefinitionId}" \
  -o json
```

`az policy assignment list` returns only subscription-scoped assignments. Management-group policies, which often carry
deny and tag enforcement, are invisible to it; use the REST call above when the question is the effective set.

### 2. Policy Definition Drill-Down

For each `Deny`, `DeployIfNotExists` or `Modify` assignment:

```bash
# Built-in or subscription-scoped definition
az policy definition show --name "<guid>" \
  --query "{displayName:displayName, effect:policyRule.then.effect, conditions:policyRule.if}" -o json

# Management-group-scoped custom definition
az policy definition show --name "<guid>" --management-group "<mg-id>" \
  --query "{displayName:displayName, effect:policyRule.then.effect}" -o json

# Policy set definition (initiative)
az policy set-definition show --name "<guid>" \
  --query "{displayName:displayName, policyCount:policyDefinitions | length(@)}" -o json
```

An effect written as a parameter reference (`[parameters('effect')]`) resolves from the assignment's parameter values,
not the definition default; read it from the assignment.

### 3. Resource Graph (supplemental, subscription-scoped)

```kusto
PolicyResources
| where type == 'microsoft.authorization/policyassignments'
| where properties.enforcementMode == 'Default'
| project name, displayName=properties.displayName,
  effect=properties.parameters.effect.value,
  scope=properties.scope
| order by name asc
```

Run it with `az graph query -q "<KQL>" --subscriptions <subscription-id>`. A single `PolicyResources` query misses
management-group-inherited assignments unless it also queries the management-group scope.

### 4. Compliance State

```bash
az policy state list --subscription <subscription-id> \
  --filter "complianceState eq 'NonCompliant'" \
  --query "[].{policy:policyDefinitionId, resource:resourceId, effect:policyDefinitionAction}" -o json
```

Compare policy-state definition IDs against every definition in the accepted snapshot, including initiative members
whose effect is audit-only. Otherwise initiative member policies the snapshot does not list as findings appear as
phantom drift.

## Diagnostic Workflow

1. Verify Azure access: `az account show`, then the token check in `apex-azure-defaults`.
2. List all effective assignments through the REST API.
3. Compare the count with the Azure portal (Policy, Assignments).
4. Drill into every `Deny`, `DeployIfNotExists` and `Modify` definition.
5. Check tag enforcement policies and allowed resource types and locations.
6. Report differences from the accepted snapshot as a reason to refresh through `apex governance select`, never as a
   replacement for it.

## Common Constraints

| Policy | Impact | Design response |
| --- | --- | --- |
| Required tags | Deployment fails without the tags | Carry the effective tag keys into every resource and resource group |
| Allowed locations | Resources are rejected | Select regions from the allowed set |
| SQL Microsoft Entra-only authentication | SQL password authentication is blocked | Use Entra-only authentication |
| Storage shared key | Shared key access is denied | Use managed identity and data-plane RBAC |
| Zone redundancy | Non-zonal SKUs are rejected | Select zone-redundant SKUs |
