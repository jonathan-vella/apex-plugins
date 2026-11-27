# UI Wireframe Guidance

Reference-only: APEX does not develop application UI and has no wireframe producer/renderer. The upstream SVG,
Graphviz, CairoSVG and multi-generator examples are not an available managed drawing tool.

For an explicitly requested future design handoff, separate:

| Element | Evidence/decision needed |
| --- | --- |
| Screen/layout | Named user goal, viewport/responsive constraints and accepted sections |
| Navigation | Destinations, selected state and keyboard/focus behavior |
| Form | Field labels/types, required/error/help states and sensitive-input handling |
| Table/chart | Source fields, empty/loading/error states, units and accessible alternatives |
| Action | Intended effect, permission/confirmation boundary and disabled state |

Use neutral placeholders for content, not copied customer data. A wireframe is not a working application,
accessibility certification, authentication mechanism or deployment artifact.

Do not write custom SVG, launch a browser, install a converter or execute imported UI/diagram code to satisfy this
reference. Return an out-of-scope/unsupported-renderer result rather than a misleading empty image or substitute diagram.
