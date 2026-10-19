---
name: apex-terraform-import
description: '**WORKFLOW SKILL** — Assess adoption of existing Azure resources into Terraform. WHEN: "terraform import", "import Azure resources", "adopt existing infrastructure", "generate import blocks", "resource discovery". DO NOT USE FOR: Bicep (use apex-bicep-patterns), new resources (use apex-terraform-patterns), decisions (use apex-azure-adr).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Terraform Import Assessment

Use this skill for an active Terraform adoption task concerning existing resources. It evaluates accepted inventory and
mapping evidence, then records adoption intent; authorized capabilities own discovery, configuration generation,
stateful operations, validation, and lifecycle changes.
Read [the authority boundary](references/kernel-boundary.md) before using discovery or import examples.

## Adoption Rules

- Start with approved-scope read-only `az resource list` or service-specific discovery. Record the query, tenant,
  subscription, collection time, completeness and redactions; only accepted inventory establishes task facts.
- Map each ARM ID to one stable Terraform address, provider type and ownership boundary. Exclude unrelated resources.
- Manual discovery is the primary path. Terraform Search requires a compatible Terraform version and observed
  `list_resource_schemas` support; provider support is not assumed.
- Initialization/schema failures are blockers, not proof Search is unsupported. Only a valid empty schema proves
  absence for the selected initialized provider.
- Generate import blocks only through an authorized capability. Review an import-only saved plan: no create,
  update, delete or replace actions. State adoption still needs its own authorized operation and Gate 4.
- Plan AVM adoption with reviewed `moved` blocks; temporary raw-resource configuration needs an accepted exception.
  Import alone proves neither compliance nor zero drift.

## Prerequisites

- `apex/taskContext` identifies the accepted adoption task, target boundary, resource scope, and acceptance criteria.
- Accepted inventory evidence identifies its observation scope, completeness, redactions, and observation time.
- Required mapping, provider/module lock, and validation capability receipts are accepted and current for that target.

## Workflow

1. Apply [Import assessment](references/import-assessment.md) to match accepted inventory facts to resource mappings
   and ownership boundaries.
2. Apply [Mapping and adoption attestation](references/mapping-and-adoption-attestation.md) to bind each candidate to
   its intended address and accepted outcome evidence.
3. Record a typed adoption proposal with scoped identifiers, exact provider/module locks, expected managed identities,
   and reconciliation criteria.
4. Apply [Adoption attestation](references/adoption-attestation.md) to evaluate authorized outcomes and remaining drift.
5. Apply [Import mapping and reconciliation](references/import-mapping.md) to preserve candidate boundaries and
   expected reconciliation without generating import blocks or executing a stateful operation.
6. Route missing inventory, mapping, stateful-operation, or validation capabilities to the kernel as blockers. Never
   replace a missing receipt with inferred configuration or model memory.

## Boundaries

- Direct read-only Azure inventory diagnostics are allowed within the accepted scope, but never substitute for accepted
  inventory. Do not independently inspect state, generate configuration, invoke Terraform or mutate files.
- Do not perform import, preview, apply, or deployment actions.
- Import assessment does not establish ownership, compliance, a drift-free result, or deployment authorization without
  accepted evidence.

## References

- [Manual discovery and import](references/manual-import.md) - resource mappings, ARM IDs, bulk generation and
  import-only action checks. Provider apply syntax is not a direct-run instruction.
- [List-schema helper](scripts/list_resources.sh.md) - preserved read-only helper syntax; no initialization or upgrade.

- [Import assessment](references/import-assessment.md) - scoped inventory, mappings, locks, and adoption intent.
- [Mapping and adoption attestation](references/mapping-and-adoption-attestation.md) - candidate-to-address evidence
   and outcome review.
- [Adoption attestation](references/adoption-attestation.md) - receipt requirements, reconciliation, and handoff.
- [Import mapping and reconciliation](references/import-mapping.md) - candidate records, drift review, and blocked
   operations.
