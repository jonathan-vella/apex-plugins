# Azure Resource Graph Cost Queries

Azure Resource Graph (ARG) queries for cost optimization, ported from the upstream `azure-resource-graph.md` and the
shared Resource Graph primer. ARG is read-only; these queries may run directly against the approved subscriptions.

## How to Query

```bash
az graph query -q "<KQL>" --query "data[].{name:name, type:type}" -o table
```

Install the extension once with `az extension add --name resource-graph`. Scope every query with
`--subscriptions <id1> <id2>` or `--management-groups <name>`, and follow `skipToken` pages before calling a result
complete.

## Correlation Rules

Discovery alone is not savings evidence: correlate candidates with actual Cost Management data and utilization metrics
(see [cost CLI workflow](cost-cli-workflow.md)). Resource-level results must keep the full `id` and `subscriptionId`;
correlate Cost Management `ResourceId` with `id` case-insensitively, never by resource name or resource group alone. If
a query omits identity, stop that correlation and report the missing fields. Aggregated SKU or tag summaries are not
resource-level savings evidence.

## Orphan Candidate Patterns

Use these exact queries, including the projected fields. A result is a candidate until ownership, attachment semantics
and utilization are verified; removal is a separately approved, routed change.

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

**Idle load balancers (no backend pools):**

```kql
Resources
| where type =~ 'microsoft.network/loadbalancers'
| where array_length(properties.backendAddressPools) == 0
| project id, subscriptionId, name, resourceGroup, location, sku=sku.name
```

## Cost Query Patterns

**Resource count by SKU or tier (spot oversized resources):**

```kql
Resources
| where isnotempty(sku.name)
| summarize count() by type, tostring(sku.name)
| order by count_ desc
```

**Tag coverage for cost allocation:**

Use the tag key casing from the accepted governance tag contract; `costcenter` is the greenfield default.

```kql
Resources
| extend hasCostCenter = isnotnull(tags['costcenter'])
| summarize total=count(), tagged=countif(hasCostCenter) by type
| extend coverage=round(100.0 * tagged / total, 1)
| order by total desc
```

**Advisor cost recommendations:**

```kql
AdvisorResources
| where properties.category == 'Cost'
| project name, impact=properties.impact, description=properties.shortDescription.solution
```

## Tips

- Use `=~` for case-insensitive type matching; resource types are lowercase.
- Navigate properties with `properties.fieldName`.
- Use `--first N` to limit rows; it is not a completeness boundary.
- Use `--subscriptions` to scope to specific subscriptions.
- Cross-reference orphan candidates with actual cost data before estimating savings.
