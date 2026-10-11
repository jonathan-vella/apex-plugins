---
name: apex-azure-governance
description: '**ANALYSIS SKILL** — Interprets accepted Azure Policy evidence for APEX planning: effects, effective parameters, allowed locations, required tags, exemptions, freshness. WHEN: "governance constraints", "policy blockers", "allowed locations", "required tags policy", "policy exemption". DO NOT USE FOR: tag or naming defaults (use apex-azure-defaults), compliance posture (use apex-azure-compliance).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Governance Guidance

Use this skill for an active APEX planning, architecture, or validation task that needs Azure Policy constraints. Only
capability-produced, accepted governance evidence in `apex/taskContext` is authoritative.

## Prerequisites

- The task context identifies the target subscription and applicable management-group ancestry.
- Accepted governance evidence includes its discovery status, discovery time, freshness limit, completeness signature,
  and scope.

Governance is accepted after Gate 1 and before Architecture. It is either a reviewed collected subscription baseline
or the shipped ALZ Corp reference baseline (`source: reference`), generated from a pinned Azure Landing Zones Library
release (root, landing zones and corp archetypes). The reference is the default for `local` targets and for pre-sales
work without Azure access; it has no freshness window, and a subscription target must replace it with its reviewed
baseline before Gate 3.

Return a blocker when collected evidence is missing, partial, failed, stale, or scoped to a different subscription or
management-group ancestry. Do not infer policy state from model memory, templates, a policy display name, or a prior
task. Imported completeness signatures are retained as unverified metadata; never describe them as verified
signatures. Use the runtime's scope, completeness, object-integrity and freshness verdict, not a signature claim from
an agent.

## Workflow

1. Confirm the evidence has a `COMPLETE` status and covers the task scope.
2. Measure age from successful Azure collection in UTC. Below 30 days, show the date and age and offer Use existing
   snapshot (default) or Refresh from Azure when selecting governance inputs. Do not repeatedly ask at later stages. At
   exactly 30 days or older, require refresh through the consumer collection workflow. A legacy TTL cannot shorten or
   extend this rule. Do not claim a refresh or persisted choice unless the runtime confirms it.
3. Treat `Deny` findings as blockers unless an accepted exemption records them as informational.
4. Account for `DeployIfNotExists` and `Modify` findings as deployment-time conditions rather than silently assuming the
   desired result.
5. Carry required tags, allowed locations, and relevant property-path constraints into the typed planning or
   architecture decision, using the effective values from the evidence rather than definition defaults.
6. Record the evidence identifier, scope, completeness signature, and any unresolved constraint in the staged artifact.

## Azure CLI and azd

[Policy CLI diagnostics](references/policy-cli-diagnostics.md) keeps the upstream policy discovery commands: the
assignment REST call that includes management-group inheritance, definition drill-down, `PolicyResources` queries and
compliance state.

- **Read and diagnostic** commands (`az rest --method GET` on policy assignments, `az policy assignment list`,
  `az policy definition show`, `az policy set-definition show`, `az policy state list`, `az graph query`) may run
  directly against the approved subscription and management-group ancestry. Their output is an observation; it never
  replaces or renews accepted governance evidence.
- **Commands that change Azure** (policy assignments, exemptions, remediation tasks) are never run by the agent. They
  are a governance owner's change and reach Azure only through `apex preview`, the current runtime's Gate 4 decision
  and `apex deploy` (Bicep or Terraform). A CI-owned production run with human approval verified before apply is a
  planned target (DECISION-036), not available today.

## Boundaries

- This skill is advisory. It does not collect or refresh accepted evidence, or modify resources, files, or task state.
  Accepted evidence comes from `apex governance select` and `apex governance import`.
- Governance evidence constrains a design; it does not grant an exemption or override an unresolved policy. There is
  no override path in APEX: an option blocked by a `Deny` stays blocked until accepted governance evidence changes.
- Refresh is optional below 30 days, including before deployment; native preflight and Azure enforcement are not.
  Failed optional refresh leaves valid prior evidence available. Never reuse missing, incomplete, future-dated or
  wrong-scope evidence. Download/import/commit time does not renew collection age.
- Send deployment and remediation decisions to their authorized capability and gate, not to this skill.

## References

- [Evidence interpretation](references/evidence-interpretation.md) - envelope checks, effective parameters, allowed
  locations, exemptions, and blocker routing.
- [Operational checklist](references/operational-checklist.md) - resume conditions, effect handling, and evidence
  handoff.
- [Policy CLI diagnostics](references/policy-cli-diagnostics.md) - read-only policy assignment, definition, Resource
  Graph and compliance-state commands.
