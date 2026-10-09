---
description: "Consumer JSON and JSONC configuration rules"
applyTo: "**/*.{json,jsonc}"
---

# APEX JSON Rules

- Format JSON with two-space indentation and a final newline.
- Use JSONC comments only where the consumer client supports JSONC.
- Keep configuration declarative and free of secrets, tokens, or connection strings.
- Preserve project, run, environment, and track identifiers exactly when they are contract fields.
