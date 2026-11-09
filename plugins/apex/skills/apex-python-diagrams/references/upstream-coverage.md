# Python Diagrams Upstream Coverage

Source: `jonathan-vella/apex` at `c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`, directory
`.github/skills/apex-python-diagrams/`. Reviewed for CP-18 #384 and CP-21 #401; ported 2026-10-20 under the source
MIT license. Exact source files are available at that pinned Git revision; no script was executed for the port.

## Source File Dispositions

| Upstream path | vNext disposition |
| --- | --- |
| `SKILL.md` | Adapted to current renderer ownership, accepted sources and blocked unsupported families |
| `references/python-charts.md` | Adapted; runtime SVG/native PNG and emitted-but-unexecuted Python replace manual execution |
| `references/azure-components.md` | Adapted component/category semantics; external icon class catalog is not runtime input |
| `references/common-patterns.md` | Adapted topology/ownership patterns; executable library snippets omitted |
| `references/waf-cost-charts.md` | Adapted qualitative WAF, priced/unpriced and uncertainty semantics; numeric WAF scores and arbitrary projections rejected |
| `references/business-process-flows.md` | Retained as reference-only semantics with explicit producer/renderer gap |
| `references/entity-relationship-diagrams.md` | Retained cardinality/key semantics as reference-only; no ORM introspection |
| `references/integration-services.md` | Adapted service/control/data-flow distinctions without live observations |
| `references/migration-patterns.md` | Retained as reference-only lifecycle semantics; no cutover/migration executor |
| `references/sequence-auth-flows.md` | Retained as reference-only identity/sequence semantics; no token/credential operations |
| `references/timeline-gantt-diagrams.md` | Retained as reference-only schedule semantics; no invented duration or output |
| `references/ui-wireframe-diagrams.md` | Retained as reference-only UI semantics; application UI is outside APEX scope |
| `references/iac-to-diagram.md` | Adapted to accepted logical-resource/source-hash interpretation; no arbitrary code parsing/execution |
| `scripts/diagram_io.py` | Not shipped: a second Python write/render pipeline conflicts with kernel-owned SVG/PNG production |
| `scripts/generate_diagram.py` | Not shipped: interactive generator cannot replace foreground questions or accepted typed inputs |
| `scripts/multi_diagram_generator.py` | Not shipped: unsupported figure producers and arbitrary execution do not become capabilities through a skill |
| `scripts/ascii_to_diagram.py` | Not shipped: ASCII/imported text is not a typed accepted architecture producer |
| `scripts/verify_installation.py` | Not shipped: consumer Python/Graphviz installation is not required for the pinned bundled runtime |

## Adaptation Boundary

The source skill's fixed workflow-step filenames, direct repository writes, numeric WAF thresholds, dependency
installers, library helper imports and icon fetching are not current vNext contracts. Relevant domain semantics remain
in the directly linked references; executable code needing those helpers is deliberately excluded, not presented as
a broken installed dependency.

The supported runtime still renders accepted architecture, qualitative WAF, cost breakdown and cost uncertainty.
This port does not add a capability, renderer registration, output schema or live/client qualification claim.
Any future figure family needs those owning contracts and tests before the reference-only limitation can be removed.
