# Zone Redundancy Assessment

## Failure Scope

Zone redundancy addresses some datacenter/zone failures within a region; it does not address region loss, application
bugs, corrupt data, identity outages or unavailable dependencies. A flag alone does not prove sufficient replicas,
capacity or supported placement. Compare each resource and its dependencies with accepted SLO/RTO/RPO objectives.

Use the parent skill's evidence, grant and execution boundaries. Design-stage zone support and spare capacity are
assumptions unless accepted current evidence exists, not additional required live gates.

## Scoped Discovery

Read-only template for an already-granted Resource Graph capability. Fill only accepted target values:

```bash
az graph query --subscriptions "<subscription>" -q "
Resources
| where resourceGroup =~ '<rg>'
| where type in~ ('microsoft.web/serverfarms', 'microsoft.app/managedenvironments')
| extend zoneRedundant = tobool(properties.zoneRedundant)
| project id, name, type, kind, resourceGroup, location, sku=sku.name,
          capacity=sku.capacity, zoneRedundant
" --query "data[]" -o json
```

Preserve all three states: true, false and missing/null. Do not convert missing/null into observed false.
Check pagination/completeness; use Resource Graph's projected `data[]` rather than a table rendering that can hide
fields. Do not install a Resource Graph extension or expand scope to make a query work.

## Service Routing

| Resource | Interpretation |
| --- | --- |
| `Microsoft.Web/serverfarms` | Join the actual plan ID to apps; kind alone can misclassify shared or dedicated plans |
| Function Apps | Load [Functions](./services/functions/reliability.md); evaluate plan, app minimums and supported model |
| Web apps | Load [App Service](./services/app-service/reliability.md); evaluate capacity and health dependencies |
| Container Apps managed environments | Record observed configuration only; service-specific deep dive is not supplied |

## Availability and Capacity

The source's region list and primary/failover defaults are not copied: defaults and accepted governance own regional
intent, while current documentation must establish **service, SKU, region and API-version** support.
Where granted, a current service-specific region listing can be supporting observation; it does not prove allocation
or quota. For Functions Flex, the source suggests `az functionapp list-flexconsumption-locations
--zone-redundant=true`; verify actual command/schema support and scope before any use.

Compare zone count, platform placement behavior, minimum/maximum instances, autoscale floors and the ability to
absorb a lost zone. A low replica count can be inadequate even with an enabled plan flag.
Regional data/ingress/DNS dependencies can dominate recovery despite zone-capable compute.

## Reporting

Report `configured` only when accepted evidence establishes supported zone configuration and the service-specific
capacity criteria. Use `partial` for known gaps and `unknown` for absent data. No inference of a tested recovery or
application SLO follows. Record a proposed tier/region change as a decision needing owner evaluation, not an
automatic upgrade or a fixed critical finding.

Verify [availability zones](https://learn.microsoft.com/azure/reliability/availability-zones-overview)
and the matching service reliability reference.
