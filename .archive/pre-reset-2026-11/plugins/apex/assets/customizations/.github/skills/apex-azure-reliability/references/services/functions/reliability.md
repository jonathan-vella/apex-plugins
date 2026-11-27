# Azure Functions Reliability

## Hosting Model Interpretation

The source's plan table is frozen guidance. Verify current hosting model, OS, region, API version and runtime
support before using these as design candidates:

| Model | Source's zone design | Source's health distinction |
| --- | --- | --- |
| Flex Consumption (`FC1`) | Supported zone flag with platform-managed placement | No App Service platform `healthCheckPath` |
| Premium (`EP*`) | Zone flag, plan capacity and app minimum instances | Platform health path where supported |
| Consumption (`Y1`) | No zone redundancy | No platform health path |
| Dedicated | Actual App Service plan support and capacity | Apply App Service health behavior |

The source uses two for Premium plan capacity and per-app minimum elastic instances. These are historical
starting criteria to verify, not unconditional capacity defaults or a guarantee of surviving zone failure.
Get chosen plan/SKU from the workload manifest, not this table.

## Scoped Observations

Only with a granted read capability and accepted target:

```bash
az graph query --subscriptions "<subscription>" -q "
Resources
| where resourceGroup =~ '<rg>'
| where type =~ 'microsoft.web/serverfarms'
| project id, name, kind, sku=sku.name, capacity=sku.capacity,
          zoneRedundant=properties.zoneRedundant, location
" --query "data[]" -o json
az functionapp show --subscription "<subscription>" --name "<app>" --resource-group "<rg>" \
  --query "{id:id,plan:serverFarmId,kind:kind,minInstances:siteConfig.minimumElasticInstanceCount,healthCheckPath:siteConfig.healthCheckPath}" -o json
```

Correlate the app's exact plan ID, supported configuration and deployment model. Kind strings such as `linux` or
`elastic` do not independently prove which hosting model is in use. Missing properties remain unknown.

## Health Endpoint and Application Boundary

If the current hosting model does not support platform Health Check, assess a separately implemented lightweight
HTTP health endpoint and its upstream router/monitor. No platform health path is **not** proof there is no health
monitoring; a function can have a supported external probe. Conversely, a function endpoint alone does not enable
automatic traffic failover.

The source provides TypeScript v4, Python v2 and C# isolated HTTP `GET` health examples returning 200. Their design
intent is retained: a minimal nonsensitive response, supported authentication/network restrictions and no heavy
dependency work. No application snippets/helpers are imported and this skill does not edit or deploy source.
For Premium/Dedicated platform Health Check, consider restart and probe behavior before proposing changes.

## Storage, Triggers and Regional Recovery

- Map host storage, deployment storage, queues, blobs, Event Hubs, Service Bus and database dependencies from accepted
  configuration. Names-only app setting inventory never authorizes connection-string or token reads.
- Zone-capable compute with primary-zone-dependent host storage can still fail; assess actual supported replication
  and [backup/recovery coverage](../../storage-redundancy-checks.md).
- Deploying the same code to another region is a separate delivery operation, not an effect of creating a plan.
  Endpoint and trigger behavior must be equivalent where intended.
- Active-passive idle compute cost depends on plan, always-ready settings, storage, network and telemetry.
  Do not promise negligible standby cost; use the official cap-aware pricing contract.
- Event Hubs consumer groups and checkpoint storage, Cosmos lease containers and queue consumers need explicit
  ownership. A second app can duplicate work, race or consume messages, not merely wait as a passive standby.
- Event Hubs Geo-DR metadata replication is not automatically event-data replication. Verify the chosen feature's
  actual data/metadata semantics, lag and failover behavior; never infer no event loss.
- Plan idempotency, replay, poison-message handling, timer ownership, ordering and data reconciliation. These are
  design expectations, not tests performed by this assessment.

## Recommendations and Reporting

For an accepted requirement that the current plan cannot meet, compare supported alternatives and refer a lifecycle
assessment to [Azure upgrade](../../../../apex-azure-upgrade/SKILL.md). Do not automatically choose Flex/Premium,
edit app code, migrate triggers or claim an in-place plan conversion exists.

Candidate implementation fields from the source include `zoneRedundant`, `skuCapacity`,
`siteConfig.minimumElasticInstanceCount`, `siteConfig.healthCheckPath`; corresponding Terraform concepts include
zone balancing, worker count, minimum elastic instances and health path. Exact module/provider support must be
verified by the owning implementation task.

Return plan and per-app capacity evidence, supported probe mechanism, regional trigger/data dependencies,
backup/restore assumptions and failure consequences against SLO/RTO/RPO. Use `unknown` for missing configuration,
not an automatic OFF or "code-only fix" status.
No restore, failover, data consumption, runtime upgrade or app delivery is executed; unsupported requests remain
explicit blockers and production fails closed.

Verify [Functions reliability](https://learn.microsoft.com/azure/reliability/reliability-functions),
[hosting options](https://learn.microsoft.com/azure/azure-functions/functions-scale)
and [Event Hubs geo-disaster recovery](https://learn.microsoft.com/azure/event-hubs/event-hubs-geo-dr).
