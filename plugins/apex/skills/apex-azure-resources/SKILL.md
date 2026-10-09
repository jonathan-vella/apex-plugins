---
name: apex-azure-resources
description: "Guide APEX analysis from accepted Azure inventory evidence. Use for resource scope and tag coverage."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Resource Inventory Guidance

Use this skill for an active APEX task that needs a bounded view of existing
Azure resources. Only capability-produced, accepted inventory evidence in
`apex/taskContext` is authoritative.

## Prerequisites

- The task identifies the inventory question, target subscription set,
  resource-group boundary when applicable, and result limit.
- Accepted evidence records the scope, query intent or pattern, observation
  time, result completeness, and redactions or truncation.

Return a blocker when inventory evidence is missing, stale, incomplete, or
outside the requested scope. Do not present a partial page as a complete
inventory, and do not infer resource state from names or model memory.

## Workflow

1. Match the evidence scope to the task's subscriptions, resource groups,
   resource types, and observation time.
2. Confirm the inventory query pattern answers the stated question, such as
   type inventory, location inventory, orphan candidate, tag coverage, or
   configuration posture.
3. Treat pagination, result limits, redactions, and indexing delay as explicit
   inventory boundaries.
4. Report only observed resource facts and label orphan candidates as
   candidates until accepted dependency evidence confirms them.
5. Carry the evidence identifier, scope, pattern, observation time, and
   completeness status into the typed analysis or planning artifact.
6. Route a missing or inadequate inventory to the resource-inventory
   capability with a narrower or corrected query intent.

## Boundaries

- This skill is read-only and advisory. It does not execute Azure discovery,
  run Resource Graph or KQL, create diagrams or files, or modify resources.
- Inventory evidence is not real-time monitoring, compliance certification,
  cost analysis, or deployment authorization.
- Remediation and resource changes require their authorized capability and
  gate; this skill may only describe the evidence-backed need.

## References

- [Inventory and query patterns](references/inventory-query-patterns.md) -
  scope rules, pattern selection, and interpretation limits.
- [Operational checklist](references/operational-checklist.md) -
   inventory intent, bounded results, and candidate handling.
