---
description: "Consumer Markdown formatting and evidence language rules"
applyTo: "**/*.md"
---

# APEX Markdown Rules

- Use one H1 and structured H2 sections.
- Keep lines within 120 characters and specify languages on fenced code blocks.
- Use descriptive links and avoid feature claims that lack evidence.
- Keep generated artifact content consistent with its accepted APEX contract.
- Use accepted APEX templates before adding presentation or diagram content.
- Use `apex-mermaid` only for supported inline renderer slots; it currently reports no Mermaid-capable slots.
- Standalone output comes from kernel-rendered `packages/renderers` artifacts bound to accepted typed inputs,
  including `.py`, `.png`, and `.svg` evidence. Do not generate it independently or invoke archived skills.
- Current renderers cover architecture, WAF and cost output. General standalone classes remain deferred.
