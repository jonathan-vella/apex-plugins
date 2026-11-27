---
description: "Consumer safe file editing and generated artifact boundaries"
applyTo: "**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"
---

# APEX Safe File Edits

- Use the client file-editing capability for source changes; do not create files through shell redirection.
- Do not use heredocs, `tee`, or inline interpreters to write project code or artifacts.
- Write accepted workflow outputs only through the owning APEX MCP operation.
- Keep generated files inside the selected project and run boundaries.
