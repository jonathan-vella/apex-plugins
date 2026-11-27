---
description: "Consumer code review, comments, and security boundaries"
applyTo: "**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"
---

# APEX Code Quality

- Explain why non-obvious code exists; do not narrate obvious assignments.
- Validate inputs at boundaries and fail with precise, stable errors.
- Keep secret values out of source, logs, generated artifacts, and configuration.
- Prefer typed or structured APIs over ad hoc parsing.
- Keep changes scoped to the selected project and its declared workflow task.
