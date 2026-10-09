---
name: apex-azure-diagnostics
description: "Interpret APEX diagnostic evidence for Azure service symptoms. Use for health, logs, metrics, failed requests, cold starts, image pulls, and probe analysis."
user-invocable: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Diagnostics

Use this skill for an active APEX task that interprets capability-produced
diagnostic evidence. It supports evidence-based triage; it does not run
diagnostics, alter service state, or establish a root cause without proof.

## Prerequisites

- `apex/taskContext` identifies the affected target, symptom, time window,
  environment, customer impact, and sensitivity boundary.
- Accepted evidence records the producing capability, evidence hash, target
  scope, query intent, observation time, freshness, completeness, and
  redactions.
- The requested time window is sufficient to compare an incident interval with
  a baseline. Otherwise, retain a single-window interpretation as uncertain.

## Workflow

1. Define the symptom as an observable failure, degradation, or anomaly and
   verify that the evidence window and target match it.
2. Evaluate health, activity, logs, metrics, dependencies, and change evidence
   as separate signals. Absence in one signal is not proof of health.
3. Use [diagnostic interpretation](references/diagnostic-interpretation.md) to
   classify correlations, confidence, and diagnostic gaps.
4. Distinguish observed facts, likely contributors, and untested hypotheses.
   Do not label a correlation as root cause without causal evidence.
5. Return the impact summary, evidence-backed findings, uncertainty, and a
   kernel-provided escalation or next-investigation decision.

## Boundaries

- Do not invoke external diagnostics, run queries, access logs, inspect live
  service state, or attempt mitigation. Treat all observations as scoped
  capability-produced evidence.
- Do not expose request payloads, credentials, tokens, personal data, or stack
  traces beyond approved redaction boundaries.
- Escalate confirmed or suspected security exposure to the appropriate security
  assessment. Route deployment readiness and spending questions to their owning
  assessments.
- A diagnostic conclusion never authorizes a configuration change, rollback,
  scaling operation, or deployment.

## Output

Return the symptom, target and time scope, evidence hashes and freshness,
observed facts, hypotheses with confidence, coverage limits, impact, escalation
boundary, and kernel-provided next action.

## References

- [Diagnostic interpretation](references/diagnostic-interpretation.md) -
  evidence sequence, KQL result meaning, service signals, and uncertainty.
- [Operational checklist](references/operational-checklist.md) -
  symptom framing, signal correlation, and escalation boundaries.
