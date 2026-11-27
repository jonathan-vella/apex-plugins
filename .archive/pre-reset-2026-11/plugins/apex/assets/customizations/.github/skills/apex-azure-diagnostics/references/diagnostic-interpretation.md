## Evidence Sequence

Interpret diagnostic evidence in this order: target identity and health,
incident-window logs, request and dependency outcomes, performance metrics,
then change correlation. Each signal must retain its query intent or collection
purpose, evidence hash, time range, completeness, freshness, and redactions.

Use a baseline window when available. A spike is meaningful only relative to a
comparable normal period and can still reflect traffic mix, sampling, retention,
or instrumentation changes.

## Query Result Meaning

| Signal | Supports | Does not prove |
| --- | --- | --- |
| Recent exceptions | Errors occurred in the observed window | The error caused the customer symptom |
| Failed requests | Failure rate and affected operation patterns | A backend, network, or code root cause |
| Slow requests | Latency distribution or slow operations | Capacity exhaustion or the causal dependency |
| Failed dependencies | Downstream failure correlation | Ownership or origin of the failure |
| Health or activity events | Control-plane or service-health context | Complete application health |

Time bounds, result limits, sampling, missing diagnostics, and redacted fields
are material uncertainty. Empty results mean only that the scoped evidence did
not observe a match; they do not establish absence.

## Service Signals

For containerized services, image acquisition, startup delay, probe failures,
port mismatch, and revision transitions are distinct hypotheses. For functions,
invocation failures, timeout patterns, binding failures, cold starts, and
missing configuration signals likewise need separate evidence. Preserve this
separation in the finding set so a common symptom is not mistaken for one cause.

## Confidence And Escalation

Use `observed` for directly evidenced facts, `correlated` for aligned signals,
and `hypothesis` for plausible but untested explanations. Increase confidence
only when independent evidence sources agree on target and time window.

Escalate when impact is broad, customer-facing, security-sensitive, or evidence
is too incomplete to bound the risk. The handoff identifies the unanswered
question and needed scoped evidence; it does not prescribe a live action.
