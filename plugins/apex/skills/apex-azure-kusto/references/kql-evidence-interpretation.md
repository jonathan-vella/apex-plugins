## Interpretation Patterns

| Pattern | Useful for | Required limits to report |
| --- | --- | --- |
| Retrieval | Inspecting bounded recent records | Time range, filter, projection, result limit |
| Aggregation | Counts, distributions, and top contributors | Grouping dimensions, time bucket, omitted values |
| Time series | Trend, latency, volume, and anomaly signals | Baseline, bucket size, sampling, seasonality |
| Correlation | Events aligned by a declared key and interval | Join type, unmatched records, key quality |
| Schema evidence | Understanding available fields and types | Schema freshness, permissions, partial visibility |

Every interpretation begins with the question, target, and time range. A
time-series result needs a bounded time filter; an exploratory result needs a
declared limit. A pattern that is not present in evidence cannot be assumed.

## Quality Checks

- Confirm filters were applied before broad correlation or aggregation where
  the evidence's query intent requires a constrained population.
- Confirm projected fields contain only approved, redacted data and that
  aggregations do not disclose protected values through small groups.
- Confirm `bin`-style bucketing matches the decision horizon; a coarse bucket
  can hide bursts and a fine bucket can create noise.
- Treat joins as a relationship claim only when the correlation key, time
  alignment, and unmatched-record behavior are documented.
- Compare anomaly or percentile claims to an accepted baseline. A single high
  percentile or spike does not establish a persistent trend.

## Limits And Escalation

Result limits, sampling, retention, late-arriving events, schema drift,
permission-based partial visibility, and redaction can all bias a conclusion.
State these limits with the evidence hash and freshness rather than compensating
with assumptions. When a conclusion needs wider scope, unredacted data, a
different time window, or causal service evidence, return `indeterminate` and
ask the kernel to obtain the needed scoped capability evidence.

## Query Capability Boundary

Schema discovery, KQL execution, CLI or REST fallback, and data export are provider-backed operations. Preserve their
query intent, scope, limits, and failure state in an evidence request, but defer execution until a qualified capability
exists. Do not replace an unavailable query result with model-generated records or inferred schema.
