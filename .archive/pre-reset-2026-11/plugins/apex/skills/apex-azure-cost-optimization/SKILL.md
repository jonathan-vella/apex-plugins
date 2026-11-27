---
name: apex-azure-cost-optimization
description: '**ANALYSIS SKILL** — Reviews Azure Advisor cost recommendations and proposed-resource retail pricing with guarded, read-only Azure MCP. WHEN: "optimize Azure costs", "find savings", "compare SKU prices", "rightsize a VM". DO NOT USE FOR: bills, forecasts, budgets, alerts or commitment records (unavailable); security (use apex-azure-compliance); live failures (use apex-azure-diagnostics).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Cost Optimization

Use this skill for supported cost-saving recommendations and retail-price comparisons in an active APEX task. It is
advisory only: evidence informs findings, and the kernel decides whether a later task may authorize a change.

## Prerequisites

- `apex/taskContext` identifies the approved Azure scope and question to answer.
- Each evidence record identifies its source, observation time, freshness, target scope, completeness, and redactions.
- Missing, stale, partial, or scope-mismatched evidence blocks only conclusions that depend on it. Actual billing data
  is not available from the supported Azure MCP integration and is not a prerequisite for independent recommendations
  or proposed-resource pricing.

## Routing

| Question | Evidence |
| --- | --- |
| What would a different SKU or tier cost? | `apex-azure/pricing`, command `pricing_get`, under the [central pricing contract](../apex-azure-defaults/references/retail-pricing.md) |
| What Azure Advisor recommendations exist? | `apex-azure/advisor`, command `advisor_recommendation_list`; use `advisor_recommendation_summary` for an aggregate |
| What other VM/VMSS resize choices exist? | `apex-azure/optimization`, command `optimization_recommendation_alternatives` |
| What optimization recommendations exist? | `apex-azure/optimization`, command `optimization_recommendation_list` |
| Why is a VM/VMSS resize recommended? | `apex-azure/optimization`, command `optimization_recommendation_explain`; only provide `target-sku` when the user names it |
| What was spent, what will be spent, or how are budgets/commitments performing? | Unsupported: explain the gap; do not query or infer billing records |

Use only the exact commands in the guarded `apex-azure` inventory and follow
[cost tool guardrails](references/cost-tool-guardrails.md). Never use Azure CLI, REST, Resource Graph CLI, azqr, a
different MCP server, or memory as a fallback for unsupported cost data. For mixed requests, return the supported
recommendations or prices and state which billing information is unavailable; do not block independent work.

## Rules

- **Read-only.** Never delete, resize, stop, purchase, or retier anything during an assessment.
- **Real data.** Ground each recommendation in returned Advisor/optimization, utilization, or price evidence and label
  the source and its limits. Azure MCP recommendation savings are estimates, not actual charges or realized savings.
- **No fabricated billing.** Never provide actual spend, a whole-bill denominator, forecasts, budget utilization, or
  commitment performance without an authorized source that is not available in this integration.
- **Redis scope.** Use the Redis-specific signals only for an explicitly Redis-only request; a mixed request keeps the
  whole scope and adds Redis signals for those resources.
- **Safe classification.** Classify every candidate and never present a candidate as an approved action.

## Workflow

1. Confirm the approved scope and the specific recommendation or pricing question. Do not expand the boundary from
   names, tags, or model memory.
2. Use the matching reviewed `apex-azure` command. Request actual billing, forecast, budget, alert, or commitment
   data only to explain that this integration does not provide it; do not seek an alternate route.
3. Separate observed Advisor recommendations and utilization, returned retail prices, and any attributed estimate.
   None establishes actual charges or realized savings.
4. Evaluate only evidence-backed candidates using [cost assessment criteria](references/cost-assessment-criteria.md).
5. Classify each candidate as `safe to investigate`, `review required`, or `high risk`. State dependencies, uncertainty,
   evidence source, and freshness.
6. For mixed requests, provide supported results and clearly mark unsupported portions. Route proposed changes only
   through the kernel-authorized owning workflow.

## Boundaries

- A supported Azure MCP read is an observation, not accepted kernel evidence, an approval, or authorization.
- Do not treat a recommendation, an unused-looking resource, or a missing tag as proof that removal or downsizing is
  safe.
- Do not promise realized savings where actual bill evidence is unavailable or where utilization, pricing, allowances,
  shared allocation, or calculation method is uncertain.
- Escalate evidence that indicates an availability, security, compliance, or active incident concern to the
  kernel-selected owning assessment.

## Output

Return the target scope, supported evidence sources and freshness, findings, attributed estimates and uncertainty,
classification, unavailable requested billing data, and kernel-provided next action. Use `indeterminate` when evidence
cannot support the conclusion. Do not invent an actual-cost total.

## References

- [Cost tool guardrails](references/cost-tool-guardrails.md) - supported reads and evidence limits.
- [Cost assessment criteria](references/cost-assessment-criteria.md) - evidence, recommendation, and uncertainty rules.
- [Operational checklist](references/operational-checklist.md) - scope, evidence, and candidate safety.
