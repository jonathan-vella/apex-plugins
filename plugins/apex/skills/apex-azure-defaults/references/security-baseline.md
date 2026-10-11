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

## Recurring Module And Lifecycle Pitfalls

These patterns recur across modules and versions. Treat each as a check against the exact pinned interface, not as a
fixed fact about any one version.

| Pattern | Example | Decision rule |
| --- | --- | --- |
| Module default exceeds the chosen SKU | A registry module defaults network rule properties that only a premium tier supports, so a basic tier fails at deployment even though build and preview pass. | Validate module defaults against the selected SKU like explicit values. A tier upgrade or relaxed network rule is a proposed change for approval, never an automatic fix. |
| Immutable first-deployment setting | Key Vault soft-delete retention cannot change after the vault exists. | Decide it before the first deployment and record it as migration-sensitive. |
| Deprecated configuration surface | An instrumentation-key setting replaced by a connection string. | Bind the supported replacement from current service guidance. |
| Parameter shape differs from the provider API | A module parameter typed as a string where the provider property is numeric, or a renamed nested object. | Bind to the exact-version module interface evidence; if it is unavailable, block the affected binding. |
| Region-limited service | A service or model offered in a subset of regions, which can force a service-specific region override. | Require current availability evidence and record the cross-region consequence. |
| Retiring family or SKU | "Classic" services, v1 SKUs, and outdated API versions. | Exclude for greenfield; confirm the retirement horizon outlasts any reservation or commitment term before recommending one. |

AVM provenance does not prove SKU compatibility, regional support, or current lifecycle status. Missing lifecycle
evidence stays unknown and blocks the affected production choice.

## Exceptions

An exception must identify the requirement, affected resource and environment, rationale, compensating control, owner,
expiry or review point, and accepted approval evidence. Public exposure, local authentication, shared keys, missing
diagnostics, or weakened recovery must never become an implicit fallback.

## Evidence Boundary

This guidance does not prove configuration. Validation, policy, and deployment receipts provide the authoritative proof.
