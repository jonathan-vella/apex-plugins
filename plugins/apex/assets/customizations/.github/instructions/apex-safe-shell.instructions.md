---
description: "Consumer shell safety and non-interactive command rules"
applyTo: ".github/agents/**/*.agent.md, .github/prompts/**/*.prompt.md, .github/skills/**/SKILL.md"
---

# APEX Shell Safety

- Use non-interactive commands only; do not use confirmation flags or prompt-driven shell builtins.
- Keep command output bounded and summarize results instead of replaying large logs.
- Do not request, print, store, or pass secrets through chat or command arguments.
- Use explicit paths and arguments; avoid shell interpolation for consumer workflow operations.
