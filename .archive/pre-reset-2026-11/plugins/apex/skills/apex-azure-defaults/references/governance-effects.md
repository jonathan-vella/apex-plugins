# Governance Effect Interpretation

Use accepted governance constraints to determine how policy effects change architecture and binding decisions.

| Effect | Decision treatment | Binding treatment for CodeGen |
| --- | --- | --- |
| Deny | Required implementation constraint. Do not propose a noncompliant configuration. | Bind the compliant value on the translated track property, not only the Azure property path. |
| Modify | Model the resulting property or tag behavior and avoid a conflicting binding. | Record the expected mutation; never bind a value that fights it. |
| Audit or AuditIfNotExists | Record the finding, evidence obligation, and validation input; do not call it compliant. | Bind the compliant value where feasible; record any accepted gap. |
| DeployIfNotExists | Account for the dependent resource, identity, remediation ownership, and possible cost. | Avoid duplicating a verified policy-owned resource; remediation is asynchronous and an assignment is not proof that the resource exists. |
| Append | Model the appended field and ensure the selected module does not conflict with it. | Keep module defaults from overwriting the appended field. |
| Disabled | Preserve the definition but apply no control from that assignment. | No binding change. |
| Exempt | Preserve exemption scope, category, expiry, and evidence; do not remove the control globally. | Bind the control everywhere outside the exemption scope. |

For Terraform, a `Deny` maps to the translated provider argument; an Azure property path or Bicep path alone is not a
Terraform binding. Private DNS ownership stays explicit even when a `DeployIfNotExists` policy provisions some zones.

## Definition Analysis

Do not classify behavior from a display name. Use accepted definition evidence for conditions, parameters, effect,
resource aliases, scope, enforcement mode, initiative membership, and exemptions. For inherited conflicts, use the
effective result supplied by governance evidence rather than assuming the nearest assignment wins.

## Reconciliation

The Architect maps each enforcing finding (`deny`, `modify`, `deployIfNotExists`) during Architecture to a component,
property and disposition, or to `not-applicable` with a reason. APEX marks findings whose resource types match no
designed component not-applicable. **Only active `deny` findings (`enforcementMode` not `DoNotEnforce`) may use
`disposition: "blocked"` or stop the workflow.** `modify` and `deployIfNotExists` findings never block or stop
Architecture, Planning, `policy-refresh` or Validation: map them as `planned` (omitting `expectedValue` when
platform-remediated at deploy time or when optional platform add-ons such as Azure DDoS Protection Plans are not
provisioned by the workload), `satisfied` (when the workload explicitly binds the value), or `not-applicable` with a
reason, and note any platform mutation or cost caveat in Architecture notes.

Return a blocker only when discovery is incomplete or an active `deny` control cannot be satisfied by the design or
selected track/module. Do not query assignments to second-guess accepted reference governance, pause on non-`deny`
effects, create exemptions, or claim remediation from this skill.
