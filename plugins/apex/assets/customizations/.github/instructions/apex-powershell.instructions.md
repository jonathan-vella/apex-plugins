---
description: "Consumer PowerShell safety and idempotent scripting guidance"
applyTo: "**/*.{ps1,psm1}"
---

# APEX PowerShell Rules

- Use approved cmdlets and explicit parameters.
- Keep scripts non-interactive and idempotent where possible.
- Require explicit confirmation through APEX project lifecycle prompts before destructive work.
- Do not embed credentials, tokens, or direct cloud deployment authority in scripts.
