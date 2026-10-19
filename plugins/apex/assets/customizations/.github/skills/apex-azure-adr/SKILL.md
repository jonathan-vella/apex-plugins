---
name: apex-azure-adr
description: '**ANALYSIS SKILL** — Shapes Azure architecture decision records in APEX typed artifacts: one bounded question, viable alternatives, WAF and compliance consequences, revisit triggers. WHEN: "document decision", "architecture decision record", "record why we chose", "trade-off analysis", "WAF justification". DO NOT USE FOR: Azure defaults (use apex-azure-defaults), role design (use apex-azure-rbac).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Architecture Decisions

Use this skill only for an active architecture or planning task. The kernel-owned architecture artifact, recorded
architecture decisions, requirements, and governance evidence are authoritative. Decision records are fields of the
typed artifact the kernel accepts; this skill never writes, numbers, or names ADR files.

## Prerequisites

- A material decision question and affected requirement IDs are present in `apex/taskContext`.
- Accepted governance, availability, cost, lifecycle, and technical evidence needed for comparison is available.
- The kernel exposes the decision-recording capability when a new user-owned choice is required.

Create a decision record for a material, cross-cutting, costly-to-reverse, compliance-relevant, or intentionally deferred
choice. Do not create one for routine implementation detail already fixed by an accepted contract.

## Rules

1. **One decision per record.** Split choices whose alternatives, owners, or reversal triggers differ.
2. **At least two viable alternatives.** Compare them against the same drivers and give each a rejection reason. An
   option that violates a mandatory constraint is recorded only to explain that constraint.
3. **All five WAF pillars.** State the effect on each pillar, or state why a pillar has no material effect.
4. **Traceable.** Link the requirement, governance finding, evidence, or recorded user choice behind the decision.
5. **Honest consequences.** Record at least one positive and one negative consequence, measurable where evidence exists.
6. **Readable.** A reviewer should understand the record in about five minutes. No placeholders such as "TBD".

## Decision Method

1. Frame one bounded question and state why a decision is needed now.
2. List the driving requirements, constraints, assumptions, stakeholders, and accepted evidence.
3. Compare the selected option with viable alternatives against the same criteria.
4. State the selected option precisely and record why each alternative was rejected.
5. Record positive, negative, and neutral consequences, including WAF and compliance effects.
6. Record implementation constraints, validation signals, reversal cost, and revisit triggers.
7. Check the record with [decision quality](references/decision-quality.md); revise until it passes or return a blocker.

Use kernel-projected lifecycle states. `Proposed`, `Accepted`, `Deprecated`, and `Superseded` describe recorded decision
state, not an inferred workflow phase. A decision changed by implementation evidence is superseded by a new record that
explains the deviation; it is never rewritten.

## Boundaries

Do not create ADR files, sequence document numbers, write Markdown, use shell or Git, query Azure directly, or alter
architecture artifacts outside the authorized workflow.

Do not invent mutable service facts, prices, versions, policy state, benchmark results, or implementation outcomes.
Missing evidence or an unresolved user-owned trade-off is an explicit blocker.

## References

- Read [decision record fields](references/decision-record-fields.md) when constructing the typed rationale.
- Read [decision quality](references/decision-quality.md) before returning a completed decision.
- Read [decision guardrails](references/decision-guardrails.md) when alternatives or evidence are weak.
- Read [decision examples](references/decision-examples.md) when a concrete decision shape is useful.

## Output

Return bounded architecture or plan decision guidance with rationale, alternatives, consequences, requirement
traceability, accepted evidence references, implementation constraints, revisit triggers, and blockers.
