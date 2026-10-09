# Security Baseline Guidance

Apply these controls when compatible with accepted requirements and governance constraints. A stricter projected policy
always wins.

## Core Controls

| Area | Preferred decision |
| --- | --- |
| Transport | HTTPS only and the strongest accepted service-supported TLS floor. |
| Identity | Managed identity over passwords, keys, or long-lived credentials. |
| Secrets | Typed secret references; never literal secret values in artifacts or documents. |
| Data plane | Private access for production data services unless an accepted exception exists. |
| Storage | Disable anonymous/public blob access unless an accepted requirement requires it. |
| Encryption | Use platform encryption and accepted customer-managed key requirements. |
| Recovery | Make soft delete, purge protection, backup, retention, RTO, and RPO explicit. |
| Diagnostics | Route required logs, metrics, and audit events to the accepted monitoring destination. |
| Access | Least privilege, narrow scope, and explicit role intent. |

## Service And Module Checks

1. Select supported GA or LTS engine/runtime versions from accepted current documentation evidence.
2. Reject preview, innovation, classic, or retiring options for durable greenfield workloads unless explicitly accepted.
3. Check module defaults against the chosen SKU; a module may emit premium-only properties for a lower tier.
4. Treat immutable first-deployment settings as migration-sensitive decisions.
5. Use connection-string or endpoint patterns that replace deprecated keys when accepted service guidance requires it.
6. Map every accepted `Deny` constraint to a concrete typed property or return an unsatisfied blocker.

Do not treat compilation or preview success as proof that provider-side feature/SKU combinations are valid. Require the
validation receipt owned by the active track.

## Exceptions

An exception must identify the requirement, affected resource and environment, rationale, compensating control, owner,
expiry or review point, and accepted approval evidence. Public exposure, local authentication, shared keys, missing
diagnostics, or weakened recovery must never become an implicit fallback.

## Evidence Boundary

This guidance does not prove configuration. Validation, policy, and deployment receipts provide the authoritative proof.
