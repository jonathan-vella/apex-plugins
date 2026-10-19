---
name: apex-azure-compliance
description: '**ANALYSIS SKILL** — Assesses accepted Azure compliance and security posture evidence for APEX tasks: finding sources, severity, Key Vault expiration metadata, redacted reporting. WHEN: "compliance scan", "security audit", "posture findings", "Key Vault expiration check", "expired certificates". DO NOT USE FOR: spend (use apex-azure-cost-optimization), policy evidence (use apex-azure-governance).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Compliance Assessment

Use this skill for an active APEX task that evaluates accepted posture evidence. It does not certify compliance, disclose
sensitive material, or apply or authorize remediation.

## Prerequisites

- `apex/taskContext` identifies the target scope, applicable control source, assessment question, sensitivity
  boundary, and freshness policy.
- Capability-produced evidence includes its producer, evidence hash, target scope, observation time, completeness,
  redactions, and control mapping.
- A finding is traceable to an observed configuration or item metadata. A recommendation without mapped evidence
  remains an observation.
- Direct read-only checks need an Azure sign-in for the intended tenant (`az login`), `Reader` on the target scope, and
  metadata-only Key Vault access such as Key Vault Reader. Follow the identity guidance in `apex-entra-app-registration`.

## Rules

- **Report, never remediate.** Keep compliance reporting separate from remediation; route every fix to its owner.
- **Metadata only.** Key Vault assessment uses item metadata. Never request or retain secret values, including the
  secrets that back certificates.
- **Coverage is explicit.** Denied access, unknown tools, unpaged results, and omitted item types are coverage gaps,
  never permission to broaden access or a reason to report "compliant".
- **Provenance matters.** Keep the recommendation source with every finding; sources differ in focus and confidence.
- **Repeat on a cadence.** Recommend a regular reassessment schedule and track findings over time; one assessment is a
  point-in-time view.

## Workflow

1. Confirm that evidence scope matches the intended subscription, resource group, resource, or vault boundary and
   identify omitted targets explicitly.
2. Separate control status, security posture signal, reliability signal, and cost observation. Do not turn one category
   into another.
3. Correlate findings by control, affected target, source, severity rationale, and evidence hash. Avoid counting
   duplicate signals from several sources as separate exposure.
4. For expiration evidence, apply the interpretation rules in
   [compliance finding criteria](references/compliance-finding-criteria.md).
5. Return a triaged, redacted finding set and route remediation decisions to the kernel-authorized owner. Escalate
   potential active exposure or outage indicators without asserting exploitation or incident cause.

## Azure CLI and azd

Four references keep the upstream commands: [Azure Quick Review](references/azure-quick-review.md) (azqr scans),
[Key Vault expiration audit](references/keyvault-expiration-audit.md) (`az keyvault ... list|show` metadata),
[Azure Resource Graph](references/azure-resource-graph.md) (`az graph query` compliance patterns) and
[remediation patterns](references/remediation-patterns.md) (CLI and Bicep fixes).

- **Read and diagnostic** commands (azqr scans, `az graph query`, `az keyvault key|certificate list|show`,
  `az keyvault secret list|list-versions`) may run directly against the approved scope. Their output is an
  observation; a finding still cites accepted evidence from `apex/taskContext`. Never run a command that returns a
  secret value.
- **Commands that change Azure** (every remediation, rotation, policy or configuration change) are never run by the
  agent. They reach Azure only through `apex preview`, the current runtime's Gate 4 decision and `apex deploy` (Bicep
  or Terraform). A CI-owned production run with human approval verified before apply is a planned target
  (DECISION-036), not available today. References mark these commands with `# Changes Azure`.

## Boundaries

- Do not inspect vault content or request secret values. Observations remain redacted to the task's approved boundary.
- Do not represent a partial assessment as compliant, noncompliant, or secure.
- Do not apply or approve remediation. The remediation patterns describe the routed change; this skill identifies the
  evidence-backed need and escalation boundary.
- Route spend questions to cost assessment, live service symptoms to diagnostic assessment, and policy-scope
  interpretation to the applicable governance task.

## Output

Return target scope, control basis, evidence hashes, freshness, redaction and coverage limits, findings with sources,
severity rationale, uncertainty, escalation need, and kernel-provided next action.

## References

- [Compliance finding criteria](references/compliance-finding-criteria.md) - sources, categories, severity, expiration
  interpretation, and escalation.
- [Operational checklist](references/operational-checklist.md) - assessment coverage, finding correlation, and
  redaction limits.
- [Azure Quick Review](references/azure-quick-review.md) - azqr scope, scan, result sheets, categories, and summary.
- [Key Vault expiration audit](references/keyvault-expiration-audit.md) - metadata-only CLI commands, fields, and
  priorities.
- [Azure Resource Graph](references/azure-resource-graph.md) - `az graph query` usage and compliance KQL patterns.
- [Remediation patterns](references/remediation-patterns.md) - routed CLI and Bicep fixes for common findings.
