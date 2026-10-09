---
name: apex-azure-adr
description: "Records bounded Azure architecture decisions. Use for ADR rationale, alternatives, WAF and compliance consequences, implementation constraints, supersession, and revisit criteria."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Architecture Decisions

Use this skill only for an active architecture or planning task. The kernel-owned architecture artifact, recorded
architecture decisions, requirements, and governance evidence are authoritative.

## Prerequisites

- A material decision question and affected requirement IDs are present in `apex/taskContext`.
- Accepted governance, availability, cost, lifecycle, and technical evidence needed for comparison is available.
- The kernel exposes the decision-recording capability when a new user-owned choice is required.

Create a decision record for a material, cross-cutting, costly-to-reverse, compliance-relevant, or intentionally deferred
choice. Do not create one for routine implementation detail already fixed by an accepted contract.

## Decision Method

1. Frame one bounded question and state why a decision is needed now.
2. List the driving requirements, constraints, assumptions, stakeholders, and accepted evidence.
3. Compare the selected option with viable alternatives against the same criteria.
4. State the selected option precisely and record why each alternative was rejected.
5. Record positive, negative, and neutral consequences, including WAF and compliance effects.
6. Record implementation constraints, validation signals, reversal cost, and revisit triggers.
7. Check the record with [decision quality](references/decision-quality.md); revise until it passes or return a blocker.

Use kernel-projected lifecycle states. `Proposed`, `Accepted`, `Deprecated`, and `Superseded` describe recorded decision
state, not an inferred workflow phase. A superseded decision must link to its replacement; do not rewrite history.

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
