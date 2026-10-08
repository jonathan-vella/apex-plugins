---
name: apex-azure-kusto
description: "Interpret APEX Azure Data Explorer evidence and KQL analysis. Use for Kusto, ADX, KQL, schema, aggregation, time-series, correlation, and anomaly findings."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Data Explorer Analysis

Use this skill for an active APEX task that interprets accepted Azure Data
Explorer evidence and KQL analysis results. It does not discover schemas,
execute queries, export data, or mutate clusters.

## Prerequisites

- `apex/taskContext` identifies the cluster and database boundary, approved
  table scope, analytic question, time range, result limit, and data handling
  constraints.
- Capability-produced evidence carries its producer, query intent or pattern,
  evidence hash, target scope, observation time, freshness, completeness,
  sampling or truncation status, and redaction boundary.
- Schema evidence is accepted for the same target and sufficiently fresh for
  the query interpretation. Do not infer columns or semantics from table names.

## Workflow

1. Confirm the analytic question and select the applicable interpretation
   pattern in [KQL evidence interpretation](references/kql-evidence-interpretation.md).
2. Verify that time bounds, filters, projections, joins, and aggregation grain
   answer that question without silently excluding relevant records.
3. Distinguish record retrieval, aggregate trend, correlated event, and anomaly
   evidence. State what the pattern establishes and what it cannot establish.
4. Carry evidence hash, target scope, time window, result completeness,
   redactions, and uncertainty into the result.
5. Return observations and an authorized next-assessment request when evidence
   is insufficient. Route operational incidents to diagnostics and cost
   questions to cost assessment.

## Boundaries

- Do not invoke external queries, inspect schemas, retrieve data, or export
  results. All inputs are scoped capability-produced evidence.
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
