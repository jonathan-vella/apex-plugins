# Inventory Operational Checklist

## Query Intent

- Bind the inventory question to subscriptions, resource groups, types, and
  an explicit result bound before interpreting any returned evidence.
- Select one intent: type or location inventory, tag coverage, configuration
  posture, or dependency candidate. Do not expand scope from resource names.
- Treat indexing delay, pagination, truncation, and redaction as coverage
  limits that remain visible in the output.

## Interpretation

- Report observed properties only. A resource name, missing tag, or absent
  page is not proof of ownership, idleness, or deletion safety.
- Label unattached or unused-looking items as candidates until compatible
  dependency and utilization evidence supports a stronger conclusion.
- Keep inventory separate from real-time monitoring, compliance certification,
  cost allocation, and deployment authorization.

## Handoff

Record query intent, scope, observation time, evidence identifier, and coverage
limits. Request a narrower authorized inventory when the evidence is inadequate.
