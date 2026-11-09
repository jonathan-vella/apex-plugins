# Figure Outputs and Rendering Boundary

## Supported Families

| Accepted source | Derived figure | Meaning |
| --- | --- | --- |
| Architecture components and dependencies | Architecture topology | Intended components/edges, not observed Azure state |
| Architecture `wellArchitectedAssessment` | Qualitative five-pillar WAF | Accepted status/rationale, not a numeric benchmark |
| Cost estimate line items | Cost breakdown | Monthly priced amounts, currency and explicit unpriced items |
| Cost line uncertainty | Cost uncertainty | Lower/base/upper estimates and stated confidence |

Architecture acceptance materializes these views through the existing runtime. The package includes `.py` and `.svg`;
PNG is derived from the SVG only when the pinned, hash-verified native rasterizer is available. An unavailable or
tampered rasterizer must not be disguised by claiming a successful PNG render. Do not invoke a different renderer.

The editable Python source is a maintained output, not the executable source of the runtime's SVG/PNG rendering.
APEX never runs it; visual parity of a separately executed Python file is not implied. Preserve any observed
difference as a renderer-quality finding. Do not run upstream scripts to "repair" it.

## Presentation Checklist

1. Trace every row/node/edge to the accepted object and its hash.
2. Label intended versus observed state, currency, cadence, units, unknown quantities and pricing dates.
3. Use readable labels, consistent direction, unclipped text and a legend where status needs explanation.
4. Use text as well as color for WAF/uncertainty. Do not rely on font-specific glyphs or decorative icons.
5. Verify displayed formats with the inspection tools actually available. Record unavailable visual inspection.
6. Retain source and output locations supplied by the kernel; no arbitrary filename, path or format overrides.

The current renderer uses its own bounded layout and design tokens. Upstream suggestions such as Azure-blue accents,
150-DPI editable charts, top-down topology and cluster spacing are design guidance, not mutable runtime parameters.
Do not duplicate token values in several skills or pretend upstream Graphviz attributes configure this renderer.

## Dependencies and Safety

No `pip`, system package installation, `matplotlib`, `diagrams`, Graphviz or CairoSVG execution is part of the managed
agent path. The runtime's pinned renderer/rasterizer owns prerequisites and explicit errors. A user may inspect editable
sources outside APEX, but that is not a managed execution permission or a claim of reproducible output.

The upstream `diagram_io.py` dual-output helper and installation/interactive generators are not shipped by this port:
they would create an alternate write/execution pipeline. Source examples needing them remain reference-only.
