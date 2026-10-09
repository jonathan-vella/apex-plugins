# Cost Monitoring Guidance

Treat cost monitoring as an architecture and binding contract, not proof that an Azure budget or alert exists. Accepted
governance, environment policy, provider evidence, and runtime configuration determine the exact scope and values.

## Contract Inputs

- Budget amount, currency, time grain, effective period, and deployment scope
- Actual and forecast notification thresholds from accepted policy or runtime configuration
- Human owners, action-group mode, recipients, escalation path, and notification constraints
- Anomaly-detection requirement and provider-supported scope
- Environment-specific exception policy, owner, rationale, and review or expiry point

## Planning Workflow

1. Match the budget scope to the accepted deployment and governance scope.
2. Apply accepted threshold/operator/type values within the current provider notification limit.
3. Route notifications to accepted role recipients and an action group or equivalent escalation target.
4. Choose create or reuse only from accepted inventory evidence; record the target identifier and ownership.
5. Require non-empty reachable recipients when monitoring is enforced. An empty list is a blocker, not a silent skip.
6. Model anomaly detection only at a scope and shape supported by accepted current provider evidence.
7. Record module resolution, provider constraints, cost, and validation requirements for the selected IaC track.
8. Reconcile the budget with accepted cost-estimate totals and document intentional variance.

## Provider And Binding Safeguards

- Prefer exact-version AVM or approved provider modules; raw-resource fallback requires a structured exception.
- Keep display-name, schedule, view, scope, recipient, and uniqueness constraints in typed bindings.
- Do not hardcode effective dates or far-future schedule endpoints; bind through the selected capability.
- Do not assume a preview or compilation proves provider-side scheduled-action semantics.
- Treat role-based notification as informational when accepted evidence cannot establish a reachable human assignee.
- Account for auto-created or policy-deployed monitoring resources in ownership and drift expectations.

## Cost Evidence Rules

- Every amount needs accepted price evidence with service, SKU, meter, region, currency, quantity, usage, and timestamp.
- Distinguish regional and global meters using accepted pricing metadata; never substitute a region from memory.
- Disambiguate products and meters explicitly and preserve the original requested SKU when normalization is accepted.
- Usage-based meters require workload quantities; a zero projection caused by missing usage is unresolved, not free.
- Reconcile line-item sums to totals and separate baseline, variable, commitment, egress, transaction, and log costs.
- If pricing capability or a required meter is unavailable, return `estimate unavailable`; never invent a price.

## Exceptions And Blockers

Production monitoring cannot be weakened without an accepted governance-compatible exception. Record environment,
scope, rationale, owner, compensating control, and review or expiry point. Missing budget, recipients, provider support,
module evidence, or pricing evidence must remain explicit blockers or kernel-owned deferrals.
