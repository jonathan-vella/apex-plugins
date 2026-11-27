# Migration Execution Boundaries

Read [shared deployment boundaries](../../apex-azure-deploy/references/execution-boundaries.md). The active kernel
task supplies accepted source evidence, scope, target intent, allowed outputs and capability names. The scenario
guides are technical guidance, not independent migration authority.

## Assessment and Implementation

- Assessment-only interprets accepted inventory/code/config evidence, maps alternatives, reports risks and stops.
  “Identify,” “export,” “analyze source” and “create report” steps below do not grant source access or file writes.
- Source inspection, conversion, local tests and report/output creation need a separately authorized available
  capability and explicit paths. Preserve the source; use a separate approved project-local output directory.
  If no such capability is available, return `defer-capability`/a blocker, not a shell or SDK substitute.
- Report headings and `<source-folder>-azure/` layouts are examples of useful fields, not new kernel schemas or
  required artifacts. A `migration-status.md` example cannot store or advance workflow state; only kernel receipts do.
- Assessment, conversion, testing, integration, infrastructure and cutover are distinct stages. A completed report
  or converted file does not prove any later stage. Never skip requirement/review/approval inputs because a service
  mapping exists. Handoff only to the next task selected by the kernel.

## Provider and Security Constraints

Code snippets demonstrate trigger/binding/SDK and configuration mapping. They are not executable cloud actions or
automatic SKU decisions. Verify current GA runtimes, package versions, extensions, regional support and SDK APIs.
The accepted workload-decision manifest selects hosting/SKUs; deployment policy and
[Azure defaults](../../apex-azure-defaults/SKILL.md) own naming, policy tags, region, AVM-first and security.

Prefer identity over keys. Key Vault/Entra role work, storage writes, SQL/EF migrations, image pushes, publishes,
traffic switches, CI setup and source-resource deletion remain native lifecycle operations with separate approval
and accepted evidence. Never propagate source secrets into code, reports, environment dumps or diagrams.
SDK examples involving outputs/messages are conversion patterns, not read-only diagnostic calls.

Read/diagnostic `az`/`azd` calls may run directly within accepted scope. Azure, Entra and GitHub setting mutations
need a fresh preview, the current runtime's Gate 4 approval and trusted deployment. Purpose-bound delivery
(DECISION-036: azd for Bicep only, native Terraform CLI for Terraform, CI-owned production runs with human approval
verified before apply) is **planned** under CP-26 to CP-30, not available commands or behavior to invent. OIDC job
identity is not human approval. APEX never runs `azd up`.
Source-cloud reads, deletion and cutover need their own provider owner/authorization; Azure approval does not cover them.

## Rendering and Completion

Current/target architecture and all standalone network, runtime, as-built, WAF, cost or compliance diagrams use the
kernel's Python diagram path from accepted typed data, never Mermaid/ASCII substitutes. Inline Mermaid is only for a
registered supported Markdown slot; today's registry has none. Return missing rendering support as a blocker.

Persist only the task-authorized artifact/evidence through its acceptance contract. Preserve traceability, producer,
hashes, freshness, redactions, reviews/dispositions, approval recipient/expiry and writer ownership. Stop at a missing
capability, pending gate, unsupported runtime or user-owned choice; never claim a workload migrated/deployed without receipts.
