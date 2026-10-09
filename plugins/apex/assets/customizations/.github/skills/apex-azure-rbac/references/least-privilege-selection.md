# Least-Privilege Role Selection

Start with the operation a workload identity needs to perform. Prefer a built-in Azure role that covers that operation
at the narrowest viable scope.

## Operation Decomposition

Describe the resource provider, resource type, operation, target data, read/write/delete semantics, and whether access is
needed continuously or only for a bounded task. Separate control-plane `actions` from data-plane `dataActions`; a role
that manages a resource does not necessarily read its data, and a data role need not manage the resource.

## Selection Workflow

1. Prefer managed identity over credentials or shared keys.
2. Use accepted current role-definition evidence to identify built-in candidates by permissions, not role-name memory.
3. Exclude candidates missing required actions or containing unjustified write, delete, delegation, or wildcard access.
4. Prefer resource scope, then resource-group scope, then broader scopes only when the operation truly spans them.
5. Check accepted governance, deny assignments, conditions, and separation-of-duties constraints.
6. Record the selected role definition identifier and why narrower candidates or scopes were insufficient.

Use a custom role only when accepted catalog evidence shows no built-in role satisfies the requirement. Define only the
required `actions` and `dataActions`, use `notActions` or `notDataActions` where justified, avoid wildcards, and keep
assignable scopes as narrow as future assignment needs permit.

## Principal And Scope Gotchas

- Bind an Azure RBAC assignment to the principal/object ID from accepted identity output, not an app/client ID label.
- Managed identities are represented by service principals, but principal type must come from accepted identity evidence.
- A resource-group scope grants access to every matching current and future child resource; document that blast radius.
- Subscription or management-group scope requires an explicit cross-resource requirement and stronger review.
- Resource-level scope may be unsupported for some operations; require current role/provider evidence before widening.
- Azure Policy and deny assignments can still block an operation granted by RBAC; do not claim effective access from a
  role assignment alone.

## Evidence Requirements

A role decision must identify the principal purpose, required operation, proposed role requirement, scope rationale,
requirement IDs, role-definition identifier, permission-plane analysis, and accepted governance or identity constraints.
When role-definition evidence is absent or stale, preserve an explicit unresolved decision instead of guessing.

## Validation

Before handoff, verify required permissions are covered, excess permissions are explained, scope contains the target,
the principal and role identifiers are accepted, and no custom role duplicates a suitable built-in role. Runtime access
and propagation require later validation receipts; this decision is not proof that access exists.

## Boundaries

Do not query live role definitions, enumerate assignments, assign roles, create custom roles, or expose principal IDs.
Those operations require dedicated read capability evidence or an approved IaC/deployment path.
