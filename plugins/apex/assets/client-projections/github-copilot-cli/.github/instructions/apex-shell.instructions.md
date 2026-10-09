---
description: "Consumer shell script structure and safety guidance"
applyTo: "**/*.sh"
---

# APEX Shell Rules

- Use `set -euo pipefail` when compatible with the script's contract.
- Validate arguments and quote variable expansions.
- Use structured tools for JSON instead of string parsing.
- Keep scripts non-interactive and do not embed secrets or direct cloud lifecycle commands.
