# Multi-Region and Failover Assessment

## Topology Evidence

Regional redundancy needs independently operable compute, suitable data recovery and supported traffic routing.
It is not established by finding two resources in different regions.

Use the parent scope/tool rules. For discovery, a granted Resource Graph read can project app IDs, kinds, locations
and accepted application-group tags within the exact approved scope. The source's base-name regex and tag grouping
are **heuristics only**: different names can be one workload and matching names can be unrelated.
Use accepted topology, application ownership and dependency IDs to confirm regional membership.

An empty discovery result with missing permissions, scope, pagination or tags is unknown coverage, not proof of a
single-region deployment.

## Scoped Routing Observations

Read-only template, conditional on an installed granted capability:

```bash
az graph query --subscriptions "<subscription>" -q "
Resources
| where resourceGroup =~ '<rg>'
| where type in~ ('microsoft.cdn/profiles', 'microsoft.network/trafficmanagerprofiles')
| project id, name, type, sku=sku.name, location,
          routingMethod=properties.trafficRoutingMethod, status=properties.profileStatus
" --query "data[]" -o json
az afd origin-group list --subscription "<subscription>" --profile-name "<profile>" --resource-group "<rg>" \
  --query "[].{name:name,probe:healthProbeSettings}" -o json
az afd origin list --subscription "<subscription>" --profile-name "<profile>" --resource-group "<rg>" \
  --origin-group-name "<group>" \
  --query "[].{name:name,host:hostName,priority:priority,weight:weight,enabled:enabledState}" -o json
```

Profile existence is not proof that routes use it. Link custom domains, routes, origin groups, enabled origins and
actual regional targets. For Traffic Manager, inspect endpoint region/priority/weight/status and monitor settings;
remember DNS TTL, caches and resolver behavior affect recovery.

Do not mutate DNS, routes, origin state or endpoint priorities to test a hypothesis.

## Pattern Comparison

| Pattern | Benefit | Required assumptions and trade-offs |
| --- | --- | --- |
| Active-passive | Primary serves traffic with standby recovery target | Standby is deployable/warm enough, can scale, has current data and all dependencies |
| Active-active | Both regions serve traffic; may improve proximity and capacity | State consistency, write ownership/conflicts, idempotency and cross-region dependencies are resolved |

Priority routing can express active-passive; weighted/latency routing can support active-active when appropriate.
Neither guarantees recovery time. A scaled-down standby is cheaper only if current metering supports that conclusion
and may lengthen RTO. Private-origin connectivity can constrain router tier and topology.

## Dependency and Data Failure Modes

- Confirm both regional applications have compatible code, configuration and identity authorization.
- Model storage/database replication: lag, promotion/write ownership, consistency, replay, duplicates and data-loss
  windows. Geo-redundancy does not prove application-consistent recovery.
- Per-region private endpoints, resolver/forwarder paths and DNS-zone records must resolve the correct target.
  A shared private DNS zone is not inherently broken, but incorrect records/links or a primary-only resolver can be
  a correlated dependency. Evaluate actual topology rather than forcing one DNS design.
- Check ingress certificates, domain bindings, outbound allowlists/NAT, third-party endpoints, queues/checkpoints,
  identity/Key Vault and monitoring. One-region dependencies can negate a second compute region.
- Quota, spare regional capacity, replication performance and recovery time are assumptions unless accepted evidence
  exists. Do not claim load/failure testing or add new mandatory gates at design stage.

## Advisory Target and Recovery Plan

Record accepted primary/secondary intent through managed defaults and governance, not frozen region names.
Consider secondary compute, regional storage, Front Door/Traffic Manager, HTTPS health probes, domain/certificates,
private origin routing and per-region connectivity as **candidate components**, not automatic additions.
Resolve actual AVM/provider support in the implementation task; no generic multi-region executor is supplied here.

The recovery plan needs a trigger/decision owner, evidence threshold, detection and propagation budget, traffic
sequence, data promotion/reconciliation, safe rollback/failback and data-loss acknowledgement. Distinguish an
estimated RTO/RPO from an observed drill result.

Return `configured` for evidenced routing topology, `partial` for known gaps, `unknown` for incomplete mapping and
`not configured` only for an adequately scoped observation. Never label multi-region configuration "tested failover".
Actual failover, DNS changes, data promotion or rollback remain unsupported unless a separately supported,
kernel-authorized operation exists; this skill performs none.

Verify [multi-region reliability](https://learn.microsoft.com/azure/well-architected/reliability/regions-availability-zones),
[Front Door routing](https://learn.microsoft.com/azure/frontdoor/routing-methods)
and [Traffic Manager](https://learn.microsoft.com/azure/traffic-manager/traffic-manager-overview).
