> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Logic Apps - Bicep Patterns

## Consumption (Multi-tenant)

```bicep
resource logicApp 'Microsoft.Logic/workflows@2019-05-01' = {
  name: '${resourcePrefix}-logic-${uniqueHash}'
  location: location
  properties: {
    state: 'Enabled'
    definition: {
      '$schema': 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#'
      contentVersion: '1.0.0.0'
      triggers: {
        manual: {
          type: 'Request'
          kind: 'Http'
          inputs: {
            schema: {}
          }
        }
      }
      actions: {}
    }
    parameters: {}
  }
}
```

## Standard (Single-tenant)

```bicep
resource logicAppPlan 'Microsoft.Web/serverfarms@2025-03-01' = {
  name: '${resourcePrefix}-logicplan-${uniqueHash}'
  location: location
  sku: {
    name: 'WS1'
    tier: 'WorkflowStandard'
  }
  properties: {
    reserved: true
  }
}

resource logicAppStandard 'Microsoft.Web/sites@2025-03-01' = {
  name: '${resourcePrefix}-logic-${uniqueHash}'
  location: location
  kind: 'functionapp,workflowapp'
  properties: {
    serverFarmId: logicAppPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageConnectionString
        }
      ]
    }
  }
}
```

## API Connection

Shape follows Microsoft Learn's "Authenticate access with a managed identity in Azure Logic Apps" for a Standard
workflow and a connector with several authentication types (`kind: 'V2'`, `managedIdentityAuth`). No connection string
or key is read or embedded in the deployment.

```bicep
resource serviceBusConnection 'Microsoft.Web/connections@2016-06-01' = {
  name: 'servicebus-connection'
  location: location
  kind: 'V2'
  properties: {
    displayName: 'Service Bus Connection'
    api: {
      id: subscriptionResourceId('Microsoft.Web/locations/managedApis', location, 'servicebus')
    }
    parameterValueSet: {
      name: 'managedIdentityAuth'
      values: {}
    }
  }
}

// Learn requires an access policy for the identity that uses the connection.
resource serviceBusConnectionAccess 'Microsoft.Web/connections/accessPolicies@2016-06-01' = {
  parent: serviceBusConnection
  name: logicAppIdentityPrincipalId
  location: location
  properties: {
    principal: {
      type: 'ActiveDirectory'
      identity: {
        objectId: logicAppIdentityPrincipalId
        tenantId: tenant().tenantId
      }
    }
  }
}
```

- Grant the identity the accepted least-privilege Service Bus data role (for example Azure Service Bus Data Receiver
  or Sender) at the narrowest scope.
- The connector's managed-identity parameter set can require connector-specific values, for example the Service Bus
  namespace endpoint. Take the exact parameter names from accepted evidence (the `managedApis/servicebus`
  `connectionParameterSets` read) instead of copying them from this sample.
- The built-in Service Bus connector with managed identity is configured in `connections.json` on the Standard app and
  needs no `Microsoft.Web/connections` resource. Prefer it when the workflow only needs built-in operations.
- Never accept `listKeys()`, a connection string or a SAS key as the connection credential for new work.
