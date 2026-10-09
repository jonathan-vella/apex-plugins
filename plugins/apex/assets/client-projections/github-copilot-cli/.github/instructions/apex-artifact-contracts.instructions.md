---
description: "Typed APEX artifact and evidence handling rules"
applyTo: "**/agent-output/**/*.md, **/agent-output/**/*.json"
---

# APEX Artifact Contracts

- Treat accepted artifact schemas and task context as the authoritative output contract.
- Preserve project, run, environment, and track identity fields exactly.
- Record unknown or deferred decisions explicitly; do not fabricate evidence.
- Use the owning APEX MCP completion operation for accepted artifacts.
- Do not write secrets, credentials, raw tokens, or unredacted command output into artifacts.
