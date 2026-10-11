# Azure Resource Graph Queries

Azure Resource Graph (ARG) commands and KQL patterns ported from the upstream `azure-resource-graph.md`,
`lookup-workflow.md` and the shared Resource Graph primer. ARG is read-only: every query here may run directly against
the approved subscriptions. A query result is an observation; the typed inventory decision still cites accepted
inventory evidence from `apex/taskContext` or `apex/inventory`.

## How to Query

```bash
az graph query -q "<KQL>" --query "data[].{col1:field1, col2:field2}" -o table
```

The command needs the Resource Graph extension, installed once in the local CLI:

```bash
az extension add --name resource-graph
```

| Flag | Purpose |
| --- | --- |
| `-q` | KQL query string |
| `--query` | JMESPath to shape output columns |
| `--first N` | Limit to N results (a row limit, not an authorization or completeness boundary) |
| `--subscriptions` | Scope to specific subscription IDs |
| `--management-groups` | Scope to management groups |
| `-o table` | Table output (also `json`, `tsv`) |

`az graph query` runs across all subscriptions the principal can read unless scoped. Always pass `--subscriptions` or
`--management-groups` for the approved scope, and follow `skipToken` pages before calling a result complete.

## Lookup Workflow

1. **Prefer a dedicated tool for one resource type.** When the client has a service-specific read tool or command for
   the type (for example `az vm list`, `az storage account list`, `az aks list`), use it for a single-type question.
   App Service and Container Apps listings go to ARG.
2. **Use ARG for cross-cutting questions:** cross-subscription, cross-type, orphan candidates and tag audits. Author the
   KQL from the patterns below.
3. **Execute and shape** with JMESPath; do not load raw JSON dumps into context:

   ```bash
   az graph query -q "<KQL>" --query "data[].{name:name, type:type, rg:resourceGroup}" -o table
   ```

Lookup constraints:

- Use `=~` for case-insensitive type matching; resource types are lowercase.
- Scope every query with `--subscriptions`; `--first` limits rows, not authorization scope.
- Never use ARG for real-time monitoring; the index lags behind changes.
- ARG cannot change resources. Any remediation it suggests changes Azure and routes through `apex deploy` (Gate 4);
  CI-owned production runs are a planned target, not available today.

| Error | Cause | Fix |
| --- | --- | --- |
| `resource-graph extension not found` | Extension not installed | `az extension add --name resource-graph` |
| `AuthorizationFailed` | No read access to the subscription | Check RBAC; `Reader` is required |
| `BadRequest` on query | Invalid KQL syntax | Verify table and column names; use `=~` for case-insensitive match |
| Empty results | No matching resources or wrong scope | Check `--subscriptions`; verify resource type spelling |

## Key Tables

| Table | Contents |
| --- | --- |
| `Resources` | All ARM resources: name, type, location, properties, tags, SKU |
| `ResourceContainers` | Subscriptions, resource groups, management groups |
| `HealthResources` | Resource health availability status |
| `ServiceHealthResources` | Azure service health events and incidents |
| `AuthorizationResources` | Role assignments and definitions |
| `AdvisorResources` | Azure Advisor recommendations |
| `PolicyResources` | Policy assignments and compliance states |

## KQL Essentials

- `=~` is case-insensitive equals; use it for the `type` field.
- `properties.fieldName` navigates the properties JSON bag.
- `mv-expand` flattens arrays (subnets, IP configurations, tag bags).
- `isempty()` and `isnotnull()` check for null or empty fields.
- `tostring()` converts dynamic fields for display and grouping.
- `join kind=` joins across tables; `summarize` groups and aggregates.

## Resource Inventory Patterns

**Count all resources by type:**

```kql
Resources | summarize count() by type | order by count_ desc
```

**Inventory by type and location:**

```kql
Resources | summarize count() by type, location | order by type asc
```

**Cross-subscription inventory with subscription names:**

```kql
Resources
| join kind=leftouter (
    ResourceContainers
    | where type == 'microsoft.resources/subscriptions'
    | project subscriptionId, subscriptionName=name
) on subscriptionId
| summarize count() by subscriptionName, type
| order by subscriptionName asc, count_ desc
```

**All resources in a resource group:**

```kql
Resources
| where resourceGroup =~ '<rg-name>'
| project name, type, location, sku.name, kind
```

## Orphaned Resource Patterns

Keep full `id` and `subscriptionId` in every resource-level result. Correlate
Cost Management `ResourceId` with `id` case-insensitively, never with `name` or
resource group alone. Names can repeat across groups and subscriptions. Discovery
identifies candidates, not confirmed waste; verify ownership, attachment semantics
and utilization before recommending any separately approved removal.

**Unattached managed disks:**

```kql
Resources
| where type =~ 'microsoft.compute/disks'
| where isempty(managedBy)
| project id, subscriptionId, name, resourceGroup, location, diskSizeGb=properties.diskSizeGB, sku=sku.name
```

**Unused public IP addresses:**

```kql
Resources
| where type =~ 'microsoft.network/publicipaddresses'
| where isempty(properties.ipConfiguration)
| project id, subscriptionId, name, resourceGroup, location, sku=sku.name
```

**Orphaned network interfaces:**

```kql
Resources
| where type =~ 'microsoft.network/networkinterfaces'
| where isempty(properties.virtualMachine)
| project id, subscriptionId, name, resourceGroup, location
```

**Idle load balancers (no backends):**

```kql
Resources
| where type =~ 'microsoft.network/loadbalancers'
| where array_length(properties.backendAddressPools) == 0
| project id, subscriptionId, name, resourceGroup, location
```

## Tag & Compliance Patterns

Select the exact case-sensitive tag key from the discovered policy contract and
evaluate only applicable scopes, resource types and exemptions. Substitute
`<required-tag-key>` below; repeat for each applicable key. Empty values count as
missing. With no tag policy, use the greenfield tag contract that the runtime projects into
`apex/taskContext`, not a universal legacy `Environment`/`CostCenter` contract. Resource-group tag
requirements must be evaluated on `ResourceContainers`, not all resources.

**Resources missing a required tag:**

```kql
Resources
| where isempty(tags['<required-tag-key>'])
| project id, subscriptionId, name, type, resourceGroup, tags
```

**Tag coverage analysis by type:**

```kql
Resources
| extend hasTag = isnotempty(tags['<required-tag-key>'])
| summarize total=count(), tagged=countif(hasTag) by type
| extend coverage=round(100.0 * tagged / total, 1)
| order by coverage asc
```

**Resources with public network access:**

```kql
Resources
| where properties.publicNetworkAccess =~ 'Enabled'
| project name, type, resourceGroup, location
```

## Health & Diagnostics Patterns

**Resource health status:**

```kql
HealthResources
| where type =~ 'microsoft.resourcehealth/availabilitystatuses'
| where properties.availabilityState != 'Available'
| project name, state=properties.availabilityState, reason=properties.reasonType
```

**Active service health incidents:**

```kql
ServiceHealthResources
| where type =~ 'microsoft.resourcehealth/events'
| where properties.Status == 'Active'
| project name, title=properties.Title, status=properties.Status
```

**Failed provisioning states:**

```kql
Resources
| where properties.provisioningState != 'Succeeded'
| project name, type, resourceGroup, state=properties.provisioningState
```

## Service-Specific Patterns

**App Services and their plans:**

```kql
Resources
| where type =~ 'microsoft.web/sites'
| project name, kind, location, plan=properties.serverFarmId, state=properties.state, resourceGroup
```

**Container Apps:**

```kql
Resources
| where type =~ 'microsoft.app/containerapps'
| project name, location, provisioningState=properties.provisioningState, resourceGroup
```

**VNet and subnet discovery:**

```kql
Resources
| where type =~ 'microsoft.network/virtualnetworks'
| mv-expand subnet=properties.subnets
| project vnetName=name, subnetName=subnet.name, prefix=subnet.properties.addressPrefix
```

**Advisor cost recommendations:**

```kql
AdvisorResources
| where properties.category == 'Cost'
| project name, impact=properties.impact, solution=properties.shortDescription.solution
```
