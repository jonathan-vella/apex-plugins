# Diagnostic Execution Boundaries

Read the shared [deployment execution boundaries](../../apex-azure-deploy/references/execution-boundaries.md)
before operational examples. These rules apply to every service guide, SDK and script example in this skill.

## Scoped Observation

The active task supplies the resource IDs, subscription, service, incident/baseline window, query scope, allowed tools
and data-handling limits. Read/diagnostic `az` and `azd` commands may run directly within that scope; tool access is not
expanded by a skill. MCP names are upstream hints: inspect installed schemas and stop on unavailable/denied tools.

Prefer resource health, metadata, metrics, bounded logs, deployment history, read-only KQL and name-only configuration.
Metadata/provisioning state is not Resource Health availability. Do not print connection strings, tokens, app settings,
secret manifests or request payloads. Credential-file acquisition is a local authenticated setup operation, not a
cloud-read receipt; use an authorized credential context without dumping or overwriting existing kubeconfig.

Record target, query, time, producer, hash, freshness, sampling/truncation, redactions and coverage. Submit observations
through the active task's evidence contract. Correlation is not root cause, and unavailable telemetry is not health.

## Diagnosis Is Not Mitigation

An upstream “fix,” “remediation,” `--approve`, `-Approve`, confirmation prompt or CI approval never grants mutation
permission. Restarts, redeploys, scaling, tracing configuration, credentials/NSGs/firewalls, upgrades, role grants,
VM run-command/extensions, privileged/node debug pods, `kubectl exec`, cordon/drain and message sends/receives are
remote operations. They require an available authorized capability, fresh preview, the current runtime's Gate 4 approval
and trusted execution. Port forwarding and diagnostic test pods also need explicit task authorization; they are not
harmless read queries. Unsupported operations return blockers. Never run a script merely because it is called a
diagnostic collector.

The scripts are packaged as non-executable Markdown source examples, not runnable helpers. Read-only portions may
inform bounded command selection; local output files, logs and authentication context remain task-scoped.

## Provider Ownership and Escalation

Native provider lifecycle authority stays with its owner. The six-phase diagnostic method and severity tables are
triage guidance, not a new workflow state machine. Preserve review, approval and freshness constraints. Route confirmed
security exposure, governance drift, cost decisions and deployment readiness to their owning tasks. A failed
investigation does not authorize retry, rollback, deletion or widening network access.
