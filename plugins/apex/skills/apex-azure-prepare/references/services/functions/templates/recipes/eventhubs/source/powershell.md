> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# PowerShell Event Hub Trigger

## Source Code

Create `EventHubTrigger/run.ps1`:

```powershell
param($events, $TriggerMetadata)

foreach ($event in $events) {
    Write-Host "Event Hub trigger processed an event (payload not logged)"
    Write-Host "  EnqueuedTimeUtc: $($TriggerMetadata.EnqueuedTimeUtcArray)"
    Write-Host "  SequenceNumber: $($TriggerMetadata.SequenceNumberArray)"
}
```

Create `EventHubTrigger/function.json`:

```json
{
  "bindings": [
    {
      "type": "eventHubTrigger",
      "name": "events",
      "direction": "in",
      "eventHubName": "%EVENTHUB_NAME%",
      "connection": "EventHubConnection",
      "consumerGroup": "%EVENTHUB_CONSUMER_GROUP%",
      "cardinality": "many"
    }
  ]
}
```

Create `SendEvent/run.ps1`:

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

$body = $Request.Body
if (-not $body) {
    $body = @{ message = "Hello Event Hub!" }
}

$eventData = $body | ConvertTo-Json -Compress

Push-OutputBinding -Name outputEvent -Value $eventData

Write-Host "Sent an event to Event Hub (payload not logged)"

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = (@{ status = "sent"; data = $body } | ConvertTo-Json)
    Headers = @{ "Content-Type" = "application/json" }
})
```

Create `SendEvent/function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "Request",
      "methods": ["post"],
      "route": "send"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    },
    {
      "type": "eventHub",
      "direction": "out",
      "name": "outputEvent",
      "eventHubName": "%EVENTHUB_NAME%",
      "connection": "EventHubConnection"
    }
  ]
}
```

Create `HealthCheck/run.ps1`:

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = "OK"
})
```

Create `HealthCheck/function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "Request",
      "methods": ["get"],
      "route": "health"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    }
  ]
}
```

## Files to Remove

- Any HTTP trigger folders from base template

## Package Dependencies

No additional packages required - Event Hubs bindings are included in the extension bundle.

## Configuration Notes

- `%EVENTHUB_NAME%` - Reads from app setting at runtime
- `%EVENTHUB_CONSUMER_GROUP%` - Reads from app setting at runtime
- `connection: "EventHubConnection"` - Uses settings prefixed with `EventHubConnection__`
- `cardinality: "many"` - Batch processing for better throughput

## Common Patterns

- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
