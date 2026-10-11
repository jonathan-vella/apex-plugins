> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Container Apps Scaling Patterns

## HTTP-based Scaling

Best for APIs and web applications:

```bicep
scale: {
  minReplicas: 1
  maxReplicas: 10
  rules: [
    {
      name: 'http-scaling'
      http: {
        metadata: {
          concurrentRequests: '100'
        }
      }
    }
  ]
}
```

## Queue-based Scaling

Best for background workers:

```bicep
scale: {
  minReplicas: 0
  maxReplicas: 30
  rules: [
    {
      name: 'queue-scaling'
      azureQueue: {
        queueName: 'orders'
        queueLength: 10
        auth: [
          {
            secretRef: 'storage-connection'
            triggerParameter: 'connection'
          }
        ]
      }
    }
  ]
}
```

## Service Bus Scaling

```bicep
scale: {
  minReplicas: 0
  maxReplicas: 20
  rules: [
    {
      name: 'servicebus-scaling'
      custom: {
        type: 'azure-servicebus'
        metadata: {
          queueName: 'myqueue'
          messageCount: '5'
        }
        auth: [
          {
            secretRef: 'servicebus-connection'
            triggerParameter: 'connection'
          }
        ]
      }
    }
  ]
}
```

## Recommendations

| Workload          | Min Replicas | Max Replicas | Rule Type   |
| ----------------- | ------------ | ------------ | ----------- |
| Production API    | 1            | 10-20        | HTTP        |
| Dev/Test API      | 0            | 5            | HTTP        |
| Background Worker | 0            | 30+          | Queue/Event |
| Scheduled Job     | 0            | 1            | KEDA cron   |
