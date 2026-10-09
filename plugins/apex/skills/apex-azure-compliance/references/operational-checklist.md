# Compliance Operational Checklist

## Assessment Coverage

- State the control source, target boundary, observation time, coverage, and
  omitted targets before interpreting a finding.
- Keep assessment output, inventory evidence, and Key Vault item metadata
  separate. Metadata supports expiration posture, not access to item values.
- Treat a missing, partial, stale, or unredacted assessment as indeterminate.

## Finding Discipline

- Correlate repeated signals by control and affected target before assigning
  priority; separate observations from evidence-backed findings.
- Preserve the severity rationale, evidence hash, and redaction boundary for
  each finding. Do not infer exploitability, incident cause, or remediation.
- Expiration evidence requires the observed expiration state and assessment
  policy. Missing expiry metadata is a control gap, not proof of compromise.

## Escalation

Route security exposure indicators to the authorized security owner and
remediation decisions to the kernel. A scan or assessment result is not a
compliance certification.
