> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# PowerShell Service Bus Trigger

Create these files in your function app.

## ServiceBusTrigger/function.json

```json
{
  "bindings": [
    {
      "name": "message",
      "type": "serviceBusTrigger",
      "direction": "in",
      "queueName": "%SERVICEBUS_QUEUE_NAME%",
      "connection": "ServiceBusConnection"
    }
  ]
}
```

## ServiceBusTrigger/run.ps1

```powershell
param([string] $message, $TriggerMetadata)

Write-Host "Service Bus trigger processed a message (body not logged)"
Write-Host "Message ID: $($TriggerMetadata.MessageId)"
Write-Host "Delivery count: $($TriggerMetadata.DeliveryCount)"
Write-Host "Enqueued time: $($TriggerMetadata.EnqueuedTimeUtc)"
```

## SendMessage/function.json

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
      "type": "serviceBus",
      "direction": "out",
      "name": "outputMessage",
      "queueName": "%SERVICEBUS_QUEUE_NAME%",
      "connection": "ServiceBusConnection"
    }
  ]
}
```

## SendMessage/run.ps1

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

$body = $Request.Body | ConvertTo-Json -Compress

# Send to Service Bus
Push-OutputBinding -Name outputMessage -Value $body

Write-Host "Sent a message to Service Bus (body not logged)"

# Return HTTP response
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Headers = @{ "Content-Type" = "application/json" }
    Body = @{
        status = "sent"
        data = $Request.Body
    } | ConvertTo-Json
})
```

## HealthCheck/function.json

```json
{
  "bindings": [
    {
      "authLevel": "function",
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

## HealthCheck/run.ps1

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

$queueName = $env:SERVICEBUS_QUEUE_NAME
if (-not $queueName) {
    $queueName = "not-set"
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Headers = @{ "Content-Type" = "application/json" }
    Body = @{
        status = "healthy"
        queue = $queueName
    } | ConvertTo-Json
})
```

## host.json

Ensure your `host.json` includes the Service Bus extension:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

## Files to Remove

- Any existing HTTP trigger function folders from the base template

## Local Testing

Set these in `local.settings.json`:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "powershell",
    "ServiceBusConnection__fullyQualifiedNamespace": "<namespace>.servicebus.windows.net",
    "SERVICEBUS_QUEUE_NAME": "orders"
  }
}
```

> **Note:** For local development with UAMI, use Azure Identity `DefaultAzureCredential`
> which will use your `az login` credentials. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production guidance.

## Common Patterns

- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
