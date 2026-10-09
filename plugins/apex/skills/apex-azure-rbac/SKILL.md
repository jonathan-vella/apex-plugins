---
name: apex-azure-rbac
description: "Designs least-privilege Azure access in APEX decisions. Use for managed identities, built-in or custom role requirements, control-plane versus data-plane permissions, assignment scope, prerequisites, and idempotent binding intent."
user-invocable: false
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

## Decision Workflow

1. Describe the exact operation and classify it as control-plane, data-plane, or both.
2. Resolve the logical principal and require its object/principal identity from accepted identity evidence.
3. Compare current built-in role definitions and select the narrowest role that covers the operation.
4. Choose the smallest viable target scope and document why a narrower scope fails.
5. Use a custom role requirement only when accepted evidence shows no built-in role fits.
6. Record deterministic assignment intent, caller authorization prerequisites, ordering, and validation expectations.
7. Check for wildcard permissions, excess scope, credential use, separation-of-duties conflicts, and unresolved evidence.

If a role definition, principal, target scope, or authorized delivery path is unresolved, return a blocker. Never widen
access to compensate for missing evidence.

## Boundaries

Do not call Azure CLI, Microsoft Graph, ARM, or documentation tools; assign roles; generate direct Bicep/Terraform role
assignment code; create custom roles; or expose principal IDs, credentials, or secrets. Approved role changes belong in
the selected IaC/deployment capability and kernel authorization flow.

## References

- Read [least-privilege role selection](references/least-privilege-selection.md) when choosing a built-in or custom role.
- Read [assignment intent fields](references/assignment-intent.md) when recording a future assignment binding.

## Output

Return bounded role requirements and assignment intents with evidence, scope rationale, prerequisites, risks, and
unresolved access blockers.
