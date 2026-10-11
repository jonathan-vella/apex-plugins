> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# JavaScript Event Hubs Trigger

## Dependencies

**package.json:**

```json
{
  "dependencies": {
    "@azure/functions": "^4.0.0"
  }
}
```

## Source Code

**src/functions/eventHubTrigger.js:**

```javascript
const { app } = require("@azure/functions");

app.eventHub("eventHubTrigger", {
  connection: "EventHubConnection",
  eventHubName: "%EVENTHUB_NAME%",
  cardinality: "many",
  consumerGroup: "%EVENTHUB_CONSUMER_GROUP%",
  handler: async (messages, context) => {
    if (Array.isArray(messages)) {
      // Default telemetry is counts and metadata only; log payloads only under an accepted redaction policy.
      context.log(`Event Hub trigger processed ${messages.length} messages`);
      for (const message of messages) {
        context.log("Event Hub message received (payload not logged)");
      }
    } else {
      context.log("Event Hub trigger processed one message (payload not logged)");
    }
  },
});
```

**src/functions/healthCheck.js:**

```javascript
const { app } = require("@azure/functions");

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    return {
      status: 200,
      jsonBody: {
        status: "healthy",
        trigger: "eventhubs",
      },
    };
  },
});
```

## Files to Remove

- `src/functions/httpTrigger.js`

## App Settings Required

```text
EventHubConnection__fullyQualifiedNamespace=<namespace>.servicebus.windows.net
EventHubConnection__credential=managedidentity
EventHubConnection__clientId=<uami-client-id>
EVENTHUB_NAME=<hub-name>
EVENTHUB_CONSUMER_GROUP=$Default
```

## Common Patterns

- [Node.js Entry Point](../../common/nodejs-entry-point.md) — **REQUIRED** src/index.js setup
- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
