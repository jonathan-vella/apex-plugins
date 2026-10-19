---
name: apex-azure-resources
description: '**ANALYSIS SKILL** — Interprets accepted Azure resource inventory evidence for APEX tasks: scoped inventories, tag coverage, configuration posture and orphan candidates. WHEN: "list resources", "resource inventory", "what is deployed", "find orphaned resources", "resources missing tags". DO NOT USE FOR: cost (use apex-azure-cost-optimization), security findings (use apex-azure-compliance).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Resource Inventory Guidance

Use this skill for an active APEX task that needs a bounded view of existing Azure resources. Only capability-produced,
accepted inventory evidence in `apex/taskContext`, or the recorded inventory that `apex/inventory` returns for the
selected run, is authoritative.

## Prerequisites

- The task identifies the inventory question, target subscription set, resource-group boundary when applicable, and
  result limit.
- Accepted evidence records the scope, query intent or pattern, observation time, result completeness, and redactions
  or truncation.

Return a blocker when inventory evidence is missing, stale, incomplete, or outside the requested scope. Do not present a
partial page as a complete inventory, and do not infer resource state from names or model memory.

## Rules

- **Read-only.** Inventory never changes resources; remediation belongs to its authorized capability.
- **Scoped.** An inventory answer applies only to its recorded subscriptions, resource groups, types, and observation
  time. A row limit is not an authorization or completeness boundary.
- **Indexed, not live.** Resource Graph style inventories lag behind changes; they are not real-time monitoring.
- **Candidates, not verdicts.** An orphan or untagged result is a candidate until dependency and owner evidence confirm
  it.
- **No secrets.** Represent keys, connection strings, and secret references by name only in any summary or diagram.

## Workflow

1. Match the evidence scope to the task's subscriptions, resource groups, resource types, and observation time.
2. Confirm the inventory pattern answers the stated question, such as type inventory, location inventory, orphan
   candidate, tag coverage, or configuration posture.
3. Treat pagination, result limits, redactions, and indexing delay as explicit inventory boundaries.
4. Report only observed resource facts and label orphan candidates as candidates until accepted dependency evidence
   confirms them.
5. Carry the evidence identifier, scope, pattern, observation time, and completeness status into the typed analysis or
   planning artifact.
6. Route a missing or inadequate inventory to the resource-inventory capability with a narrower or corrected query
   intent.
7. When the user asks for a diagram of accepted inventory, use `apex-mermaid`; never diagram unrecorded resources.

## Azure CLI and azd

[Azure Resource Graph queries](references/azure-resource-graph.md) keeps the upstream `az graph query` commands, lookup
workflow and KQL patterns for inventory, orphan candidates, tags, health and services.

- **Read and diagnostic** commands (`az graph query`, `az resource list`, service `list` and `show` commands) may run
  directly against the approved subscriptions. Their output is an observation; the typed inventory decision still cites
  accepted evidence from `apex/taskContext` or `apex/inventory`.
- **Commands that change Azure** (create, update, delete, tag, move) are never run by the agent. Remediation reaches
  Azure only through `apex preview`, the current runtime's Gate 4 decision and `apex deploy` (Bicep or Terraform). A
  CI-owned production run with human approval verified before apply is a planned target (DECISION-036), not available
  today.

## Boundaries

- This skill does not create files or modify resources. A direct Resource Graph read is an observation, not accepted
  inventory evidence.
- Inventory evidence is not real-time monitoring, compliance certification, cost analysis, or deployment authorization.
- Remediation and resource changes require their authorized capability and gate; this skill may only describe the
  evidence-backed need.

## References

- [Inventory and query patterns](references/inventory-query-patterns.md) - scope rules, pattern selection, orphan
  candidate definitions, and interpretation limits.
- [Azure Resource Graph queries](references/azure-resource-graph.md) - `az graph query` usage, lookup workflow, key
  tables, and KQL patterns.
- [Operational checklist](references/operational-checklist.md) - inventory intent, bounded results, and candidate
  handling.
