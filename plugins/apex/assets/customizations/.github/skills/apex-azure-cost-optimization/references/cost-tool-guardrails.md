# Cost Tool Guardrails

The `apex-azure-pricing` server exposes read-only Cost Management and pricing tools. A managed hook denies its write and
operation tools. The limits below describe the tool contract as ported; when a tool rejects a request, its message is
authoritative.

## Scope

| Scope | Path |
| --- | --- |
| Subscription | `/subscriptions/<id>` |
| Resource group | `/subscriptions/<id>/resourceGroups/<name>` |
| Management group | `/providers/Microsoft.Management/managementGroups/<id>` |
| Billing account | `/providers/Microsoft.Billing/billingAccounts/<id>` |

A tenant ID is not a Cost Management scope. Use the narrowest scope that answers the question, and ask the user to
narrow a request that spans many subscriptions rather than fanning out.

## Historical Cost: `query_costs`

| Rule | Limit |
| --- | --- |
| Period | Month to date by default; custom `from` and `to` together as `YYYY-MM-DD` |
| Lookback | Rolling 92 days; the end date cannot be in the future |
| Grouping | Up to five supported dimensions; resource and meter dimensions only at subscription or resource-group scope |
| Filter | One dimension with exact values, supplied as a pair |
| Tags | Grouping and filtering by tag are not supported |
| Rows | 100 by default, 5000 at most, with no continuation |

- Prefer one bounded query that answers the question over splitting the same scope and period.
- Ask for a total with no time granularity instead of summing daily rows.
- Sort by cost descending with a suitable row limit for rankings.
- If 5000 rows are not enough, narrow the scope, period, or grouping and disclose that the result is partial.

## Forecast: `forecast_costs`

| Rule | Limit |
| --- | --- |
| Period | The current month by default; custom `from` within the 92-day lookback, `to` may be in the future |
| Span | 92 days at most |
| Granularity | Daily or monthly |
| Rows | 100 at most |
| Filter | One dimension with exact values; no grouping |

Forecasts can be unavailable for new or inactive scopes. Unavailable data is not zero.

## Evidence Labels

| Label | Meaning |
| --- | --- |
| Actual cost | Returned by Cost Management for the stated scope and period |
| Actual metric | Returned by a monitoring source for the same resource and period |
| Retail price | Returned by `get_retail_prices` |
| Negotiated price | From the customer's price sheet; not available through the shipped tools |
| Estimate | Calculated from stated assumptions and labeled evidence |

Preserve currency, metric, scope, and period exactly as returned. Never combine currencies, turn missing data into zero,
or present a retail comparison as realized savings.

## Errors

| Error | Action |
|---|---|
| Unsupported timeframe, metric, dimension, or sort | Use a value the tool contract exposes. |
| Missing half of a date or filter pair | Supply both members. |
| Date outside the lookback | Narrow the window; no fallback bypasses the limit. |
| Unauthorized or forbidden | Report the missing Cost Management read access as a blocker; never switch identity. |
| Throttled | Honor the returned retry guidance and reduce fan-out. |
| Transient server error | Retry once, then report the operation as unavailable. |
| Empty rows | Report no data, not zero, unless the response establishes zero. |
