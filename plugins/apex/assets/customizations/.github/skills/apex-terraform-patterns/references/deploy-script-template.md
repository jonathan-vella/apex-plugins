<!-- ref:deploy-script-template-v1 -->

# Deployment Script Requirements Mapped to APEX

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). Upstream shell/PowerShell apply loops are not retained as executable
templates: there is no compatibility requirement for scripts that bypass kernel approval.

## Preserved Requirements

- Validate accepted environment, subscription, resource-group ownership, location and optional deployment phase.
- Preserve approved backend configuration and lockfiles; use Entra/OIDC/managed identity, not keys.
- Bind exact source/dependency revision, state lineage and writer ownership before initializing or planning.
- Save the plan; inspect actual actions, including both replacement orders. Unexpected deletion/replacement blocks.
- A phased shared-state plan must be cumulative. Resume the approved next phase rather than restarting foundation
  against later-phase state; see [scaffold](project-scaffold.md#key-pattern-phased-deployment).
- Preserve meaningful native exit results, error diagnostics and output provenance. A failed operation stops the loop.
- Read output only after accepted successful execution; redact secrets. Do not claim native execution from simulation.

## Current Gate Flow

```text
accepted Terraform binding
  → apex preview (saved plan, exact target and source)
  → human Gate 4 decision (apex gate decide)
  → apex deploy --preview <hash>
  → accepted operation/output evidence
```

This is the enforced runtime flow. In a lab run Gates 2 and 3 are earlier kernel readiness checkpoints and Gate 4 is the
final approval of the exact preview; CI-owned production runs (CP-28, #457) are not shipped and production is blocked.

A shell `yes/no` prompt is not Gate 4. A sequence of phases does not share blanket approval:
each changed preview must be separately approved with its operation, recipient and expiry.
Never run provider apply or a local phase loop directly.

azd is not the Terraform executor: DECISION-036 keeps native Terraform CLI for Terraform and plans azd for Bicep only
(CP-26). Do not replace native Terraform execution with `azd provision`, and never run `azd up`.
