---
name: apex-mermaid
description: '**UTILITY SKILL** — Guides safe inline Mermaid in supported APEX Markdown slots. WHEN: "mermaid flowchart", "sequence diagram", "state diagram", "ER diagram", "class diagram", "Gantt chart", "inline markdown diagram". DO NOT USE FOR: standalone architecture, network, runtime, as-built, WAF, cost or compliance diagrams (Python diagram path), IaC generation (use apex-codegen).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Inline Mermaid

The current APEX document registry declares no Mermaid-capable slots. Do not request or emit an inline Mermaid fence
until a renderer registers a typed source, a supported slot, syntax validation, and a returned document receipt.

## Prerequisites

- The target template exposes a Mermaid-capable inline slot.
- Accepted artifact data contains every node, relationship, label, and time value to be shown.
- The renderer declares supported Mermaid syntax and validation behavior.

## Future Renderer Contract

When a renderer-supported slot exists, select the simplest diagram type that preserves accepted relationships. Apply
[syntax guidance](references/syntax.md) and [styling guidance](references/styling.md), then submit only the bounded
fence to that renderer. The renderer, rather than this skill, must validate syntax and return the document receipt.

The upstream [syntax cheatsheet](references/syntax-cheatsheet.md) preserves flowchart, sequence, Gantt, class, state
and ER examples. Use a `mermaid` fence, descriptive relationship labels, simple subgraphs, escaped text and theming
appropriate for the renderer. Prefer readable vertical or horizontal flow over gratuitous styling.

Syntax and styling references are guidance targets, not active renderer slots. They do not make Mermaid output
available until a typed source, renderer registration, and receipt exist.
The [coverage record](references/upstream-coverage.md) pins the upstream syntax and styling source.

## Boundaries

- Do not create standalone architecture, network, runtime, as-built, WAF, cost, or compliance diagrams.
- Do not write or edit files, invoke deployment, or mutate source-of-truth artifacts, templates, schemas, or state.
- Do not use unaccepted inputs, infer missing values, or treat rendered Markdown as gate evidence.
- Do not embed Azure service icons, custom SVG, secrets, physical principal IDs, unsafe links, or Mermaid click actions.
- Do not claim syntax or visual validation from model inspection; only the renderer receipt supplies that evidence.

## Blockers

When the requested document slot is unsupported, absent, or cannot be filled from accepted data, return a blocker that
names the slot, diagram type, and missing renderer support or artifact data. Also block when renderer-version syntax,
escaping, or accessibility cannot be validated. Do not emit a substitute diagram or alter any source.

## Output

Return only the renderer request or its rendered inline document result and receipt. Preserve any projected artifact and
template hashes, validation status, and unresolved blockers.
