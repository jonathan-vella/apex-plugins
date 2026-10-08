## Presentation Conventions

Use a template only after the kernel accepts the matching typed artifact. Keep the artifact and its kernel-rendered
document receipt canonical; the Markdown presentation is a derived view.

### Authority And Provenance

- Record the renderer-projected artifact identifier and template identifier.
- Keep accepted values, units, scopes, status, and evidence references unchanged.
- Label design, planned, simulated, expected, and observed values distinctly.
- Never claim current Azure state, successful validation, or deployment from a template placeholder.

### Slot Rules

- Replace every required `{slot-name}` from accepted values or explicit kernel decisions.
- Preserve `unknown`, `deferred`, `unavailable`, and `not applicable` as supplied by the renderer.
- Keep optional sections only when accepted data supports them; do not manufacture empty success claims.
- Stop and report a blocker when a required slot, renderer, artifact kind, or disclosure permission is unavailable.
- Do not infer, invent, normalize, or use a presentation to change artifact meaning.

### Traceability

- Connect requirements to decisions, controls, implementation intent, risks, and accepted evidence where slots permit.
- For governance, map each accepted constraint to a control, adaptation, exemption, or unsatisfied blocker.
- For plans and inventories, account for every accepted resource and identify coverage gaps explicitly.
- For as-built views, show design-versus-observed variance only when both accepted values exist.

### Cost Semantics

- State currency, region, pricing basis, usage quantities, query or evidence time, and expected variance.
- Separate fixed or baseline cost from usage-sensitive cost and list redesign or scale triggers.
- Represent savings as `quantified`, `not quantified`, or `not applicable`; never render zero as "not evaluated."
- Do not present mutable prices as current unless accepted pricing evidence carries that claim.

### Document Shape

- Preserve template H2 order and use H3 sections for detail.
- Prefer concise tables for comparisons, controls, resources, risks, and ownership.
- Use callouts only for material notes, warnings, blockers, or irreversible consequences.
- Include inline Mermaid only for a supported diagram slot and only from accepted nodes and relationships.
- Keep links relative or from accepted source URLs; do not invent repository paths or portal links.

### Receipt

When available, include renderer-provided artifact and template identifiers, evidence identifiers, and render status.

### Validation Loop

1. Check required slots and accepted source mappings before rendering.
2. Render through the kernel capability.
3. Check unresolved placeholders, heading order, status wording, disclosure, links, and receipt identifiers.
4. Correct the request and re-render. If the renderer still cannot satisfy a required slot, return the blocker.
