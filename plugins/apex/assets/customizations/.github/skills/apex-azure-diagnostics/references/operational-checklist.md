# Diagnostics Operational Checklist

## Frame The Investigation

- State the affected target, observable symptom, environment, impact, and
  investigation window. A single window may establish correlation only.
- Compare incident evidence with a compatible baseline when one exists; keep
  the absence of a signal distinct from proof of health.
- Keep health, activity, logs, metrics, dependencies, and change evidence as
  separate signals before drawing a conclusion.

## Interpret Safely

- Classify statements as observed fact, supported contributor, or untested
  hypothesis. Root-cause claims require causal evidence, not timing alone.
- For image pulls, cold starts, probes, and request failures, preserve the
  service-specific evidence and the tested configuration boundary.
- Redact request bodies, credentials, tokens, personal data, and unapproved
  stack details; do not reconstruct redacted values by correlation.

## Escalation

Return impact, evidence hashes, uncertainty, and the authorized next
investigation. Diagnostics never authorizes scaling, rollback, or mitigation.
