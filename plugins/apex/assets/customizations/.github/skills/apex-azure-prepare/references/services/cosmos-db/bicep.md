> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Cosmos DB Bicep Patterns

## Account

```bicep
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2026-03-15' = {
  name: '${resourcePrefix}-cosmos-${uniqueHash}'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    disableLocalAuth: true // Entra ID only: no account keys or connection strings
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}
```

## Data-Plane Role Assignment

Cosmos DB data access uses its own role system. Grant the application identity the accepted built-in role at the
narrowest scope (`...0001` is Data Reader, `...0002` is Data Contributor).

```bicep
resource cosmosSqlRoleAssignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2026-03-15' = {
  parent: cosmosAccount
  name: guid(cosmosAccount.id, appPrincipalId, '00000000-0000-0000-0000-000000000002')
  properties: {
    roleDefinitionId: '${cosmosAccount.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002'
    principalId: appPrincipalId
    scope: cosmosAccount.id
  }
}
```

## Database

```bicep
resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2026-03-15' = {
  parent: cosmosAccount
  name: 'appdb'
  properties: {
    resource: {
      id: 'appdb'
    }
  }
}
```

## Container

```bicep
resource cosmosContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2026-03-15' = {
  parent: cosmosDatabase
  name: 'items'
  properties: {
    resource: {
      id: 'items'
      partitionKey: {
        paths: ['/partitionKey']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          { path: '/*' }
        ]
      }
    }
  }
}
```

## Autoscale Container

```bicep
resource cosmosContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2026-03-15' = {
  parent: cosmosDatabase
  name: 'items'
  properties: {
    resource: {
      id: 'items'
      partitionKey: {
        paths: ['/partitionKey']
        kind: 'Hash'
      }
    }
    options: {
      autoscaleSettings: {
        maxThroughput: 4000
      }
    }
  }
}
```

## Global Distribution

```bicep
properties: {
  locations: [
    {
      locationName: 'East US'
      failoverPriority: 0
    }
    {
      locationName: 'West US'
      failoverPriority: 1
    }
  ]
  enableMultipleWriteLocations: true
}
```
