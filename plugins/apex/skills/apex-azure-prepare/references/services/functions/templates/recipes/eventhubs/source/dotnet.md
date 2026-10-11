> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# C# (.NET) Event Hub Trigger

## Source Code

Replace the HTTP trigger class with:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Net;
using System.IO;
using System.Text.Json;

namespace MyFunctions;

public class EventHubFunctions
{
    private readonly ILogger<EventHubFunctions> _logger;

    public EventHubFunctions(ILogger<EventHubFunctions> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Event Hub Trigger - processes events from Event Hub
    /// </summary>
    [Function(nameof(EventHubTrigger))]
    public void EventHubTrigger(
        [EventHubTrigger("%EVENTHUB_NAME%", Connection = "EventHubConnection", ConsumerGroup = "%EVENTHUB_CONSUMER_GROUP%")] string[] events)
    {
        foreach (var eventData in events)
        {
            _logger.LogInformation("Event Hub trigger processed an event (payload not logged)");
        }
    }

    /// <summary>
    /// HTTP endpoint to send events to Event Hub
    /// </summary>
    [Function(nameof(SendEvent))]
    [EventHubOutput("%EVENTHUB_NAME%", Connection = "EventHubConnection")]
    public string SendEvent(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "send")] HttpRequestData req)
    {
        string requestBody;
        using (var reader = new StreamReader(req.Body))
        {
            requestBody = reader.ReadToEnd();
        }

        object body;
        try
        {
            body = JsonSerializer.Deserialize<object>(requestBody) ?? new { message = "Hello Event Hub!" };
        }
        catch
        {
            body = new { message = requestBody };
        }

        var eventData = JsonSerializer.Serialize(body);
        _logger.LogInformation("Sent an event to Event Hub (payload not logged)");

        return eventData;
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    [Function(nameof(HealthCheck))]
    public HttpResponseData HealthCheck(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.WriteString("OK");
        return response;
    }
}
```

## Files to Remove

- `HttpTrigger.cs` or any HTTP function files from base template

## Package Dependencies

Add to `.csproj`:

```xml
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.EventHubs" Version="6.*" />
```

## Configuration Notes

- `%EVENTHUB_NAME%` - Reads from app setting at runtime
- `%EVENTHUB_CONSUMER_GROUP%` - Reads from app setting at runtime
- `Connection = "EventHubConnection"` - Uses settings prefixed with `EventHubConnection__`
- Uses isolated worker model (recommended for .NET 8+)

## Common Patterns

- [Error Handling](../../common/error-handling.md) — Try/catch + logging patterns
- [Health Check](../../common/health-check.md) — Health endpoint for monitoring
- [UAMI Bindings](../../common/uami-bindings.md) — Managed identity settings
