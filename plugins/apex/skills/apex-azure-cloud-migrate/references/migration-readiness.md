# Migration Readiness Assessment

Base an assessment only on accepted requirements and owner-supplied evidence. It describes readiness, not a discovery
result or a completed migration. Missing evidence is a blocker, not permission to inspect source or cloud resources.

## Assessment Fields

| Area | Capture |
| --- | --- |
| Workload | Source platform, business function, owner, criticality, runtime, and interfaces |
| Data | Classification, residency, recovery needs, and transfer constraints |
| Identity | Current trust boundary, target identity intent, and access unknowns |
| Dependencies | External services, contracts, supportability, and ordering dependencies |
| Operations | Availability, observability, continuity, support, and rollback expectations |
| Risk | Compatibility, security, data, downtime, cost, and governance risk with evidence |

## Readiness Decision

Use `ready_for_planning` only when required evidence and ownership are accepted. Use `needs_input` for missing workload
facts. Use a blocker for unsupported requirements, unresolved policy constraints, unsafe data movement, or a missing
owner. Record risk mitigation as planned intent, never as completed control evidence.

## Runtime Compatibility

Capture the source trigger, runtime family, supported target runtime, dependency model, state assumptions, and
unsupported feature risk. A runtime compatibility statement is an assessment input, not code conversion evidence.
When conversion, source inspection, or runtime verification is needed, defer it to a separately authorized capability.
