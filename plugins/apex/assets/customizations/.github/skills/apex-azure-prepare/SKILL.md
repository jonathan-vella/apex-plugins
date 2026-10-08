---
name: apex-azure-prepare
description: "Prepare traceable Azure delivery intent in APEX. Use for requirements, architecture, implementation planning, and IaC bindings before validation."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Preparation

Use this skill only for an active requirements, architecture, planning, or CodeGen task. It translates accepted intent
into traceable architecture, plan, and selected-track IaC binding artifacts. The kernel owns task state, approvals,
artifact acceptance, and every repository mutation.

## Prerequisites

- `apex/taskContext` identifies the active task, its allowed outputs, target environment, and evidence references.
- Requirements and any predecessor architecture or governance evidence are accepted and fresh for the active run.
- A selected IaC track is present before a binding is created; otherwise return `needs_input` or a blocker.

## Workflow

1. Trace the accepted requirements to resource, identity, networking, data, diagnostic, recovery, and operational
   decisions. Preserve unknowns and external dependencies as explicit blockers.
2. For architecture tasks, record material Well-Architected trade-offs, evidence references, and user-owned choices
   through the kernel task workflow. Do not infer subscription, policy, quota, or availability facts.
3. For planning tasks, express deployment-neutral logical intent, dependencies, ownership, controls, and acceptance
   obligations. Keep provider syntax and implementation details out of neutral planning intent.
4. Bind the accepted plan to exactly one selected IaC track. Place module, provider, API, parameter, state, and
   ownership details in that binding, while preserving the trace back to planned intent and accepted policy.
5. Use only the kernel-authorized artifact and generation capabilities named by the task envelope. Return their typed
   result, or a blocker when an output, evidence item, or approval is missing.
6. For Azure Functions intent, assess trigger, identity, network, data, and observability requirements. Record
   unavailable materialization as a future backlog item; do not compose or publish a recipe.

## Boundaries

- Do not write files directly; selected IaC generation and staging belong to the authorized CodeGen capability.
- Do not run commands, contact Azure, select a subscription, retrieve secrets, preview infrastructure, or deploy.
- Do not mark a plan approved, validated, or deployable. Those state transitions are kernel-controlled.
- Transform a request for direct Bicep, Terraform, AZD, or deployment work into the active task's approved binding and
  capability path. A direct-operation request is not authorization to mutate the workspace or Azure.

## References

- [Preparation lineage and binding](references/preparation-lineage.md) - evidence flow, artifact distinctions, and
  handoff criteria.
   checklist.

## Output

Return kernel-provided artifact identifiers, requirement traces, binding references, blockers, and the next task. Do
not claim implementation is ready for deployment until validation evidence is accepted.
