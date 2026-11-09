# Cost Assessment Criteria

## Evidence Model

| Evidence | Establishes | Does not establish |
| --- | --- | --- |
| Azure Advisor recommendation | A recommendation returned for the observed target and time | Actual charges, complete dependencies, or safe execution |
| Optimization estimate | A provider estimate for the returned recommendation | Realized or guaranteed savings |
| Retail price | A public rate for a matched meter and price type | Customer-negotiated price or deployed spend |
| Utilization or inventory observation | A measured signal for its returned resource and window | Demand outside that window or absence of all dependencies |

Preserve source, target scope, observation time, freshness, completeness, currency, and redactions when returned. Do not
combine incompatible scopes, currencies, or utilization windows without stating the normalization and uncertainty.
Historical billing, forecasts, budgets, alerts, and commitment utilization are not available from this integration.

## General Heuristics

- Treat resize and other savings recommendations as candidates for owner review, not approved actions.
- Consider a retail-price comparison only when service, region, SKU, meter, price type, and currency match the proposed
  resource. Keep estimates separate from recommendations and observed utilization.
- Treat unattached or low-utilization resources as candidates. Require complete dependency evidence before describing
  removal as safe to investigate.
- Account for free allowances, shared services, minimum charges, data transfer, and downstream performance effects
  before presenting a calculated estimate.
- Do not quantify savings if the returned evidence or calculation cannot be traced.

## Classification And Escalation

| Classification | Evidence threshold | Required handoff |
| --- | --- | --- |
| Safe to investigate | Complete, reproducible, low-risk observation | Authorized assessment or planning workflow |
| Review required | Plausible opportunity with uncertain dependencies, demand, or price terms | Owner review through the kernel |
| High risk | Production impact, data durability, availability, or unknown consumer dependency | Owning reliability, security, or service workflow |

When data is stale, truncated, redacted beyond the needed fields, or missing, return `indeterminate` for conclusions
that depend on it. Missing billing data blocks only billing-dependent conclusions; it does not block independent
Advisor recommendations or proposed-resource price comparisons.

## Capability Boundary

The guarded Azure MCP integration supplies the recommendation and retail-pricing evidence described in
[cost tool guardrails](cost-tool-guardrails.md). It does not supply actual bills, forecasts, budgets, alerts, or
commitment utilization. Do not substitute an estimate from memory, a command-line/API query, another server, or a
reference-only report outline for unavailable evidence.
