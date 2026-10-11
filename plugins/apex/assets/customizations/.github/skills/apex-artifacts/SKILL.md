---
name: apex-artifacts
description: '**UTILITY SKILL** — Present accepted APEX artifacts as bounded Markdown views. WHEN: "generate artifact", "check H2 structure", "artifact template", "as-built docs", "cost view", "runbook". DO NOT USE FOR: Azure configuration (use apex-azure-defaults), Bicep patterns (use apex-bicep-patterns), Terraform patterns (use apex-terraform-patterns).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Artifact Presentations

Present accepted typed artifacts without creating a second source of truth. The artifact schema, accepted values,
kernel decisions, and accepted object hash remain canonical; Markdown is a derived view.
Read [the authority boundary](references/kernel-boundary.md) before using an upstream outline.

## Prerequisites

- An accepted typed artifact and `apex/taskContext` are available.
- The document registry exposes the matching renderer and all required slots.
- Any referenced evidence is accepted, immutable, and safe to disclose.

## Rules

1. Select an active template only when the renderer binds it to the accepted artifact kind.
2. Preserve the selected template's heading order, slot meaning, and provenance receipt.
3. Fill slots only from `apex/taskContext`, accepted artifact values, accepted evidence, or explicit kernel decisions.
4. Preserve accepted unknown, unavailable, not-applicable, and deferred states exactly; never turn them into facts.
5. Stop when a required slot, source identifier, template identifier, or renderer capability is unavailable.
6. Return the bounded document request or kernel-rendered receipt. Never write workflow files or mutate artifact state.
7. Do not use Markdown as gate evidence, claim validation or deployment occurred, or alter values to fit an outline.

## Workflow

1. Confirm artifact acceptance, kind, disclosure boundary, and renderer support.
2. Choose an active binding below. Use an advisory outline only to shape a supported custom presentation.
3. Map every required slot to an accepted source and retain source identifiers for traceability.
4. Render once, then check heading order, unresolved slots, status language, links, and provenance.
5. Correct the bounded request and re-render until the renderer accepts it; otherwise return the blocker.

Read [presentation conventions](references/presentation-conventions.md) before preparing any document request.
Read [styling standards](references/styling-standards.md) for navigation, tables, status language and collapsible detail;
the current renderer registry, not an upstream heading table, decides supported slots and heading order.

## Available Documents

- [Requirements document](templates/requirements.md) - present an accepted `requirements` artifact.
- Architecture assessment - presents accepted components, decisions, risks, and all five qualitative WAF pillars.
- Cost estimate - presents priced and unpriced tables, pricing evidence, monthly breakdown, and uncertainty ranges.
- Architecture decisions - presents accepted `decisionRecords` with alternatives, consequences, all five WAF impacts,
  requirement links and implementation notes. Missing records remain unavailable; do not infer them from summary prose.
- Implementation plan - presents current accepted implementation intent, logical resources, dependencies, controls,
    intended outputs and source hashes. Acceptance does not establish source validation or deployment approval.
- Deployment guide - presents current accepted plan bindings, intended ownership, configuration names and secret
    references, intended outputs and the kernel preview/approval procedure. It omits values and binding parameters;
    never infer observed endpoints, verified access or execution from this design view.
- Operations runbook - presents accepted Diagnosis `operationalHandoff`, with resource-bound health-check guidance and
    explicit untested procedures or justified non-applicability. References do not establish execution or successful recovery.

The registry also exposes direct, non-template renderers for run status, deployment preview, approval evidence, and
resource inventory, and deployment summaries. Deployment summaries bind the completed operation, inventory and approval;
they distinguish simulated from native-adapter evidence without independently asserting live execution or operational
readiness. Architecture and cost packages also include deterministic Python, SVG, and PNG diagram views.
All are read-only views of accepted typed sources.

## Reference-Only Outlines

- [Architecture assessment](templates/architecture-assessment.md) and [cost estimate](templates/cost-estimate.md) remain
        reference-only outlines; their accepted sources use direct deterministic renderers. [Governance constraints](templates/governance-constraints.md)
    and [resource inventory](templates/resource-inventory.md) are
    reference-only until the registry has a matching source producer and renderer.
- [Implementation plan](templates/implementation-plan.md) is an advisory outline; its direct renderer presents accepted
    implementation intent without filling unsupported outline sections or claiming deployment readiness.
- [Operations runbook](templates/operations-runbook.md) is an advisory outline; the direct renderer requires explicit
    accepted operational handoff data and does not infer missing ownership, procedures or test outcomes.
- [Deployment summary](templates/deployment-summary.md) remains an advisory outline; the direct renderer derives its
    supported sections from completed operation evidence instead of claiming every outline slot is available.
- [Additional document outlines](references/reference-only-outlines.md) preserve useful source-document semantics.
- [Upstream outline index](references/content-index.md) preserves full requirements, architecture, planning, CodeGen,
  deployment, design, inventory, operations, backup/DR, compliance, cost, lessons and README presentation examples.
  They are advisory design references, not new renderer registrations or artifact/state formats.
- Outline navigation: [requirements](references/01-requirements-template.md),
  [architecture](references/02-architecture-template.md), [planning](references/04-plan-template.md),
  [CodeGen](references/05-code-template.md), [deployment](references/06-deploy-template.md) and
  [documentation](references/07-docs-template.md).
- [Cost sections](references/cost-estimate-sections.md), [workload-manifest presentation](references/sku-manifest-details.md)
  and [revision boundaries](references/revision-workflow.md) - preserve accepted facts, provenance and exact hashes.

Reference-only outlines never authorize rendering, file creation, cloud queries, repository reads, or state changes.
If a caller needs one, require a supported custom-document capability or clearly report that the capability is absent.

Source template structure may inform an outline, but it is not a producer or renderer registration. A template becomes
renderable only when a typed producer, registry binding, and document receipt are all available.

The current registry declares no Mermaid-capable slots. Do not request inline diagrams for these documents.

## Output

Return a bounded document request or kernel-rendered Markdown receipt. Include projected source and template identifiers,
unknowns, deferrals, evidence references, and capability blockers.
