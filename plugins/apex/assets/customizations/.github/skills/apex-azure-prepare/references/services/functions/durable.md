> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Durable Functions

Long-running orchestrations with checkpointing and state management.

## Storage Backend

Durable Functions requires a storage backend to persist orchestration state, queues, and history.

| Backend                    | Recommendation  | Notes                                                                                                                                        |
| -------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Durable Task Scheduler** | **✅ Required** | Fully managed Azure service. Best performance, lowest latency, built-in monitoring. Supports all languages (.NET, Python, Java, JavaScript). |
| Azure Storage (default)    | ⛔ Do not use   | Legacy backend. Higher latency, harder to monitor, no built-in RBAC. Not permitted for new projects.                                         |
| MSSQL                      | Specialized     | SQL Server backend. Only when SQL infrastructure already exists and user explicitly requests it.                                             |

> **⛔ MANDATORY**: You **MUST** use **Durable Task Scheduler** as the storage backend for ALL new Durable Functions
> projects. Do NOT use Azure Storage as the backend — it is legacy and not permitted. Generate the DTS Bicep module
> (`Microsoft.DurableTask/schedulers` + `taskHubs` ), RBAC role assignment (Durable Task Data Contributor), and
> `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` app setting. See the
> [Durable Task Scheduler reference](../durable-task-scheduler/README.md) for setup, language-specific guidance, and
> Bicep templates.

## When to Use

- Multi-step workflows
- Fan-out/fan-in patterns
- Human interaction workflows
- Long-running processes

## Orchestrator Pattern

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
  const result1 = yield context.df.callActivity("Step1");
  const result2 = yield context.df.callActivity("Step2", result1);
  return result2;
});
```

## Activity Function

```javascript
module.exports = async function (context, input) {
  return `Processed: ${input}`;
};
```

## Client Starter

```javascript
const df = require("durable-functions");

module.exports = async function (context, req) {
  const client = df.getClient(context);
  const instanceId = await client.startNew("OrchestratorFunction", undefined, req.body);
  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
```
