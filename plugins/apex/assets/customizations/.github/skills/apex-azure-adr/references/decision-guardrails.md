# Decision Guardrails

## Do

- Keep one decision focused on one trade-off.
- Compare viable alternatives honestly.
- Record measurable consequences when evidence exists.
- Trace the decision to requirements, governance, cost, availability, or recorded user choices.
- Preserve the original record when deprecating or superseding it.
- State what evidence or condition would cause the decision to be revisited.
- Preserve unresolved information as a blocker, unknown, or deferred decision.

## Do Not

- Create or number ADR files.
- Replace typed architecture decisions with Markdown as authority.
- Use placeholder text, fabricated evidence, or generic implementation guidance.
- Combine unrelated data, networking, identity, and deployment choices into one decision.
- Present a predetermined selection with token alternatives that were never viable.
- Treat a planned benchmark, migration, validation, or deployment as an observed result.
- Copy prices, versions, service retirement dates, policy state, or availability claims from memory.
- Perform Azure reads, writes, deployments, or role assignments directly.

## Common Failures

| Failure | Correction |
| --- | --- |
| Vague selected option | Name the service, posture, or constraint and its requirement traceability. |
| Missing alternative | Record a viable option and why accepted evidence or constraints rejected it. |
| False alternative | Remove the option or explain the mandatory constraint it violates. |
| One-sided consequence | Include both benefits and costs, risks, or operational obligations. |
| Missing WAF impact | State the relevant affected pillars and the resulting trade-off. |
| Generic implementation note | Record typed module, identity, network, diagnostics, or recovery constraints. |
| Outcome stated as intent | Label the item planned and name the future acceptance evidence. |
| Stale decision | Preserve it as deprecated or superseded and link the accepted replacement. |
| Multi-decision record | Split choices whose alternatives, owners, or reversal triggers differ. |
