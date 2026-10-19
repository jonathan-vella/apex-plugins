---
name: apex-azure-kusto
description: '**ANALYSIS SKILL** — Guides bounded Azure Data Explorer queries and KQL analytics. WHEN: "Kusto database queries", "ADX cluster", "KQL time series", "IoT telemetry", "anomaly detection", "schema exploration". DO NOT USE FOR: App Insights or Log Analytics incidents (use apex-azure-diagnostics), spending analysis (use apex-azure-cost-optimization).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Data Explorer Analysis

Use this skill for an active APEX task that interprets accepted Azure Data
Explorer evidence and KQL analysis results. Scoped read-only discovery, schema inspection and queries are allowed;
load [execution boundaries](references/execution-boundaries.md) before the query references. Never mutate clusters,
retention, access or data.

## Prerequisites

- `apex/taskContext` identifies the cluster and database boundary, approved
  table scope, analytic question, time range, result limit, and data handling
  constraints.
- Evidence carries its producer, query intent or pattern,
  evidence hash, target scope, observation time, freshness, completeness,
  sampling or truncation status, and redaction boundary.
- Schema evidence is accepted for the same target and sufficiently fresh for
  the query interpretation. Do not infer columns or semantics from table names.

## Workflow

1. Confirm the analytic question and accepted target. Read only the selected cluster/database/table schema;
   do not enumerate unrelated subscriptions to discover a target.
2. Select a [query pattern](references/query-patterns.md) and the applicable interpretation
   pattern in [KQL evidence interpretation](references/kql-evidence-interpretation.md).
3. Verify that time bounds, filters, projections, joins, and aggregation grain
   answer that question without silently excluding relevant records.
4. Use installed and authorized Kusto tools only. Tool names such as `kusto_query` and `kusto_table_schema_get` are
   hints, not promised plugin tools. For unavailable tools, see the [CLI/REST fallback](references/fallback-strategy.md);
   fallback never expands access or evades a denied query.
5. Distinguish record retrieval, aggregate trend, correlated event, and anomaly
   evidence. State what the pattern establishes and what it cannot establish.
6. Carry evidence hash, target scope, time window, result completeness,
   redactions, and uncertainty into the result.
7. Submit observations through the task's evidence contract and return an authorized next-assessment request when evidence
   is insufficient. Route operational incidents to diagnostics and cost
   questions to cost assessment.

## Boundaries

- Bound scans by start/end timestamps on both sides of joins; filter early, project necessary columns, use
  `take`/`limit` for exploration and `summarize`/`bin()` for aggregates and trends.
- Read/diagnostic `az` calls may run directly within task scope. REST POST to `/v1/rest/query` is a read **only**
  with ordinary bounded KQL; management commands, ingestion, export and remote writes are not a query fallback.
- Do not export or persist sensitive results outside the task's approved data-handling boundary.
- Do not treat sampled, limited, partial, or stale results as population-wide
  truth. Do not recover redacted values through correlation or inference.
- Do not create mutation, retention, access, or cluster-management decisions.
  Escalate such requests to the kernel-selected owner.

## Output

Return the question, target scope, query-pattern intent, evidence hashes,
freshness, redaction and completeness limits, observations, uncertainty, and
kernel-provided next action. Use `indeterminate` for incomplete support.

## References

- [KQL evidence interpretation](references/kql-evidence-interpretation.md) -
  query pattern meaning, quality checks, and analytic limits.
- [Operational checklist](references/operational-checklist.md) -
  schema, query-shape, result-limit, and redaction checks.
- [Common issues](references/common-issues.md) - access, syntax, timeout, ingestion lag and empty-result diagnosis.
- [Upstream coverage](references/upstream-coverage.md) - query and fallback inventory.
