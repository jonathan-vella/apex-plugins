# Baseline Fallbacks

Use fallbacks only when accepted governance evidence is complete and explicitly reports no stronger applicable
contract. Runtime configuration owns fallback values; this reference defines how to apply them safely.

## Activation Test

1. Confirm the target scope and inherited governance discovery are complete and current.
2. Confirm the relevant contract is explicitly empty or absent by design, not unavailable or partially discovered.
3. Confirm `apex/taskContext` projects fallback mode and the required runtime values.
4. Record the fallback source, evidence identifier, affected environment, and review condition.

If any test fails, return a blocker or kernel-owned deferral.

## Region Fallback

Use the runtime-projected primary region, service-specific override, and failover region. Before binding, require
accepted evidence for service and SKU availability, data residency, latency, paired-region behavior, and quota. Never
copy a region literal from guidance or silently move one service without documenting the cross-region consequence.

## Tag Fallback

When the runtime explicitly authorizes the greenfield tag fallback, use these lowercase semantic keys:

- `environment`
- `owner`
- `costcenter`
- `application`
- `workload`
- `sla`
- `backup-policy`
- `maint-window`
- `technical-contact`

Values still require projected inputs. Missing ownership, finance, or contact values are blockers. Optional provenance
tags remain optional and must not be represented as policy requirements.

## Naming And Uniqueness Fallback

Use CAF-style resource abbreviations, project/environment semantics, and one kernel-projected stable uniqueness token.
Normalize and truncate for the service before appending the token. Preserve existing deployed names unless an accepted
migration authorizes replacement.

## Security And Lifecycle Fallback

Prefer managed identity, secret references, HTTPS-only transport, an accepted supported TLS floor, disabled anonymous
blob access, private production data access, diagnostics, backup, and explicit recovery objectives. Select only a
supported GA/LTS engine or runtime backed by current accepted evidence. No baseline fallback weakens accepted policy.

## Module Fallback

Prefer an exact-version AVM or track-approved module resolved by a capability. If no suitable module exists, require a
structured exception before CodeGen. Missing resolver capability is a blocker, not permission to emit a raw resource.
