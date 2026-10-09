---
name: apex-azure-storage
description: "Select secure Azure Storage services, tiers, redundancy, and lifecycle intent for active APEX architecture and planning tasks."
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Storage

Use this skill only for an active architecture or planning task. It records storage service and security intent; it does
not list, read, upload, or modify data.

## Prerequisites

- `apex/taskContext` identifies data classification, recovery objectives, access pattern, and target environment.
- Governance and security constraints are current and accepted.

## Workflow

1. Select Blob, Files, Queue, Table, or Data Lake with [Storage selection](references/storage-selection.md).
2. Bind redundancy, tier, lifecycle, identity, and network choices to requirements and governance.
3. Apply [Security and governance](references/security-and-governance.md) and
   [Service, authentication, and SDK boundary](references/service-auth-and-sdk-boundary.md) to typed intent.
4. Return missing classification, RPO/RTO, policy, or network evidence as a blocker.

## Boundaries

- This skill is advisory; it does not issue storage commands, use keys, create data, or modify resources.
- Inventory and diagnostics require accepted capability evidence; deployment remains an approved lifecycle operation.
- The kernel owns state, gates, and evidence acceptance.

## References

- [Storage selection](references/storage-selection.md) - service, tier, redundancy, and lifecycle choices.
- [Security and governance](references/security-and-governance.md) - identity, private access, and policy mapping.
- [Service, authentication, and SDK boundary](references/service-auth-and-sdk-boundary.md) - source-derived service,
  authentication, lifecycle, and implementation-boundary rules.
