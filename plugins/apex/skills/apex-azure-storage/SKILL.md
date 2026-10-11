---
name: apex-azure-storage
description: '**UTILITY SKILL** — Selects Azure Storage services, tiers, redundancy, lifecycle and access posture for APEX architecture and planning decisions. WHEN: "blob storage", "file shares", "queue storage", "table storage", "data lake", "hot vs cool vs archive", "storage redundancy". DO NOT USE FOR: role selection (use apex-azure-rbac), storage cost review (use apex-azure-cost-optimization).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Storage

Use this skill only for an active architecture or planning task. It records storage service and security intent; it
never uploads or modifies data.

## Prerequisites

- `apex/taskContext` identifies data classification, recovery objectives, access pattern, and target environment.
- Governance and security constraints are current and accepted.

## Rules

- **Managed identity over keys.** Use Microsoft Entra authorization with managed identity; avoid account keys and
  long-lived SAS. Data access needs a data-plane role; management-plane Reader alone cannot read data.
- **No public blob access.** Keep anonymous access disabled and use private endpoints for production data unless an
  accepted exception exists.
- **Tier by observed access.** Match Hot, Cool, Cold, or Archive to access frequency and retrieval tolerance, including
  each tier's minimum retention and early-deletion charge.
- **Redundancy by recovery objectives.** Choose redundancy from RPO, RTO, and zonal or regional failure scope.
  Redundancy alone is not backup.
- **Lifecycle for long-lived data.** Tier or expire eligible data with explicit rules; deletion rules need owner-approved
  retention.
- **Premium only on evidence.** Use Premium performance only for an accepted latency or IOPS requirement.
- **Right service.** Relational, document, or messaging needs belong to SQL, Cosmos DB, Event Hubs, or Service Bus;
  record them as alternatives rather than forcing Storage.

## Workflow

1. Select Blob, Files, Queue, Table, or Data Lake with [storage selection](references/storage-selection.md).
2. Bind performance, access tier, redundancy, lifecycle, identity, and network choices to requirements and governance.
3. Apply [security and governance](references/security-and-governance.md) and
   [authentication and SDK boundary](references/service-auth-and-sdk-boundary.md) to typed intent.
4. Return missing classification, RPO/RTO, policy, or network evidence as a blocker.

## Azure CLI and azd

[Storage CLI commands](references/storage-cli-commands.md) keeps the upstream `az storage` commands and their access
requirements.

- **Read and diagnostic** commands (`az storage account list`, `az storage container list`, `az storage blob list`)
  may run directly against the approved account with `--auth-mode login`. Their output is an observation; storage
  decisions still cite accepted evidence from `apex/taskContext`. A download also writes a local file and needs
  separate authorization for the exact blob and path.
- **Commands that change Azure** (uploads, account, container, tier, lifecycle, network or redundancy changes,
  deletes) are never run by the agent. Configuration ships as IaC and data writes as reviewed workflow steps; both
  reach Azure only through `apex preview`, the current runtime's Gate 4 decision and `apex deploy` (Bicep or
  Terraform). A CI-owned production run with human approval verified before apply is a planned target (DECISION-036),
  not available today. The reference marks these commands with `# Changes Azure`.

## Boundaries

- This skill is advisory; it does not use keys, create data, or modify resources.
- Inventory and diagnostics require accepted capability evidence; deployment remains an approved lifecycle operation.
- The kernel owns state, gates, and evidence acceptance.

## References

- [Storage selection](references/storage-selection.md) - services, performance and access tiers, redundancy, and
  lifecycle choices.
- [Security and governance](references/security-and-governance.md) - identity, private access, and policy mapping.
- [Authentication and SDK boundary](references/service-auth-and-sdk-boundary.md) - credential posture, data-plane
  roles, and the implementation boundary.
- [Storage CLI commands](references/storage-cli-commands.md) - `az storage` commands by service, command routing, and
  data-plane access requirements.
