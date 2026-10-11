> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Service Bus - Messaging Patterns

## Point-to-Point (Queue)

```text
Producer → Queue → Consumer
```

Use for: Work distribution, command processing

## Pub/Sub (Topic + Subscriptions)

```text
Publisher → Topic → Subscription A → Consumer A
                 → Subscription B → Consumer B
```

Use for: Event broadcasting, multiple consumers

## SDK Patterns

### Managed Identity (Recommended)

#### Node.js

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```javascript
const { ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const fullyQualifiedNamespace = process.env.SERVICEBUS_NAMESPACE + ".servicebus.windows.net";
const client = new ServiceBusClient(fullyQualifiedNamespace, credential);

// Send
const sender = client.createSender("orders");
await sender.sendMessages({ body: { orderId: "123" } });

// Receive
const receiver = client.createReceiver("orders");
const messages = await receiver.receiveMessages(10);
for (const message of messages) {
  await receiver.completeMessage(message);
}
```

#### Python

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```python
from azure.servicebus import ServiceBusClient, ServiceBusMessage
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
fully_qualified_namespace = f"{os.environ['SERVICEBUS_NAMESPACE']}.servicebus.windows.net"
client = ServiceBusClient(fully_qualified_namespace, credential)

# Send
sender = client.get_queue_sender("orders")
with sender:
    sender.send_messages(ServiceBusMessage('{"orderId": "123"}'))

# Receive
receiver = client.get_queue_receiver("orders")
with receiver:
    messages = receiver.receive_messages(max_message_count=10, max_wait_time=5)
    for message in messages:
        print(message)
        receiver.complete_message(message)
```

#### .NET

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```csharp
using Azure.Identity;
using Azure.Messaging.ServiceBus;

var credential = new DefaultAzureCredential();
var fullyQualifiedNamespace = $"{Environment.GetEnvironmentVariable("SERVICEBUS_NAMESPACE")}.servicebus.windows.net";
var client = new ServiceBusClient(fullyQualifiedNamespace, credential);

// Send
var sender = client.CreateSender("orders");
await sender.SendMessageAsync(new ServiceBusMessage("{\"orderId\": \"123\"}"));

// Receive
var receiver = client.CreateReceiver("orders");
var messages = await receiver.ReceiveMessagesAsync(maxMessages: 10);
foreach (var message in messages)
{
    await receiver.CompleteMessageAsync(message);
}
```

> 💡 **Required Permissions:**
>
> - `Azure Service Bus Data Sender` (69a216fc-b8fb-44d8-bc22-1f3c2cd27a39) - for sending
> - `Azure Service Bus Data Receiver` (4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0) - for receiving

Connection strings and SAS keys are not used for new work: the namespace sets `disableLocalAuth: true` and clients use
Microsoft Entra ID with the roles above.

## Dead Letter Handling

```javascript
const dlqReceiver = client.createReceiver("orders", {
  subQueueType: "deadLetter",
});
```
