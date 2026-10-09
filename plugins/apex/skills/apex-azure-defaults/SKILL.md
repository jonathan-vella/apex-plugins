---
name: apex-azure-defaults
description: "Applies projected Azure defaults safely in APEX decisions. Use for region fallback, CAF naming, tags, security, service lifecycle, AVM bindings, network planning, governance effects, and cost monitoring."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Defaults

Use this skill only for an active APEX task. Accepted governance constraints and runtime configuration are
authoritative. Task context supplies only the values actually provided for the active task. This skill does not define
customer policy, discover Azure state, or execute Azure operations.

## Prerequisites

- `apex/taskContext` identifies the active workload, environment, target, and IaC track.
- Governance, availability, pricing, quota, and module evidence required by the decision is accepted and current.
- A kernel capability owns any lookup, validation, or state change the decision requires.

## Precedence

Apply accepted governance first, then explicit requirements and decisions, then runtime configuration. Use a baseline
fallback only when accepted evidence establishes that no stronger contract applies. Incomplete discovery is not the
same as an empty policy result.

## Decision Workflow

1. Use the environment and target only when the active task context provides them; otherwise return a blocker. Do not
  infer a region, subscription, tag, or policy requirement from chat history.
2. Resolve conflicts through the precedence rule and preserve the governing evidence identifier.
3. Select service, region, network, identity, module, monitoring, and naming intent from accepted inputs.
4. Record every fallback, exception, unknown, and deferred decision with requirement and evidence traceability.
5. Check the bounded decision for policy coverage, lifecycle support, region/SKU fit, security, repeatability, and cost.
6. If the check exposes a gap, revise the decision and repeat. If evidence or capability is absent, return a blocker.

## References

- Read [baseline fallbacks](references/baseline-fallbacks.md) only when accepted evidence permits fallback behavior.
- Read [naming guidance](references/naming.md) when binding resource names or uniqueness inputs.
- Read [tag precedence](references/tag-precedence.md) when policy, inheritance, casing, or fallback tags are relevant.
- Read [security baseline](references/security-baseline.md) for identity, exposure, encryption, lifecycle, and diagnostics.
- Read [AVM binding guidance](references/avm-binding-guidance.md) when choosing or excepting a module.
- Read [service selection](references/service-selection.md) when comparing Azure service classes or WAF trade-offs.
- Read [governance effects](references/governance-effects.md) when translating accepted policy into decisions.
- Read [network planning](references/network-planning.md) when a workload requires VNet attachment or private access.
- Read [cost monitoring](references/cost-monitoring.md) when planning budgets, alert routing, anomaly detection, or cost
  evidence.
- [Decision boundaries](references/decision-boundaries.md) - fallback order, matrix use, and deferred evidence.

## Capability Boundaries

- Do not query Azure, registries, documentation, prices, quotas, identities, or repositories from this skill.
- Do not select a mutable version, SKU, region, price, retirement date, or provider limit from memory.
- Do not emit Bicep, Terraform, shell commands, policy exemptions, role assignments, or deployment actions.
- Treat missing discovery, resolver, pricing, networking, or validation capability as a blocker, not permission to guess.

## Output

Return bounded architecture, plan, or binding decisions with requirement IDs, evidence identifiers, source precedence,
exceptions, unknowns, deferrals, and blockers. Never turn absent evidence into a default or a successful validation.
