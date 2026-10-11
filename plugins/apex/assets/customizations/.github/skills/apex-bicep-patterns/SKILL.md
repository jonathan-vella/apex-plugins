---
name: apex-bicep-patterns
description: '**UTILITY SKILL** — Apply Bicep patterns to accepted APEX intent. WHEN: "hub-spoke Bicep", "private endpoint module", "diagnostic settings", "AVM Bicep", "bicepparam". DO NOT USE FOR: Terraform (use apex-terraform-patterns), architecture decisions (use apex-azure-adr), execution (use apex-azure-deploy).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Bicep Patterns

Use this skill for an active Bicep-bound planning or CodeGen task. It describes approved intent and acceptance criteria;
CodeGen and validators own generated files and command execution.
Read [the authority boundary](references/kernel-boundary.md); canonical
[Azure defaults](../apex-azure-defaults/SKILL.md) and accepted policy override all sample values.

## Pattern Rules

- Compose required name/location/tags/diagnostics inputs and resource ID/name/principal outputs. Verify each module's
  actual README/schema; AVM output shapes vary, and an absent principal must remain absent.
- Reuse platform-owned hub, identity, DNS and monitoring resources. Do not create an ALZ in a workload task.
- Resolve private endpoint, zone, link and zone-group ownership separately, including DINE-owned components.
- Use deterministic role-assignment names, explicit principal type and the narrowest accepted scope.
- Pin accepted AVM versions exactly from authoritative registry evidence; a sample version is not a lock.
- Diagnostics and cost monitoring follow the accepted contracts; budget amounts and contacts are inputs, not constants.
- Preserve parameter/secret-reference boundaries and environment-neutral implementation intent.
- Build, lint and what-if receipts must bind the exact generated tree. Red flags include deletion, SKU downgrade,
  public access, authentication changes and identity removal; never normalize them away.

## Prerequisites

- `apex/taskContext` identifies an accepted Bicep track task and its typed binding inputs.
- Requirements, governance, security, and architecture decisions are current.

## Workflow

1. Select only patterns supported by the accepted architecture and track binding.
2. Apply [Network and observability](references/network-and-observability.md) to private connectivity and diagnostics.
3. Read [Module interfaces and parameters](references/module-interfaces-and-parameters.md) when creating reusable
   modules or binding environment-specific inputs.
4. Read [Compiler and provider gotchas](references/compiler-and-provider-gotchas.md) before accepting module bindings.
5. Apply [AVM and CodeGen acceptance](references/avm-and-codegen-acceptance.md) to module decisions and validation intent.
6. Verify the generated intent against the [CodeGen acceptance checklist](references/codegen-acceptance-checklist.md).
7. Stage only typed intent through APEX MCP; return unavailable modules or stale evidence as blockers.

## Boundaries

- This skill does not independently write Bicep, invoke builds or deploy. Authoritative registry reads and direct
  read/diagnostic `az` commands may explain bindings; they do not replace accepted locks or preview receipts.
- CodeGen owns generated IaC; validators own build, lint, security, and preview receipts.
- Module choice does not bypass policy, cost, approval, or deployment evidence.

## References

- [Module interface](references/module-interface.md) and [bicepparam](references/bicepparam-pattern.md) - full syntax.
- [Hub-spoke](references/hub-spoke-pattern.md), [private endpoints](references/private-endpoint-pattern.md),
  [common patterns](references/common-patterns.md) and [budget](references/budget-pattern.md) - composable examples.
- [AVM pitfalls](references/avm-pitfalls.md) - resource-ID split indexes, metric-alert criteria, AKS egress,
  database networking, module-output shapes and provider-time failures. Verify service versions rather than copying them.
- [Upstream CodeGen checklist](references/codegen-validation-checklist.md) - syntax guidance, subordinate to receipts.

- [Network and observability](references/network-and-observability.md) - hub-spoke, private endpoints, and diagnostics.
- [Module interfaces and parameters](references/module-interfaces-and-parameters.md) - stable composition contracts and
  environment-neutral input binding.
- [Compiler and provider gotchas](references/compiler-and-provider-gotchas.md) - exact-schema, language, identity, SKU,
  query, and service-topology failure rules.
- [CodeGen acceptance checklist](references/codegen-acceptance-checklist.md) - final intent and evidence review loop.
- [AVM and CodeGen acceptance](references/avm-and-codegen-acceptance.md) - module binding and validation intent.
