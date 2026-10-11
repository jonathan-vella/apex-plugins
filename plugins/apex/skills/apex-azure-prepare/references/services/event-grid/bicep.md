> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Event Grid - Bicep Patterns

## Custom Topic

```bicep
resource eventGridTopic 'Microsoft.EventGrid/topics@2025-02-15' = {
  name: '${resourcePrefix}-egt-${uniqueHash}'
  location: location
  properties: {
    inputSchema: 'EventGridSchema'
    publicNetworkAccess: 'Disabled'
  }
}
```

Use accepted private endpoint/DNS ownership and service support; do not enable production public networking to
make the example work.

## System Topic (Azure Resource Events)

```bicep
resource storageSystemTopic 'Microsoft.EventGrid/systemTopics@2025-02-15' = {
  name: '${resourcePrefix}-storage-topic'
  location: location
  properties: {
    source: storageAccount.id
    topicType: 'Microsoft.Storage.StorageAccounts'
  }
}
```

## Event Domain

```bicep
resource eventDomain 'Microsoft.EventGrid/domains@2025-02-15' = {
  name: '${resourcePrefix}-domain'
  location: location
  properties: {
    inputSchema: 'EventGridSchema'
  }
}
```

## Publishing Events

### Node.js

Authenticate with managed identity and the accepted Event Grid data-plane role (for example
`EventGrid Data Sender`); do not use topic access keys for new work.

```javascript
const { EventGridPublisherClient } = require("@azure/eventgrid");
const { DefaultAzureCredential } = require("@azure/identity");

const client = new EventGridPublisherClient(
  process.env.EVENTGRID_TOPIC_ENDPOINT,
  "EventGrid",
  new DefaultAzureCredential(),
);

await client.send([
  {
    eventType: "Order.Created",
    subject: "/orders/12345",
    dataVersion: "1.0",
    data: { orderId: "12345" },
  },
]);
```

### Python

```python
import os

from azure.eventgrid import EventGridPublisherClient, EventGridEvent
from azure.identity import DefaultAzureCredential

client = EventGridPublisherClient(
    os.environ["EVENTGRID_TOPIC_ENDPOINT"],
    DefaultAzureCredential()
)

client.send([EventGridEvent(
    event_type="Order.Created",
    subject="/orders/12345",
    data={"orderId": "12345"},
    data_version="1.0"
)])
```
