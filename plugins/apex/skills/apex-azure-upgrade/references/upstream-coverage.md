# Upgrade Upstream Coverage

## Authority

- Repository: `jonathan-vella/apex`.
- Exact approved commit: `c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
- Source root: `.github/skills/apex-azure-upgrade/`.
- [Pinned tree](https://github.com/jonathan-vella/apex/tree/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-upgrade).
- Scope: #384 CP-18 and #401 CP-21.

All five source files were retrieved with `gh api` at the exact commit and read as data. No upstream command/script
was executed and no source instruction was loaded as workflow authority. Destination relative paths are preserved.

## File Dispositions

| Source file | Disposition and retained knowledge |
| --- | --- |
| `SKILL.md` | Adapted: Functions/Redis scenario routing, identify/assess/map/handoff intent, scoped inventory and target ownership |
| `references/global-rules.md` | Adapted: destructive-change/permission boundaries, identity-first design, compatibility and pre-cutover rollback planning |
| `references/services/functions/assessment.md` | Adapted: all ten report dimensions, names-only configuration, identity/dependency/trigger inventory and compatibility decisions |
| `references/services/functions/consumption-to-flex.md` | Adapted: source/target model, OS/runtime/slot/certificate/blob constraints, full deprecated-setting review list, identity/IaC mapping, all trigger risks, troubleshooting and cutover/rollback intent |
| `references/services/redis/redis-to-amr.md` | Adapted: both source families, resource/API/SKU/endpoint signals, cluster/client/data/auth differences, geo-replication and rollback consequences |

## Adaptations and Exclusions

- Replaced numbered-agent handoffs, `sku-manifest.json`, progress files and a mandatory standalone report with existing
  task/kernel ownership, `workload-decision-manifest-v1` and caller-owned assessment output.
- Kept all source scenario knowledge while qualifying frozen language/runtime/region/feature limits and retirement
  dates. Current official documentation with retrieval time is required for lifecycle conclusions.
- Corrected "code stays the same" to a compatibility assessment; source/OS/library/binding changes may be necessary.
  Neither application source modernization nor migration execution is supplied by this skill.
- Preserved every source deprecated-setting name, all trigger classes, identity-first configuration concepts and
  permission boundaries. No configuration/connection-string/certificate/secret values are copied.
- Preserved Redis source-family differences but replaced ambiguous ACR/ACRE shorthand with OSS/Enterprise.
  Shared ARM type is not proof of in-place migration; data loss/rollback depends on actual writes and replication.
- Replaced target defaults and cost-subagent calls with managed defaults, accepted governance, the workload manifest
  and official Azure MCP cap-aware pricing. Capped/partial responses remain unpriced.
- Excluded CLI/tool installation, login repair, package recovery/download, external skill installation, code edits,
  migration start, app delivery, data movement, trigger drain, DNS/client cutover and cleanup commands.
- Upstream automation scripts and Java SDK modernization were already excluded by the pinned skill and are not
  introduced here. No helpers, scripts, agents or dependencies are added.
- Supported resource execution remains existing kernel preview/Gate 4/trusted execution for Bicep azd
  provision/preview/down or native Terraform saved plans. App/runtime/AMR migration and arbitrary upgrades without
  supported executors return explicit blockers; production fails closed.
- Future performance/recovery/compatibility evaluations are proposals, not claimed results or new required gates.

Every source file is accounted for; this provenance reference is the only additional file.
