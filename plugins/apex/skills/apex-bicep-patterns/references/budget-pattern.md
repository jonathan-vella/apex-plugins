<!-- ref:budget-pattern-v2-pointer -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Budget & Cost Monitoring Pattern (Bicep)

**Moved.** The cost-monitoring contract (budgets, action groups, anomaly alerts) is owned by `apex-azure-defaults`.

- Contract & rules: [`../../apex-azure-defaults/references/cost-monitoring.md`](../../apex-azure-defaults/references/cost-monitoring.md)
- Bicep snippets are not shipped here; any snippet must be checked against current accepted provider evidence before use.

Do not author new content here. This stub is kept so existing skill
quick-reference tables and inbound links do not break.
