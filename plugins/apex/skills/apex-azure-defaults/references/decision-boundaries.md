# Decision Boundaries And Fallbacks

Use stable decision aids only after accepted task inputs and governance constraints. They help compare options; they do
not establish current cloud facts, prices, quotas, availability, or policy assignments.

## Decision Order

1. Apply accepted requirements, governance constraints, and recorded user decisions.
2. Compare viable service, module, tag, security, and cost-monitoring options against that evidence.
3. Record the selected option, rejected alternatives, assumptions, and affected Well-Architected pillars.
4. Keep missing policy, pricing, quota, availability, and documentation evidence deferred to its qualified owner.

## Fallback Rules

- Use baseline categories only when task context explicitly confirms no stronger policy contract.
- Treat service matrices as comparison prompts, never an automatic SKU or service selection.
- Treat cost-monitoring intent as a design obligation; delivery, configuration, and verification require their owned
  capability and accepted evidence.
- Return a blocker when the selected track cannot represent a required constraint or no qualified evidence source exists.
