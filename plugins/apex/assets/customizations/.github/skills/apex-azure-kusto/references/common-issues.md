> **APEX reference.** Read [execution boundaries](execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

<!-- ref:common-issues-v1 -->

# Kusto Common Issues

Adapted from the upstream `azure-kusto` skill. Keep every retry bounded, as in
[query patterns](query-patterns.md).

| Symptom           | Likely cause                                             | Next step                                                                                                |
| ----------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Access denied     | The identity lacks a database role                       | Confirm the database Viewer role (minimum for queries); request access rather than switching identities |
| Query timeout     | Scan too broad                                           | Add a `Timestamp between (...)` filter and `take`, narrow columns, then retry once                       |
| Syntax error      | Missing pipe, wrong operator or misspelled column        | Check the table schema before rewriting the query                                                        |
| Empty results     | Time range too narrow or wrong table                     | Confirm the accepted window and table; request new scope before widening it; empty is not proof of absence |
| Cluster not found | Cluster name includes the `.kusto.windows.net` suffix    | Pass the short cluster name, or the full URI where the tool expects one                                   |
| High CPU usage    | Broad aggregations over long windows                     | Filter before `summarize`, shorten the window and limit aggregations                                     |
| Ingestion lag     | Streaming or queued ingestion has not landed yet         | Allow for delays of seconds to minutes depending on the ingestion method before concluding data is missing |

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-kusto/references/common-issues.md).
Load only the reference needed for the active task.
