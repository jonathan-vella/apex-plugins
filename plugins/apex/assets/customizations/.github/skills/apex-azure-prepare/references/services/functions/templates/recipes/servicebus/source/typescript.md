> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# TypeScript Service Bus Trigger

Replace the contents of `src/functions/` with these files.

> ⚠️ **IMPORTANT**: Do NOT delete `src/index.ts` — it's required for function discovery. See [nodejs-entry-point.md](../../common/nodejs-entry-point.md).

> 📦 **Build Required**: Run `npm run build` before deployment to compile TypeScript to `dist/`.

## src/functions/serviceBusTrigger.ts

```typescript
import { app, InvocationContext } from "@azure/functions";

export async function serviceBusTrigger(message: unknown, context: InvocationContext): Promise<void> {
  context.log("Service Bus trigger processed a message (body not logged)");
  context.log("MessageId =", context.triggerMetadata.messageId);
  context.log("DeliveryCount =", context.triggerMetadata.deliveryCount);
  context.log("EnqueuedTimeUtc =", context.triggerMetadata.enqueuedTimeUtc);
}

app.serviceBusQueue("serviceBusTrigger", {
  connection: "ServiceBusConnection",
  queueName: "%SERVICEBUS_QUEUE_NAME%",
  handler: serviceBusTrigger,
});
```

## src/functions/sendMessage.ts

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

const serviceBusOutput = output.serviceBusQueue({
  queueName: "%SERVICEBUS_QUEUE_NAME%",
  connection: "ServiceBusConnection",
});

export async function sendMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json();
    const messageContent = JSON.stringify(body);

    context.extraOutputs.set(serviceBusOutput, messageContent);
    context.log("Sent a message to Service Bus (body not logged)");

    return {
      status: 200,
      jsonBody: { status: "sent", data: body },
    };
  } catch (error) {
    return {
      status: 400,
      jsonBody: { error: "Invalid JSON" },
    };
  }
}

app.http("sendMessage", {
  methods: ["POST"],
  route: "send",
  authLevel: "function",
  extraOutputs: [serviceBusOutput],
  handler: sendMessage,
});
```

## src/functions/healthCheck.ts

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function healthCheck(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    jsonBody: {
      status: "healthy",
      queue: process.env.SERVICEBUS_QUEUE_NAME || "not-set",
    },
  };
}

app.http("healthCheck", {
  methods: ["GET"],
  route: "health",
  authLevel: "function",
  handler: healthCheck,
});
```

## package.json additions

```json
{
  "dependencies": {
    "@azure/functions": "^4.0.0"
  }
}
```

## Files to Remove

- Any existing HTTP trigger files from the base template

## Local Testing

Set these in `local.settings.json`:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ServiceBusConnection__fullyQualifiedNamespace": "<namespace>.servicebus.windows.net",
    "SERVICEBUS_QUEUE_NAME": "orders"
  }
}
```

## Common Patterns

- [Node.js Entry Point](../../common/nodejs-entry-point.md) — **REQUIRED** src/index.ts setup + build
- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
