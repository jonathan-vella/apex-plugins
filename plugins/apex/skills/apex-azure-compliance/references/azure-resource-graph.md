# Azure Resource Graph Compliance Queries

Azure Resource Graph (ARG) queries for compliance auditing, ported from the upstream `azure-resource-graph.md` and the
shared Resource Graph primer. ARG is read-only; these queries may run directly against the approved subscriptions.
Results are observations until accepted as evidence.

## How to Query

```bash
az graph query -q "<KQL>" --query "data[].{name:name, type:type}" -o table
```

Install the extension once in the local CLI with `az extension add --name resource-graph`. `az graph query` runs across
all subscriptions the principal can read unless you scope it with `--subscriptions <id1> <id2>` or
`--management-groups <name>`. Always scope to the approved boundary and follow `skipToken` pages.

| Table | Contains |
| --- | --- |
| `Resources` | All ARM resources (name, type, location, properties, tags) |
| `ResourceContainers` | Subscriptions, resource groups, management groups |
| `AuthorizationResources` | Role assignments and role definitions |
| `AdvisorResources` | Azure Advisor recommendations (cost, performance, security) |

## Compliance Query Patterns

Use the tag keys and casing from the accepted governance tag contract. Without one, use the greenfield keys the runtime
projects into `apex/taskContext`; the examples use the lowercase greenfield keys.

**Resources missing a required tag:**

```kql
Resources
| where isnull(tags['environment']) or isnull(tags['costcenter'])
| project id, subscriptionId, name, type, resourceGroup, tags
```

**Tag coverage analysis:**

```kql
Resources
| extend hasEnvTag = isnotnull(tags['environment'])
| summarize total=count(), tagged=countif(hasEnvTag) by type
| extend coverage=round(100.0 * tagged / total, 1)
| order by coverage asc
```

**Storage accounts without HTTPS enforcement:**

```kql
Resources
| where type =~ 'microsoft.storage/storageaccounts'
| where properties.supportsHttpsTrafficOnly == false
| project name, resourceGroup, location
```

**Resources with public network access enabled:**

```kql
Resources
| where properties.publicNetworkAccess =~ 'Enabled'
| project name, type, resourceGroup, location
```

**Role assignments by principal type across subscriptions:**

```kql
AuthorizationResources
| where type == 'microsoft.authorization/roleassignments'
| extend principalType = tostring(properties.principalType)
| summarize count() by principalType
```

**Resource groups without locks:**

```kql
ResourceContainers
| where type == 'microsoft.resources/subscriptions/resourcegroups'
| project rgName=name, rgId=id
| join kind=leftanti (
    Resources
    | where type == 'microsoft.authorization/locks'
    | project rgId=tostring(properties.resourceId)
) on rgId
```

## Tips

- Use `=~` for case-insensitive type matching; resource types are lowercase.
- Navigate properties with `properties.fieldName`.
- Use `--first N` to limit rows; it is not a completeness or authorization boundary.
- Use `--subscriptions` to scope to specific subscriptions.
- Combine with `AdvisorResources` for security recommendations.
