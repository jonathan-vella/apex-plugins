# Decision Quality Checklist

Before completing an architecture or plan artifact, verify:

- The decision identifier, lifecycle state, owner, and scope are present.
- The decision addresses one bounded material trade-off.
- Context separates the problem from the proposed solution.
- Drivers name mandatory requirements, assumptions, and accepted evidence.
- The selected option is precise, scoped, and unambiguous.
- Viable alternatives are compared against the same criteria and have rejection rationales.
- Positive, negative, and neutral consequences are honest and measurable where evidence permits.
- Every WAF pillar is addressed or explicitly marked as having no material effect with rationale.
- Compliance and governance implications use accepted constraints.
- Implementation constraints are actionable through typed bindings without embedding execution steps.
- Validation signals and revisit or supersession triggers are testable.
- Reversal cost, residual risk, and decision ownership are visible.
- Unknown and deferred values remain explicit.
- The decision does not claim live state or results that are absent from task context.

If a mandatory requirement has no supported option, evidence is stale or absent, or a user-owned trade-off remains
unresolved, return a blocker instead of weakening the record.
