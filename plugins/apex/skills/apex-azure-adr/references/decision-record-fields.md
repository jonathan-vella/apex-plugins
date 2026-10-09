# Architecture Decision Record Fields

Use these fields in a typed architecture or planning decision. They are presentation and quality guidance; the accepted
artifact schema remains authoritative.

## Identity And Lifecycle

Record the stable decision identifier, concise title, kernel-projected status, decision owner, deciders, decision time,
and affected workload scope. When applicable, record `supersedes` or `superseded_by`; preserve the earlier rationale.

## Context

State the problem or opportunity, current state, desired outcome, constraints, assumptions, stakeholders, accepted
evidence, affected requirement IDs, and why a decision is required now. Keep one material trade-off per decision.

## Decision Drivers

List measurable evaluation criteria such as availability, RTO/RPO, latency, consistency, residency, identity, network
exposure, operability, migration effort, cost envelope, team capability, and reversibility. Mark mandatory constraints.

## Selected Option

State the selected option precisely. Tie it to an accepted requirement, a kernel-recorded user choice, or accepted
evidence. Include scope and posture, not just a product name. Do not use vague statements such as "use a database".

## Alternatives

Record at least one viable alternative when the choice materially affects the workload. For each alternative, state its
fit against the same drivers, benefits, drawbacks, evidence, rejection rationale, and affected WAF pillars. Do not pad
the record with options that violate mandatory constraints unless the violation itself explains the rejection.

## Consequences

Record at least one positive and one negative consequence. Use measurable statements where evidence exists. Include
neutral constraints, residual risks, migration effects, lock-in, operating burden, cost sensitivity, and follow-up
obligations when they affect later planning.

## WAF And Compliance

Describe effects on Security, Reliability, Performance Efficiency, Cost Optimization, and Operational Excellence. Record
direction, rationale, mitigation, and evidence for each material effect. Record compliance, residency, identity,
governance, audit, and exception implications from accepted constraints; do not infer live policy.

## Implementation Constraints

Record binding constraints such as required module/provider family, identity model, network posture, diagnostics, or
recovery objective. Do not include direct shell commands, role assignment snippets, secret values, or deployment steps.

## Validation And Revisit

Define observable acceptance signals, decision owner, review event, reversal or migration trigger, and conditions that
would invalidate the decision. Planned validation is not evidence that validation already passed.

## Provenance

Reference accepted requirement, governance, pricing, availability, benchmark, and user-decision identifiers. Preserve
unknown and deferred evidence explicitly and never fabricate a citation.
