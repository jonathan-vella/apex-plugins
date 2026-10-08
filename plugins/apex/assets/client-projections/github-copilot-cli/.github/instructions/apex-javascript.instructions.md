---
description: "Consumer JavaScript and Node.js implementation guidance"
applyTo: "**/*.{js,mjs,cjs}"
---

# APEX JavaScript Rules

- Use ESM syntax and explicit error handling.
- Keep command execution bounded, argument-based, and free of shell interpolation.
- Parse structured input with a parser and validate external data before use.
- Avoid writing consumer state outside the owning APEX MCP or CLI operation.
