# Compliance Finding Criteria

## Finding Integrity

A compliance finding needs a control basis, an affected target within scope,
an observed condition, evidence hash, observation time, and coverage status.
Classify missing access, incomplete results, redacted fields, or stale evidence
as an assessment limitation rather than an absent finding.

## Recommendation Sources

Record the source of every recommendation. Sources differ in focus, so a duplicate signal from two sources is one
exposure with two pieces of evidence.

| Source | Focus | Typical confidence |
| --- | --- | --- |
| Microsoft Defender for Cloud | Security posture and threat protection | High for security findings |
| Azure Proactive Resiliency Library | Reliability and resiliency practice | High for reliability findings |
| Azure Advisor | Cross-pillar recommendations, including cost | Medium; confirm resource context |
| Azure Policy compliance state | Governance controls assigned to the scope | Depends on the assignment and its effect |
| Orphaned-resource heuristics | Unused or disconnected resources | Low until dependencies are confirmed |

## Categories

Use categories to preserve meaning:

| Category | Typical evidence-backed concern |
| --- | --- |
| Security | Public endpoint, missing private endpoint, encryption, weak TLS, missing managed identity, or access posture |
| Reliability | Missing zone redundancy, single instance, missing backup, or missing disaster recovery |
| Operational | Missing diagnostic settings or alerts, missing tags, or an outdated SKU or version |
| Cost | Unused or oversized resource, or a commitment opportunity; route to cost assessment |

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
  `indeterminate` status and requires refreshed scoped evidence. Item timestamps are UTC.

Band findings against the task's approved warning threshold:

| Condition | Severity | Handoff |
| --- | --- | --- |
| Expired and enabled | Critical | Urgent owner rotation review |
| Expires within an imminent window the task defines, for example seven days | High | Priority rotation planning |
| Expires within the approved warning threshold | Medium | Planned rotation |
| No expiry set | Medium | Lifecycle policy gap |
| Expires beyond the threshold | Low | Track on the regular cadence |

Coverage must be stated, not assumed. Follow every result page, include version history only when the task asks for it,
and read certificate expiry from certificate metadata: secret listings can omit the secrets that back certificates, and
those secret values are never fetched. Production vaults take priority over non-production vaults.

## Safe Reporting

Report aggregate counts and redacted identifiers only as the task permits. Keep
the target scope, control mapping, evidence hash, freshness, and uncertainty
alongside every summary. Handoff asks for owner review; any fix it names is a routed
change (see [remediation patterns](remediation-patterns.md)), and it never
claims that a finding has been resolved.

## Recommendation And Authentication Signals

Classify recommendation evidence by security, reliability, operational, or cost concern before assigning severity.
Authentication evidence should distinguish identity posture, least-privilege scope, and credential-management risk from
proof of access. Managed identity and narrow RBAC are recommendation criteria, not instructions to create identities,
assign roles, inspect secrets, or remediate a resource.

AzQR scans, Resource Graph queries and Key Vault metadata listings are read-only and may run directly, following
[Azure Quick Review](azure-quick-review.md), [Azure Resource Graph](azure-resource-graph.md) and
[Key Vault expiration audit](keyvault-expiration-audit.md). Their output is an observation until it is accepted as
redacted evidence. SDK operations remain implementation work outside this skill.
