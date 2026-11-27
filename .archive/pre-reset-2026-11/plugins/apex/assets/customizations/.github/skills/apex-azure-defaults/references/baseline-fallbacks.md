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

Always apply these 9 lowercase keys when creating or tagging a resource group unless an accepted live policy contract
explicitly overrides them, matching the organization resource-group tag-deny policy
(`enforce-resource-group-tags-exclude-resource-groups-based-on-name.json`).

| Key | Purpose | Allowed Values / Default Resolution |
| --- | --- | --- |
| `environment` | Lifecycle stage; drives policy scoping and service level. | Policy allows only `alz`, `prod`, `test`, `dev` (map `staging`/`qa`/`uat` to `test`; default from run environment). |
| `owner` | Accountable team or individual. | Non-empty string; defaults to project `riskOwner` (`partner` or `customer`). |
| `costcenter` | Finance attribution for showback or chargeback. | Non-empty string; defaults to `platform-engineering`. |
| `application` | Application identifier. | Non-empty string; defaults to `projectId`. |
| `workload` | Workload identifier that groups related resources. | Non-empty string; defaults to `projectId`. |
| `sla` | Service-level tier. | Policy allows only `critical`, `high`, `medium`, `low` (never `development`; default `low` for dev/test, `medium` for prod/zone-redundant, `high` for cross-region DR). |
| `backup-policy` | Backup policy descriptor, including an explicit `none`. | Non-empty string; defaults to `automated` when backups are enabled, otherwise `none`. |
| `maint-window` | Agreed maintenance window. | Non-empty string; defaults to `none`. |
| `technical-contact` | Technical escalation contact. | Non-empty string; defaults to `owner` / `riskOwner` (do not emit redundant `tech-contact`). |

Apply explicit user or governance values when provided; otherwise populate the runtime defaults above automatically so
resource-group creation never blocks or prompts the user to list the 9 tag keys. Optional provenance tags remain
optional and must not be represented as policy requirements.

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
