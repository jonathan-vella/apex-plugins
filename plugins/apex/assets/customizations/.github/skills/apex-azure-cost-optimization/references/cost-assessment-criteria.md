# Cost Assessment Criteria

## Evidence Model

Treat cost assessment as a comparison of four distinct evidence classes:

| Evidence class | Establishes | Does not establish |
| --- | --- | --- |
| Actual cost | Charged usage in a stated period and scope | Future price or safe removal |
| Actual utilization | Measured demand during its observation window | Demand outside that window |
| Validated price context | Applicable rate, allowance, and commitment context | Realized savings without usage evidence |
| Dependency evidence | Known consumers and attachment state | Absence of all dependencies unless complete |

Every conclusion must carry the evidence identifier, producing source, target
scope, observation period, freshness, completeness, and redaction boundary.
Do not combine incompatible subscriptions, currencies, billing periods, or
utilization windows without stating the normalization and resulting uncertainty.

## General Heuristics

- Prioritize high recurring cost with sustained low utilization only when both
  measures cover the same target and a representative period.
- Treat reservation, commitment, or license opportunities as `review required`:
  forecast, flexibility, and existing commitments can change the result.
- Treat unattached disks, addresses, snapshots, or similar inventory signals as
  candidates. Require complete dependency evidence before describing removal as
  safe to investigate.
- For very small savings, emphasize operational simplification only when it is
  evidence-backed; do not inflate financial impact.
- Account for free allowances, shared services, minimum charges, data transfer,
  and downstream performance effects before presenting net savings.

## Redis Assessment

Use Redis-specific signals only within the stated cache scope. A failed or
long-creating cache, premium capacity in non-production, apparently unused
enterprise capability, oversized non-production capacity, old test usage, or
missing lifecycle tags are investigation signals, not action approvals.

Require utilization, consumer dependency, environment classification, and
pricing context before suggesting a tier or capacity change. Missing expiry or
ownership metadata is a governance observation, not a savings estimate. Mark
production caches and workloads with unknown latency, persistence, clustering,
or availability needs as `high risk`.

## Storage Review Signals

Each signal is a question for the data owner, not a finding by itself. Recommend a change only when returned cost,
metric, or advisor evidence supports it.

| Signal | Possible recommendation after review |
| --- | --- |
| No lifecycle policy on long-lived data | Propose tiering rules from observed access |
| Hot-only data that observed access shows is rarely read | Propose Cool or Cold, or last-access tiering |
| Premium performance outside production | Confirm the performance need, then propose Standard |
| Geo-redundant replication outside production | Confirm the recovery requirement, then propose LRS or ZRS |
| Classic general-purpose v1 account | Confirm, then propose an upgrade to general-purpose v2 |
| Soft-delete retention longer than the agreed retention | Align with the owner's retention requirement |
| Snapshot or version history dominating account capacity | Review retention with the data owner |

Compare tiers with each tier's minimum retention, retrieval, early-deletion, and rehydration charges. Unattached disks,
empty containers, and old snapshots are cleanup candidates only after the owner confirms they are unused.

## Classification And Escalation

| Classification | Evidence threshold | Required handoff |
| --- | --- | --- |
| Safe to investigate | Complete scope and reproducible low-risk observation | Authorized assessment or planning workflow |
| Review required | Savings is plausible but dependencies, demand, or price terms are uncertain | Owner review through the kernel |
| High risk | Production impact, data durability, availability, or unknown consumer dependency | Owning reliability, security, or service workflow |

When data is stale, truncated, redacted beyond the needed fields, or missing a
hash, return `indeterminate` and request refreshed scoped evidence through the
authorized capability.

## Capability Boundary

Actual cost, forecast, commitment, and retail price evidence comes from the read-only `apex-azure-pricing` tools.
Resource inventory, utilization metrics and advisor recommendations come from the read-only Azure CLI commands in
[cost CLI workflow](cost-cli-workflow.md) and [Azure Resource Graph cost queries](azure-resource-graph.md); billing
exports and report rendering need separately qualified producers. When no source is available, the gap is a blocker for
findings that depend on it, not permission to substitute a browser lookup, an estimate from memory, or a
reference-only report outline. Keep any requested report as an assessment
finding until a registered producer and renderer return a receipt.
