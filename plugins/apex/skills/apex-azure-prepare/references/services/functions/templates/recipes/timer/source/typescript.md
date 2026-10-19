> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# TypeScript Timer Trigger

Replace the contents of `src/functions/` with these files.

> ⚠️ **IMPORTANT**: Do NOT delete `src/index.ts` — it's required for function discovery. See [nodejs-entry-point.md](../../common/nodejs-entry-point.md).

> 📦 **Build Required**: Run `npm run build` before deployment to compile TypeScript to `dist/`.

## src/functions/timerTrigger.ts

```typescript
import { app, InvocationContext, Timer } from "@azure/functions";

export async function timerTrigger(timer: Timer, context: InvocationContext): Promise<void> {
  const utcTimestamp = new Date().toISOString();

  if (timer.isPastDue) {
    context.log("Timer is past due!");
  }

  context.log(`Timer trigger executed at ${utcTimestamp}`);

  // Add your scheduled task logic here
  // Examples:
  // - Call an external API
  // - Process queued items
  // - Generate reports
  // - Clean up old data
}

app.timer("timerTrigger", {
  schedule: "%TIMER_SCHEDULE%",
  runOnStartup: false,
  useMonitor: true,
  handler: timerTrigger,
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
      schedule: process.env.TIMER_SCHEDULE || "not-set",
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

## Local Testing

Set these in `local.settings.json`:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "TIMER_SCHEDULE": "0 */5 * * * *"
  }
}
```

## Common Patterns

- [Node.js Entry Point](../../common/nodejs-entry-point.md) — **REQUIRED** src/index.ts setup + build
- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
