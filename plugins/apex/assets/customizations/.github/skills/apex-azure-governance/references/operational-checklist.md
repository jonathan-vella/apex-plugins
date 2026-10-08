# Governance Operational Checklist

## Evidence Resume

- Reuse governance evidence only when its scope, management-group ancestry,
  completeness signature, and freshness policy still match the active task.
- Treat a changed target, expired freshness, missing signature, `PARTIAL`, or
  `FAILED` discovery result as a blocker requiring a new authorized discovery.
- Preserve unresolved property paths as unresolved. Do not manufacture an IaC
  equivalent from a policy display name or remembered convention.

## Effect Handling

- Treat `Deny` as a design blocker unless an accepted, in-scope exemption is
  current and recorded with its rationale.
- Model `Modify` and `DeployIfNotExists` as delivery-time conditions that can
  alter the observed result; they are not evidence that remediation completed.
- Keep `Audit`, `AuditIfNotExists`, and `Disabled` findings distinct from
  blocking constraints and retain their evidence provenance.

## Handoff

Record the evidence identifier, accepted scope, constraints, exemptions, and
unknowns in the decision. A governance result constrains later work; it never
grants an exemption, provider access, or remediation authority.
