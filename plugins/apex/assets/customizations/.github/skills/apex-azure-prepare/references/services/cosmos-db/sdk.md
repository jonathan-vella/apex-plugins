> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Cosmos DB SDK Connection Patterns

The account disables local (key) authentication, so clients authenticate with Microsoft Entra ID. Do not use account
keys or `COSMOS_CONNECTION_STRING` for new work. Grant the identity the accepted Cosmos DB data-plane role (for example
the built-in Data Contributor) with a `sqlRoleAssignments` resource, as in [Bicep patterns](bicep.md).

## Node.js

```javascript
const { CosmosClient } = require("@azure/cosmos");
const { DefaultAzureCredential } = require("@azure/identity");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  aadCredentials: new DefaultAzureCredential(),
});
const database = client.database(process.env.COSMOS_DATABASE);
const container = database.container("items");

// Query example
const { resources } = await container.items
  .query("SELECT * FROM c WHERE c.userId = @userId", {
    parameters: [{ name: "@userId", value: userId }],
  })
  .fetchAll();
```

## Python

```python
import os
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential

client = CosmosClient(os.environ["COSMOS_ENDPOINT"], credential=DefaultAzureCredential())
database = client.get_database_client(os.environ["COSMOS_DATABASE"])
container = database.get_container_client("items")

# Query example
items = container.query_items(
    query="SELECT * FROM c WHERE c.userId = @userId",
    parameters=[{"name": "@userId", "value": user_id}]
)
```

## .NET

```csharp
using Azure.Identity;
using Microsoft.Azure.Cosmos;

var client = new CosmosClient(
    Environment.GetEnvironmentVariable("COSMOS_ENDPOINT"),
    new DefaultAzureCredential()
);
var database = client.GetDatabase(Environment.GetEnvironmentVariable("COSMOS_DATABASE"));
var container = database.GetContainer("items");

// Query example
var query = new QueryDefinition("SELECT * FROM c WHERE c.userId = @userId")
    .WithParameter("@userId", userId);
var iterator = container.GetItemQueryIterator<dynamic>(query);
```

## Best Practices

| Practice                  | Reason                    |
| ------------------------- | ------------------------- |
| Reuse client instances    | Connection pooling        |
| Use parameterized queries | SQL injection prevention  |
| Set appropriate timeouts  | Handle transient failures |
| Enable diagnostics in dev | Debug RU consumption      |
