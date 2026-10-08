---
name: apex-azure-cost-optimization
description: "Assess APEX cost and utilization evidence for savings opportunities. Use for cost optimization, rightsizing, orphan candidates, reservations, and Redis cost review."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Cost Optimization

Use this skill for an active APEX assessment that evaluates spending and
utilization evidence. It is advisory only: a capability produces evidence and
the kernel decides whether a later task may authorize a change.

## Prerequisites

- `apex/taskContext` identifies the target subscriptions, resource boundary,
  assessment period, currency, and the cost question to answer.
- Each evidence record identifies its producing capability, observation time,
  freshness status, target scope, redactions, completeness, and evidence hash.
- Cost, utilization, inventory, and pricing evidence use compatible scopes and
  periods. Missing, stale, partial, or scope-mismatched evidence is a blocker.

## Workflow

1. Confirm the target scope and whether the request is portfolio-wide,
   resource-specific, or Redis-specific. Do not expand the boundary from names,
   tags, or model memory.
2. Separate observed cost from observed utilization, validated price context,
   and calculated savings. A calculated estimate is not an invoice prediction.
3. Evaluate only evidence-backed candidates using the assessment rules in
   [cost assessment criteria](references/cost-assessment-criteria.md).
4. Classify each candidate as `safe to investigate`, `review required`, or
   `high risk`. State dependencies, uncertainty, evidence hash, and freshness.
5. Return ranked opportunities, non-actionable observations, and blockers.
   Send any proposed configuration, purchase, scaling, or deletion decision to
   the kernel-authorized owning workflow.

## Boundaries

- Do not request, run, or imply external queries, scans, direct reads, pricing
  lookups, or resource actions. Treat all such observations as scoped
  capability-produced evidence.
- Do not treat an orphan candidate, an unused-looking resource, or a missing
  tag as proof that removal or downsizing is safe.
- Do not promise savings where pricing evidence is absent, free allowances may
  apply, shared allocation is uncertain, or the calculation cannot be traced.
- Escalate evidence that indicates an availability, security, compliance, or
  active incident concern to the kernel-selected owning assessment.

## Output

Return the target scope, assessment period, evidence hashes and freshness,
findings, estimated savings with method, uncertainty, classification, and
kernel-provided next action. Use `indeterminate` when evidence cannot support
the conclusion.

## References

- [Cost assessment criteria](references/cost-assessment-criteria.md) - evidence
  rules, heuristics, Redis assessment, classification, and uncertainty.
- [Operational checklist](references/operational-checklist.md) -
  normalization, candidate safety, and savings traceability.
