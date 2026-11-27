# Preflight Evidence Model

## Evidence Requirements

Preflight is a claim about a specific run, target, binding, and artifact revision. Valid evidence identifies:

- The active run and target environment.
- The accepted preparation and binding artifacts being evaluated.
- The validator or trusted capability that produced the result.
- The observation time and kernel-defined freshness result.
- The acceptance criterion, outcome, and any supporting diagnostic reference.

Evidence that lacks a target, artifact revision, freshness result, or producing authority is incomplete. Treat it as a
blocker rather than estimating its validity from source files or earlier chat output.

## Outcome Semantics

| Outcome | Meaning | Lifecycle Treatment |
| --- | --- | --- |
| Pass | Current evidence meets the named criterion | Retain the evidence reference |
| Fail | Current evidence disproves the criterion | Route to the task that owns remediation |
| Blocked | Required input, authority, or evidence is absent | Request or await the missing dependency |
| Indeterminate | Evidence cannot establish an outcome | Do not advance readiness |
| Stale | Evidence exceeds the kernel-defined freshness policy | Request trusted evidence refresh |

## Acceptance Criteria

Acceptance criteria should be explicit, scoped, and independently checkable. They may cover artifact integrity, binding
consistency, policy obligations, security controls, build readiness, prerequisite availability, preview readiness, and
verification obligations. A pass for one criterion does not silently satisfy another.

## Remediation Routing

Return each non-pass outcome to its owner: requirements for an unresolved desired outcome, architecture for a decision,
planning or binding for implementation intent, CodeGen for an authorized generation batch, or a trusted validation
capability for refreshed observations. Validation never rewrites evidence it is evaluating.

## Region, Global, And Error Semantics

Evaluate a region or global prerequisite only from evidence bound to the selected target, service, binding revision, and
freshness policy. Preserve authorization, environment, compiler, provider, and policy failures as distinct outcomes;
an unavailable check is not a failed check. Policy discovery, CLI authentication, previews, and recipe command execution
remain deferred trusted capabilities, so this skill records their evidence and routes errors without executing them.
