# Kusto Evidence Operational Checklist

## Query Shape

- Confirm accepted schema evidence for the same cluster, database, table, and
  freshness policy before interpreting a query result.
- Bound time-series questions by time range and result size. Filter and project
  early, and keep joins and aggregation grain aligned with the stated question.
- Distinguish record retrieval, aggregate trends, correlations, and anomaly
  signals; each has different limits on the conclusions it can support.

## Result Quality

- Preserve query intent, target scope, time window, sampling, truncation,
  redaction, and evidence hash with the result.
- Treat a schema mismatch, unbounded question, partial result, or stale data as
  indeterminate. Do not infer columns or semantics from names alone.
- Do not recover redacted values, export data, or turn query findings into
  retention, access, or cluster-management decisions.

## Routing

Route operational symptoms to diagnostics and spend questions to cost
assessment. Request an authorized collection only when accepted evidence is
insufficient.
