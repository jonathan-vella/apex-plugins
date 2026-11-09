# Reliability Upstream Coverage

## Authority

- Repository: `jonathan-vella/apex`.
- Exact approved commit: `c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
- Source root: `.github/skills/apex-azure-reliability/`.
- [Pinned tree](https://github.com/jonathan-vella/apex/tree/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-reliability).
- Scope: #384 CP-18 and #401 CP-21.

All seven source files were retrieved with `gh api` at this exact commit and inspected as data, not executed or loaded
as workflow authority. Destination source-relative paths are preserved.

## File Dispositions

| Source file | Disposition and retained knowledge |
| --- | --- |
| `SKILL.md` | Adapted: scoped discovery, service routing, feature-pivoted findings, objectives, impact-based priority and caller-owned output |
| `references/health-probe-checks.md` | Adapted: Front Door/Traffic Manager probe fields, App Insights names-only inventory, endpoint design and platform/application health distinctions |
| `references/multi-region-checks.md` | Adapted: topology discovery, routing origins, active-passive/active-active, regional dependencies, storage and private connectivity |
| `references/storage-redundancy-checks.md` | Adapted: all six replication classes, app/host-storage dependency mapping, conversion limitations and backup-versus-replication distinction |
| `references/zone-redundancy-checks.md` | Adapted: platform discovery, app/plan routing, zone/region support and capacity considerations |
| `references/services/app-service/reliability.md` | Adapted: plan generations, zone capacity, health/Always On/Auto Heal, affinity/slots, backups, networking, certificate and ASE considerations |
| `references/services/functions/reliability.md` | Adapted: all hosting models, plan/app capacity, health endpoint intent, storage/triggers and regional recovery |

## Adaptations and Exclusions

- Replaced numbered-agent workflows and fixed artifact paths with advisory findings returned to an existing task.
  Kernel owns evidence/state/approvals; the skill neither creates a workflow nor certifies reliability/compliance.
- Preserved SLO/RTO/RPO and backup planning while distinguishing configured features, projected designs, accepted
  observations and actual restore/failover receipts. No live recovery/performance gate is added.
- Replaced default regions/subnet sizes/target tiers with managed defaults, accepted governance and the workload
  manifest. Pricing follows the official Azure MCP cap-aware contract rather than cost-subagent handoffs.
- Removed blanket source priorities ("all production non-ZR is critical") and pass/fail inferences from a flag,
  naming heuristic, profile presence or missing fields. Unknown/not-assessed outcomes are explicit.
- Corrected overclaims: configured probes are not successful failover; geo-replication can lose asynchronous writes;
  shared private DNS is not inherently invalid; affinity is application-dependent; Event Hubs Geo-DR does not
  automatically replicate event data.
- Excluded app setting value reads, connection strings, source-level health handlers, extension installation,
  authentication repair and automatic remediation. Retained their configuration/authorization intent.
- Rejected unspecified storage SKU defaults as portable facts. Plan support, health thresholds, backup/certificate
  limits, region availability and conversion paths are frozen claims requiring current official documentation.
- No restore, failover, DNS change, app delivery or generic upgrade executor is implied. Supported resource execution
  remains current kernel-authorized Bicep azd provision/preview/down or native Terraform saved plans; production
  fails closed and unsupported operations are blockers.

All seven source files are accounted for; this provenance reference is the only additional file.
