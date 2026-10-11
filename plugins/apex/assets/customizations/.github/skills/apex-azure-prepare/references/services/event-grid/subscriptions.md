> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Event Grid - Subscriptions

## Event Subscription

```bicep
resource eventGridSubscription 'Microsoft.EventGrid/topics/eventSubscriptions@2025-02-15' = {
  parent: eventGridTopic
  name: 'order-processor-subscription'
  properties: {
    destination: {
      endpointType: 'WebHook'
      properties: {
        endpointUrl: 'https://my-api.azurecontainerapps.io/webhooks/orders'
      }
    }
    filter: {
      includedEventTypes: [
        'Order.Created'
        'Order.Updated'
      ]
    }
    retryPolicy: {
      maxDeliveryAttempts: 30
      eventTimeToLiveInMinutes: 1440
    }
  }
}
```

## Destination Types

### Webhook

```bicep
destination: {
  endpointType: 'WebHook'
  properties: {
    endpointUrl: 'https://my-api.example.com/events'
  }
}
```

### Azure Function

```bicep
destination: {
  endpointType: 'AzureFunction'
  properties: {
    resourceId: functionApp.id
  }
}
```

### Service Bus Queue

```bicep
destination: {
  endpointType: 'ServiceBusQueue'
  properties: {
    resourceId: '${serviceBus.id}/queues/events'
  }
}
```

### Event Hub

```bicep
destination: {
  endpointType: 'EventHub'
  properties: {
    resourceId: eventHub.id
  }
}
```

## Filtering

### Event Type Filter

```bicep
filter: {
  includedEventTypes: [
    'Order.Created'
    'Order.Shipped'
  ]
}
```

### Subject Filter

```bicep
filter: {
  subjectBeginsWith: '/orders/priority'
  subjectEndsWith: '.json'
}
```

### Advanced Filter

```bicep
filter: {
  advancedFilters: [
    {
      operatorType: 'NumberGreaterThan'
      key: 'data.amount'
      value: 100
    }
  ]
}
```
