## Finding Integrity

A compliance finding needs a control basis, an affected target within scope,
an observed condition, evidence hash, observation time, and coverage status.
Classify missing access, incomplete results, redacted fields, or stale evidence
as an assessment limitation rather than an absent finding.

Use categories to preserve meaning:

| Category | Typical evidence-backed concern |
| --- | --- |
| Security | Public exposure, encryption, identity, protocol, or access posture |
| Reliability | Redundancy, backup, recovery, or single-instance posture |
| Operational | Diagnostics, monitoring, inventory, or tagging coverage |
| Cost | Unused or oversized resource signal; route to cost assessment |

## Severity

Severity reflects impact and confidence, not the number of recommendations.

| Severity | Assessment meaning | Escalation boundary |
| --- | --- | --- |
| Critical | Credible high-impact exposure or expired active dependency | Urgent kernel-selected security or service owner review |
| High | Material availability or security risk with strong evidence | Priority owner review |
| Medium | Control gap or configuration concern with bounded impact | Planned owner assessment |
| Low | Improvement opportunity or weakly evidenced concern | Track with explicit uncertainty |

Reduce confidence when the scan does not cover all targets, control applicability
is unknown, a recommendation lacks resource context, or the source has not been
refreshed within policy. Never infer exploitability from configuration alone.

## Expiration Evidence

Interpret only redacted item metadata: item type, enabled state, validity start,
expiry, creation or update time, and the declared observation time. Do not
include values or material identifying sensitive content.

- An expiry before the assessment time is an expired-item finding, subject to
  enabled state and consumer dependency uncertainty.
- An expiry inside the approved warning threshold is an expiring-item finding;
  the threshold must be stated rather than assumed.
- Missing expiry is a policy or lifecycle-risk signal, not proof of compromise.
- Disabled items can reduce immediate use risk but may retain governance,
  inventory, or recovery significance.
- Ambiguous time zone, missing timestamp, or incomplete item coverage produces
  `indeterminate` status and requires refreshed scoped evidence.

## Safe Reporting

Report aggregate counts and redacted identifiers only as the task permits. Keep
the target scope, control mapping, evidence hash, freshness, and uncertainty
alongside every summary. Handoff asks for owner review; it does not contain
mutation instructions or claim that a finding has been resolved.

## Recommendation And Authentication Signals

Classify recommendation evidence by security, reliability, operational, or cost concern before assigning severity.
Authentication evidence should distinguish identity posture, least-privilege scope, and credential-management risk from
proof of access. Managed identity and narrow RBAC are recommendation criteria, not instructions to create identities,
assign roles, inspect secrets, or remediate a resource.

AzQR, Resource Graph, Key Vault metadata collection, and all SDK operations are deferred provider capabilities. They
may supply redacted evidence to this assessment only after separate qualification; this guidance never invokes them.
