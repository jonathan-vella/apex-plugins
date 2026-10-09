---
description: "Consumer guidance context and instruction size boundaries"
applyTo: ".github/agents/**/*.agent.md, .github/skills/**/SKILL.md, .github/instructions/**/*.instructions.md"
---

# APEX Context Boundaries

- Keep instructions focused on one consumer concern and use narrow `applyTo` globs.
- Move detailed decision knowledge into a skill reference rather than repeating it across agents.
- Read only the skills and references needed for the active project task.
- Prefer targeted edits over full rewrites when changing consumer guidance.
- Do not embed large logs, secrets, or complete chat history in managed guidance.
