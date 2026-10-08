---
name: apex-azure-governance
description: "Guide APEX planning from accepted Azure governance evidence. Use for policy constraints and blockers."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Governance Guidance

Use this skill for an active APEX planning, architecture, or validation task
that needs Azure Policy constraints. Only capability-produced, accepted
governance evidence in `apex/taskContext` is authoritative.

## Prerequisites

- The task context identifies the target subscription and applicable
  management-group ancestry.
- Accepted governance evidence includes its discovery status, discovery time,
  freshness limit, completeness signature, and scope.

Governance is accepted after Gate 1 and before Architecture. It is either a reviewed collected subscription baseline
or the shipped ALZ Corp reference baseline (`source: reference`), generated from a pinned Azure Landing Zones Library
release (root, landing zones and corp archetypes). The reference is the default for `local` targets and for pre-sales
work without Azure access; it has no freshness window, and a subscription target must replace it with its reviewed
baseline before Gate 3.

Return a blocker when collected evidence is missing, partial, failed, stale,
or scoped to a different subscription or management-group ancestry. Do not
infer policy state from model memory, templates, or a prior task.
Imported completeness signatures are retained as unverified metadata; never describe them as verified signatures.
Use the runtime's scope, completeness, object-integrity and freshness verdict, not a signature claim from an agent.

## Workflow

1. Confirm the evidence has a `COMPLETE` status and covers the task scope.
2. Measure age from successful Azure collection in UTC. Below 30 days, show the date and age and offer
   Use existing snapshot (default) or Refresh from Azure when selecting governance inputs. Do not repeatedly ask at
   later stages. At exactly 30 days or older, require refresh through the consumer collection workflow. A legacy TTL
   cannot shorten or extend this rule. Do not claim a refresh or persisted choice unless the runtime confirms it.
3. Treat `Deny` findings as blockers unless an accepted exemption records
   them as informational.
4. Account for `DeployIfNotExists` and `Modify` findings as deployment-time
   conditions rather than silently assuming the desired result.
5. Carry required tags, allowed locations, and relevant property-path
   constraints into the typed planning or architecture decision.
6. Record the evidence identifier, scope, completeness signature, and any
   unresolved constraint in the staged artifact.

## Boundaries

- This skill is advisory. It does not discover policy state, query Azure,
  refresh evidence, or modify resources, files, or task state.
- Governance evidence constrains a design; it does not grant an exemption or
  override an unresolved policy.
- Refresh is optional below 30 days, including before deployment; native preflight and Azure enforcement are not.
   Failed optional refresh leaves valid prior evidence available. Never reuse missing, incomplete, future-dated or
   wrong-scope evidence. Download/import/commit time does not renew collection age.
- Send deployment and remediation decisions to their authorized capability
  and gate, not to this skill.

## References

- [Evidence interpretation](references/evidence-interpretation.md) -
  envelope checks, classification, exemptions, and blocker routing.
- [Operational checklist](references/operational-checklist.md) -
   resume conditions, effect handling, and evidence handoff.
