# Governance Effect Interpretation

Use accepted governance constraints to determine how policy effects change architecture and binding decisions.

| Effect | Decision treatment |
| --- | --- |
| Deny | Required implementation constraint. Do not propose a noncompliant configuration. |
| Modify | Model the resulting property or tag behavior and avoid a conflicting binding. |
| Audit or AuditIfNotExists | Record the finding, evidence obligation, and validation input; do not call it compliant. |
| DeployIfNotExists | Account for the dependent resource, identity, remediation ownership, and possible cost. |
| Append | Model the appended field and ensure the selected module does not conflict with it. |
| Disabled | Preserve the definition but apply no control from that assignment. |
| Exempt | Preserve exemption scope, category, expiry, and evidence; do not remove the control globally. |

## Definition Analysis

Do not classify behavior from a display name. Use accepted definition evidence for conditions, parameters, effect,
resource aliases, scope, enforcement mode, initiative membership, and exemptions. For inherited conflicts, use the
effective result supplied by governance evidence rather than assuming the nearest assignment wins.

## Reconciliation

The Architect maps each enforcing finding (deny, modify, deployIfNotExists) during Architecture to a component,
property and disposition, or to `not-applicable` with a reason. APEX marks findings whose resource types match no
designed component not-applicable. Map each applicable constraint to a typed property, architecture adaptation,
binding decision, dependent resource, evidence obligation, or explicit blocker. Account for auto-deployed resources
in ownership, cost, and drift expectations.

Return a blocker when discovery is incomplete, a required parameter is unresolved, or the selected track/module cannot
represent the effect. Do not query assignments, create exemptions, or claim remediation from this skill.
