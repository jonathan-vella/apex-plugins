---
name: apex-azure-diagnostics
description: '**WORKFLOW SKILL** — Diagnoses scoped Azure incidents using health, metrics, logs and KQL. WHEN: "debug production", "container app image pull", "function cold start", "app service high CPU", "AKS crashloop", "VM SSH or RDP failure", "service bus errors". DO NOT USE FOR: preflight (use apex-azure-validate), ADX analytics (use apex-azure-kusto), spending (use apex-azure-cost-optimization).'
user-invocable: false
disable-model-invocation: false
---

When calling any `apex/*` MCP tool, include the current session checkout or worktree as the required absolute
`workspace` path.

# APEX Azure Diagnostics

Use this skill for an active task's scoped production investigation. Read
[execution boundaries](references/execution-boundaries.md) first. Direct read and diagnostic `az`/`azd` calls are
allowed; the skill grants no extra tools, cloud access, mutation or independent incident workflow.

## Prerequisites

- `apex/taskContext` identifies the affected target, symptom, time window,
  environment, customer impact, and sensitivity boundary.
- Evidence records the producer, evidence hash, target
  scope, query intent, observation time, freshness, completeness, and
  redactions.
- The requested time window is sufficient to compare an incident interval with
  a baseline. Otherwise, retain a single-window interpretation as uncertain.

## Workflow

1. Define the observable symptom, impact, target and incident/baseline windows.
2. Follow the [six-phase diagnostic method](references/infraops-remediation-playbooks.md): scoped discovery, health
   and metrics, logs, recent changes, severity, reporting. These are investigation steps, not kernel state transitions.
3. Evaluate health, activity, logs, metrics, dependencies and changes as separate signals. Metadata/provisioning state
   from `az resource show` is not Resource Health availability; an unavailable signal is a gap, not proof of health.
4. Use [diagnostic interpretation](references/diagnostic-interpretation.md) to
   classify correlations, confidence, and diagnostic gaps.
5. Distinguish observed facts, likely contributors, and untested hypotheses.
   Do not label a correlation as root cause without causal evidence.
6. Return the impact summary, evidence-backed findings, uncertainty, and a
   kernel-provided escalation or next-investigation decision.

## Service Routing

| Service | Load when needed |
| --- | --- |
| Container Apps | [Image pull, revisions, ingress, probes, ports](references/container-apps/README.md) |
| Functions | [Invocations, bindings, timeouts, cold starts, App Insights linkage](references/functions/README.md) |
| App Service | [CPU, crashes, deployment history, domains and TLS](references/app-service/README.md) |
| AKS | [Cluster/pod/node intake, DNS, ingress, networking and upgrades](references/aks/aks-troubleshooting.md) |
| VMs | [RDP/SSH, NSG/firewall, authentication and VM agent](references/compute/vm-troubleshooting.md) |
| Messaging | [Event Hubs/Service Bus connectivity and SDK errors](references/messaging/README.md) |

MCP tool names in references are upstream capability hints. Inspect installed tool schemas and authorization;
never install a server, invent a tool or substitute a different data plane to fill missing evidence.
AppLens recommendations are hypotheses until corroborated.

## Read-Only Collection

Use bounded queries, safe field projections and a task-approved time window. Examples include activity-log reads,
Container App logs, App Insights traces and name-only app setting queries. Avoid indefinite `--follow` collection.
The [script examples](references/script-examples/README.md) retain Bash/PowerShell evidence collectors as source
guidance, not installed executable helpers. Audit their scope, local writes and data handling before any reuse.
`run-ig`, debug pods, `kubectl exec`, port forwarding, sends/receives and VM run-command are **not** read-only because
their purpose is diagnosis. A script's `--approve` switch is never APEX authorization.

## Boundaries

- Submit raw observations through the active task's evidence contract before claiming accepted findings. Preserve
  scope, query, observation time, hash, freshness, coverage and redactions.
- Do not restart, redeploy, scale, reset credentials, change firewall/NSG rules, cordon/drain, create privileged debug
  pods, alter messaging data or attempt mitigation directly. State changes require a fresh `apex preview`, the
  current runtime's Gate 4 approval and trusted `apex deploy`. Unsupported operations remain blocked.
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
- [Health checks](references/infraops-health-checks.md), [KQL templates](references/infraops-kql-templates.md),
  [KQL query library](references/kql-queries.md), [Resource Graph](references/azure-resource-graph.md).
- [Upstream coverage](references/upstream-coverage.md) - service guides, SDK references and script inventory.
