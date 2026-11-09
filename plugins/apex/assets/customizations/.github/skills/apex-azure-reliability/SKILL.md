---
name: apex-azure-reliability
description: '**ANALYSIS SKILL** — Assesses App Service/Functions reliability, SLO and RTO/RPO. WHEN: "assess reliability", "zone redundancy", "single points of failure", "disaster recovery readiness", "backup design", "health probes", "multi-region failover". DO NOT USE FOR: incidents (apex-azure-diagnostics), compliance certification, executing restores, failovers or deployments.'
user-invocable: false
disable-model-invocation: false
---

# APEX Azure Reliability

Use this skill as advisory input to an existing architecture, planning, operations or assessment task. It assesses
App Service and Azure Functions in depth; other compute is inventory-only unless the active task supplies an
appropriate supported assessment. The deterministic kernel owns state, evidence acceptance, approvals and routing.
For available `apex/*` tools, include the current checkout's absolute `workspace`.

## Prerequisites

- Accepted task context identifies target/environment, approved subscription/resource scope, workload and dependency
  ownership, SLO/availability goals, RTO, RPO, data classification and governing constraints.
- Distinguish design assessment from observed deployed configuration. For observations, capture producer, query,
  source, time, scope, hash, freshness, coverage, redactions and missing signals under the active evidence contract.
- Use [managed Azure defaults](../apex-azure-defaults/SKILL.md) and accepted governance for regions, tags, naming,
  security, network sizing and module pins; select SKUs only from `workload-decision-manifest-v1`.
- Missing objectives do not prevent a bounded inventory, but block conclusions that a design meets business needs.
  Missing restore history does not itself add a design-stage gate; record an untested assumption.

## Assessment Method

1. Establish SLO measurement boundary, indicator, window, error budget and dependencies. Keep provider SLA, design
   target and measured application SLO distinct. RTO is recovery time; RPO is acceptable data-loss exposure.
2. Enumerate instance, zone, region and dependency failure modes, including DNS, identity, storage, networking,
   ingress and external services. Record detection time, recovery ownership, capacity and correlated dependencies.
3. Use scoped discovery and [zone checks](./references/zone-redundancy-checks.md), then
   [storage checks](./references/storage-redundancy-checks.md). Resource type/kind is a discovery hint: confirm app to
   plan and dependency relationships using accepted IDs instead of names alone.
4. Load [App Service](./references/services/app-service/reliability.md) or
   [Functions](./references/services/functions/reliability.md) only for matching resources. Mark Container Apps and
   unsupported services `not assessed`; do not invent a service-specific assessment.
5. Compare [platform probes](./references/health-probe-checks.md) and
   [multi-region design](./references/multi-region-checks.md). Configured probes or a second region do not prove
   successful routing, dependency availability, spare capacity, failover or recovery.
6. Assess backup scope, schedule, retention, immutability/isolation, encryption/key dependencies, restore target,
   responsible owner and last accepted restore evidence. Replication is not backup; backup metadata is not restore
   success. Treat test schedules and recovery estimates as proposed work unless accepted receipts exist.
7. Return a feature-oriented table with zone compute, zone storage, health probes and multi-region failover rows,
   plus backup/recovery findings. Omit a row only with an explicit applicability reason. Do not use numeric grades.
8. Prioritize against business impact and objectives, not a fixed tier table. Single-region or non-ZRS resources may
   be a justified design; an unevidenced green status is never justified.

## Status and Output

Use `configured`, `partial`, `not configured`, `unknown` or `not assessed`. A configured status describes fields,
not compliance or tested availability. Preserve provider SKU names where useful; distinguish a missing field from
an explicit false value and an empty result from incomplete discovery.

Return scope, objectives, evidence identifiers/time/coverage, the feature table and findings. Each finding states
resource/dependency, observed or proposed state, failure consequence, requirement-linked target, priority rationale,
owner, uncertainty and kernel-provided next task. Return findings through the caller's artifact contract, not a
standalone file, legacy artifact path or independent reliability workflow.

Concrete missing-evidence cases: no accepted app-to-storage mapping; unknown plan capacity; an unverified health
endpoint; missing regional data replication semantics; stale backup metadata; no granted read capability.
Return bounded findings and the exact gap, not a successful assessment or an invented requirement.

## Boundaries

- Tool names from the pinned source are hints. Inspect installed schemas/grants. Only scoped observation tools
  already granted and available may be used; this prose grants no Azure, Kubernetes, Entra or GitHub access.
- No secret or application-setting value reads, kubeconfig retrieval, downloads, installation, login repair or broad
  role assignment. App settings inventory is names only; use accepted projected dependency/identity metadata.
- No direct backup, restore, failover, restart, scale, DNS change, application edit, configuration fix or deployment.
  A restore drill, performance test or endpoint request that changes data is not a read-only check.
- Supported changes require an existing kernel-created preview, exact Gate 4 approval and trusted execution.
  Current execution is Bicep azd provision/preview/down or native Terraform saved plans; production fails closed.
  Arbitrary restores, region failovers and app/runtime operations have no implied executor: return explicit
  unsupported-operation blockers instead of a manual-command bypass.
- Quota, regional allocation, failover capacity, restore duration and performance remain design assumptions unless
  supported by accepted evidence. Do not add new mandatory gates or claim tests occurred.
- Proposed plan/storage/routing costs use only the granted official Azure MCP
  [cap-aware pricing contract](../apex-azure-defaults/references/retail-pricing.md). Partial/capped results remain
  unpriced; redundancy does not imply compliance, no data loss or a guaranteed SLA.

## References

- [Zone redundancy](./references/zone-redundancy-checks.md) — failure scope and discovery.
- [Storage redundancy](./references/storage-redundancy-checks.md) — replication, host dependencies and backups.
- [Multi-region](./references/multi-region-checks.md) — topology, routing, consistency and recovery assumptions.
- [Health probes](./references/health-probe-checks.md) — global routing and observability signals.
- [App Service reliability](./references/services/app-service/reliability.md) — plans, health, backups and networks.
- [Functions reliability](./references/services/functions/reliability.md) — hosting, triggers, health and recovery.
- [Upstream coverage](./references/upstream-coverage.md) — exact source inventory, corrections and exclusions.

Frozen source is not current lifecycle evidence. Verify changing claims against
[Azure reliability guidance](https://learn.microsoft.com/azure/reliability/overview) and
[WAF reliability](https://learn.microsoft.com/azure/well-architected/reliability/).
