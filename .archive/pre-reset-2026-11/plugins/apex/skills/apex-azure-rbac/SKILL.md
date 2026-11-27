---
name: apex-azure-rbac
description: '**ANALYSIS SKILL** — Designs least-privilege Azure RBAC for APEX decisions: built-in or custom roles, control- versus data-plane permissions, scope and assignment intent. WHEN: "what role should I assign", "least privilege role", "role for managed identity", "custom role definition". DO NOT USE FOR: Graph consent (use apex-entra-app-registration), audits (use apex-azure-compliance).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure RBAC Guidance

Use this skill only for an active architecture or planning task. Accepted requirements, governance constraints, and
recorded identity decisions are authoritative.

## Prerequisites

- The principal purpose, target resource, required operations, and environment are present in `apex/taskContext`.
- Accepted role-catalog, identity, governance, and scope evidence is available.
- A selected IaC/deployment capability owns any future assignment or custom-role change.

## Rules

- **Least privilege first.** Choose the narrowest built-in role that covers the operation; a custom role only when no
  built-in role fits.
- **Narrowest scope.** Prefer resource scope, then resource group; justify any subscription or management-group scope.
- **Evaluate permissions, not names.** Decide from the role definition's permission blocks, never from a role name.
- **Bind where the resource is deployed.** Prefer the AVM module's role-assignment input for the target resource over a
  separate raw assignment.
- **Azure RBAC is not Graph consent.** Microsoft Graph and other API permissions belong to the application
  registration design.
- **Intent, not execution.** An approved role change is delivered by the selected IaC binding through kernel
  authorization; guidance never authorizes an assignment.

## Decision Workflow

1. Describe the exact operation and classify it as control-plane, data-plane, or both.
2. Resolve the logical principal and require its object/principal identity from accepted identity evidence.
3. Compare current built-in role definitions with the effective-permission rules in
   [least-privilege role selection](references/least-privilege-selection.md) and select the narrowest fit.
4. Choose the smallest viable target scope and document why a narrower scope fails.
5. Use a custom role requirement only when accepted evidence shows no built-in role fits.
6. Record deterministic assignment intent, caller authorization prerequisites, ordering, and validation expectations.
7. Check for wildcard permissions, excess scope, credential use, separation-of-duties conflicts, and unresolved evidence.

If a role definition, principal, target scope, or authorized delivery path is unresolved, return a blocker. Never widen
access to compensate for missing evidence.

## Azure CLI and azd

[Role CLI commands and delivery shapes](references/role-cli-and-iac.md) keeps the upstream `az role` commands and the
AVM, Bicep and Terraform assignment shapes.

- **Read and diagnostic** commands (`az role definition list`, `az role assignment list`) may run directly against the
  approved scope. Their output is an observation; the typed assignment intent still cites accepted evidence from
  `apex/taskContext`.
- **Commands that change Azure** (`az role definition create`, `az role assignment create|delete`) are never run by
  the agent. Role changes ship in the selected IaC binding and reach Azure only through `apex preview`, the current
  runtime's Gate 4 decision and `apex deploy` (Bicep or Terraform). A CI-owned production run with human approval
  verified before apply is a planned target (DECISION-036), not available today. The reference marks these commands
  with `# Changes Azure`.

## Boundaries

Do not assign roles, create custom roles, or expose principal IDs, credentials, or secrets. The assignment shapes in the
reference show what the selected IaC binding delivers; CodeGen owns the generated code. Approved role changes belong in
the selected IaC/deployment capability and kernel authorization flow.

## References

- Read [least-privilege role selection](references/least-privilege-selection.md) when choosing a built-in or custom role.
- Read [assignment intent fields](references/assignment-intent.md) when recording a future assignment binding.
- Read [role CLI commands and delivery shapes](references/role-cli-and-iac.md) when verifying a role against the live
  catalog or showing how an assignment is delivered.

## Output

Return bounded role requirements and assignment intents with evidence, scope rationale, prerequisites, risks, and
unresolved access blockers.
