# Module Composition And Refactor Intent

Use accepted architecture and exact locks to describe a Terraform module boundary. This reference does not authorize
Terraform source generation, state inspection, state moves, planning, or apply.

## Composition Checklist

- Group resources only when they share lifecycle, ownership, and a cohesive interface.
- Keep cross-cutting diagnostics, policy, tags, and environment-specific bindings explicit at the accepted root
  boundary.
- Define typed inputs, stable outputs, identity requirements, private networking, and dependent-output contracts.
- Prefer an accepted AVM interface when it meets the requirement; document an exception, rationale, and review criteria
  when it does not.
- Preserve stable resource addresses across module extraction. A state transition requires a separately authorized,
  reviewed operation and evidence.

## Plan Review Signals

Treat replacement, deletion, unexpected address changes, unmanaged dependencies, provider-lock drift, or missing
diagnostics as blockers. A clean intent record is not a Terraform plan or proof of safe state migration.
