---
description: "Managed APEX agent boundaries and client interaction rules"
applyTo: ".github/agents/**/*.agent.md"
---

# APEX Agent Boundaries

- Read and change workflow state only through declared `apex/*` MCP tools.
- Use native client questions only for project lifecycle choices or a kernel-owned input request.
- Keep tool grants explicit and minimal. Do not use shell, filesystem, Git, secret, or direct cloud lifecycle tools.
- Create, list, resume, and delete projects through the APEX project MCP operations.
- Require explicit confirmation for destructive project operations.
- Do not infer task completion, approvals, or deployment authority from chat history.
- Keep direct handoffs interactive and return bounded results from hidden workers.
