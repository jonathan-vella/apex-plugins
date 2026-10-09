---
name: apex-microsoft-docs
description: "Researches official Microsoft documentation for APEX decisions. Use for Microsoft Learn concepts, limits, version support, WAF and architecture guidance, configuration, tutorials, and official code samples with cited evidence."
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Microsoft Documentation

Use this skill only for an active APEX architecture or planning task that needs current official Microsoft guidance.
The documentation capability is currently unavailable until it is activated and qualified for the selected client.

## Prerequisites

- `apex/taskContext` identifies the current task and the decision that needs evidence.
- An activated, client-qualified, read-only documentation capability is available for the selected projection.

Until that capability is active, return a missing-evidence blocker. Do not substitute model memory, a web scrape, a
CLI fallback, or an unverified third-party source.

## Workflow

1. Frame a specific question with product, service, version, platform, task intent, and the decision it supports.
2. Search through the qualified documentation capability before retrieving content.
3. Rank official results by directness, version/platform fit, scope, and currency.
4. Use the search excerpt when sufficient; otherwise fetch only the relevant page or section.
5. Request an official code-sample search only when runnable example code is part of the question.
6. Reconcile conflicting or incomplete sources and preserve unresolved applicability as a blocker.
7. Record concise evidence with URL, title, heading, retrieval time, applicability, and uncertainty.
8. Check that each material claim is supported and that documentation is not standing in for another evidence type.

Read [the research method](references/research-method.md) before issuing a documentation request.

## Boundaries

- This skill is advisory. It does not configure MCP servers, execute commands, or modify files.
- Azure pricing remains the read-only ARM MCP pricing evidence path, not a documentation lookup.
- Documentation does not replace governance, quota, availability, approval, or deployment evidence.
- Official examples are illustrative inputs to a later implementation decision, not proof that code compiles or deploys.
- Do not fetch broad documentation trees, copy long page bodies, or use model memory to fill a missing source.

## Blockers

Return a missing-evidence blocker when the qualified capability is absent, no official source covers the target version
or platform, sources materially conflict, the page is stale or inaccessible, or applicability cannot be established.
Name the unresolved question and the evidence needed; do not fall back to CLI, web scraping, or third-party summaries.

## References

- [Research method](references/research-method.md) covers query framing, source selection, samples, conflicts, and evidence.

## Output

Return a bounded evidence result for the active APEX decision. Include supported claims, source URLs, applicability,
retrieval metadata, uncertainty, conflicts, and missing-evidence blockers without changing task state.
