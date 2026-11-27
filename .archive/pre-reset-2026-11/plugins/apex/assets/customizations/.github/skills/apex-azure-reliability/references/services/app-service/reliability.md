# App Service Reliability

## Contents

- [Plan compatibility](#plan-compatibility)
- [Scoped configuration observations](#scoped-configuration-observations)
- [Health and deployment behavior](#health-and-deployment-behavior)
- [Backup and network dependencies](#backup-and-network-dependencies)
- [Target intent and reporting](#target-intent-and-reporting)

## Plan Compatibility

The pinned source classifies Free/Shared, Basic and Standard plans as not zone-redundant, and Premium v2/v3/v4 and
Isolated v2 as zone-capable with suitable capacity. It uses two instances as a starting zone-redundancy criterion.
These are **historical compatibility claims**, not current support proof or SKU recommendations. Verify current
plan generation, region, scale unit and platform capabilities. Obtain any chosen SKU from the workload manifest.

Health Check and backup capabilities also vary by tier/OS/configuration; a paid tier alone does not establish all
features are enabled. Dedicated Functions must be assessed using their actual App Service plan and app settings,
not a Functions-only kind filter.

## Scoped Configuration Observations

Read-only examples require the parent skill's granted capability and accepted scope:

```bash
az graph query --subscriptions "<subscription>" -q "
Resources
| where resourceGroup =~ '<rg>'
| where type =~ 'microsoft.web/serverfarms'
| project id, name, kind, sku=sku.name, capacity=sku.capacity,
          zoneRedundant=properties.zoneRedundant, location
" --query "data[]" -o json
az webapp config show --subscription "<subscription>" --name "<app>" --resource-group "<rg>" \
  --query "{healthCheckPath:healthCheckPath,alwaysOn:alwaysOn,autoHealEnabled:autoHealEnabled}" -o json
az webapp show --subscription "<subscription>" --name "<app>" --resource-group "<rg>" \
  --query "{id:id,plan:serverFarmId,clientAffinityEnabled:clientAffinityEnabled}" -o json
az webapp deployment slot list --subscription "<subscription>" --name "<app>" --resource-group "<rg>" \
  --query "[].{name:name,state:state}" -o json
```

Join apps to the exact accepted plan ID. Resource kind alone does not identify every shared/dedicated scenario.
Missing capacity or zone flags remain unknown; do not infer defaults.

## Health and Deployment Behavior

Assess app `healthCheckPath`, whether the endpoint is suitable, traffic behavior, worker count and detection/recovery
thresholds. The source describes a one-minute ping, ten failures, one-hour replacement and one-success recovery
behavior; treat those numbers as frozen examples needing current documentation and configuration verification.

An enabled path is not proof of healthy instances or a tested failover. Enabling/changing Health Check can restart
the app; this skill does not do it. Always On and Auto Heal need app-specific interpretation and can have side effects.

Client affinity can impede balanced routing and recovery when sessions are in instance memory. Prefer an
application-supported stateless/externalized session design where requirements allow; disabling affinity alone
does not migrate session state and may break the app. Do not assert that affinity categorically defeats zone
redundancy.

Slots can support staged deployments on supported plans. Slot existence does not promise zero downtime:
warm-up, sticky settings, identities, connections, database compatibility and swap direction matter.
Slots/app delivery/swaps are not authorized by an infrastructure preview and are not executed here.

## Backup and Network Dependencies

The source lists automatic/custom backup for paid plans and recommends automatic backups. Verify current support,
retention, actual backup coverage and dependencies instead of assuming backups exist or include external databases.
Compare accepted backup metadata with separately accepted restore evidence; no compliance/restore-success claim
follows from a backup setting.

For VNet integration and regional recovery:

- Calculate address capacity for scale-out, upgrade/slot overlap and recovery surges using canonical network sizing.
  Do not copy fixed subnet prefixes from the source as defaults.
- Subnet changes can require VNet reintegration; do not assume in-place resize or interruption-free reassignment.
- Inspect private endpoints, DNS links/records and resolver/forwarder paths in each region. A primary-only resolver
  can be a single point of failure; shared private DNS is not intrinsically invalid.
- Review outbound NAT/SNAT behavior, partner allowlists, route/firewall dependencies and capacity. A NAT Gateway is
  an option, not universally required or sufficient.
- Service endpoint/private endpoint regional dependencies need explicit recovery mapping, not assumed automatic
  cross-region failover. Capture endpoint and DNS requirements for the owning task.
- Certificate ownership, Front Door domain bindings and private-origin requirements must be verified against current
  documentation; the source's certificate limitations are not generalized as current facts.
- App Service Environment v3 is regional: independent regional ASE capacity and routing may be needed for region
  recovery. It is not created or failed over by this skill.

## Target Intent and Reporting

Candidate implementation fields from the source include AVM `zoneRedundant`, `skuCapacity`,
`siteConfig.healthCheckPath`, `siteConfig.alwaysOn`, `clientAffinityEnabled`; Terraform fields include
`zone_balancing_enabled`, `worker_count`, `site_config.health_check_path`, `site_config.always_on`,
`client_affinity_enabled`. Exact resolved module/provider schemas own their applicability.

Return plan support/zone capacity, app probes, affinity/session assumptions, backup/restore coverage and regional
dependency gaps. Do not select a higher tier from prose or claim that two instances meet every failure objective.
Use the parent statuses (`configured`, `partial`, `not configured`, `unknown`, `not assessed`); a configured
multi-region route is not tested failover.

All findings are advisory. No app edit, restart, scale, swap, backup, restore, network mutation or automatic plan
upgrade occurs here. Unsupported operations return explicit blockers; production remains fail-closed.

Verify [App Service reliability](https://learn.microsoft.com/azure/reliability/reliability-app-service),
[zone redundancy](https://learn.microsoft.com/azure/app-service/how-to-zone-redundancy),
[Health Check](https://learn.microsoft.com/azure/app-service/monitor-instances-health-check)
and [backup/restore](https://learn.microsoft.com/azure/app-service/manage-backup).
