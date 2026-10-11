> **APEX reference.** Read [execution boundaries](execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

<!-- ref:kql-queries-v1 -->

# KQL Query Reference

Essential Kusto Query Language (KQL) queries for diagnosing Azure application issues.

## Prerequisites

- Application Insights or Log Analytics workspace configured
- Diagnostic settings enabled on Azure resources

---

## Recent Errors

```kql
// Recent errors
AppExceptions
| where TimeGenerated > ago(1h)
| project TimeGenerated, Message, StackTrace
| order by TimeGenerated desc
```

## Failed Requests

```kql
// Failed requests
AppRequests
| where Success == false
| where TimeGenerated > ago(1h)
| summarize count() by Name, ResultCode
| order by count_ desc
```

## Slow Requests

```kql
// Slow requests
AppRequests
| where TimeGenerated > ago(1h)
| where DurationMs > 5000
| project TimeGenerated, Name, DurationMs
| order by DurationMs desc
```

## Dependency Failures

```kql
// Dependency failures
AppDependencies
| where Success == false
| where TimeGenerated > ago(1h)
| summarize count() by Name, ResultCode, Target
```

---

## Tips

- Always include time filter: `TimeGenerated > ago(Xh)`
- Limit results with `take 50` for large datasets
- Use `summarize` to aggregate data before analyzing

## More Resources

- [KQL Quick Reference](https://learn.microsoft.com/azure/data-explorer/kql-quick-reference)
- [Application Insights Queries](https://learn.microsoft.com/azure/azure-monitor/logs/queries)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/kql-queries.md).
Load only the reference needed for the active task.
