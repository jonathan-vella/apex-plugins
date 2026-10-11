> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Cosmos DB Partition Key Selection

## Good Partition Keys

A good partition key should have:

- **High cardinality** - Many distinct values
- **Even data distribution** - No hot partitions
- **Even request distribution** - Balanced workload
- **Used in most queries** - Enables efficient routing

## Examples by Scenario

| Scenario          | Partition Key | Reason                              |
| ----------------- | ------------- | ----------------------------------- |
| User-centric data | `/userId`     | Queries typically filter by user    |
| Multi-tenant apps | `/tenantId`   | Isolates tenant data                |
| E-commerce orders | `/customerId` | Orders queried by customer          |
| IoT telemetry     | `/deviceId`   | High cardinality, even distribution |

## Hierarchical Partition Keys

For complex scenarios, use hierarchical keys:

```bicep
partitionKey: {
  paths: ['/tenantId', '/userId']
  kind: 'MultiHash'
}
```

## Anti-Patterns

Avoid these partition key choices:

| Bad Choice            | Problem                 |
| --------------------- | ----------------------- |
| Timestamp             | Creates hot partitions  |
| Boolean values        | Only 2 partitions       |
| Low cardinality enums | Uneven distribution     |
| Random GUID           | Can't query efficiently |
