> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Container Apps Bicep Patterns

> **⚠️ Container Registry Naming:** If using Azure Container Registry, names must be alphanumeric only (5-50
> characters). Use `replace()` to remove hyphens: `replace('cr${environmentName}${resourceSuffix}', '-', '')`

## Basic Resource

```bicep
resource containerApp 'Microsoft.App/containerApps@2026-01-01' = {
  name: '${resourcePrefix}-${serviceName}-${uniqueHash}'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${pullIdentity.id}': {}
    }
  }
  properties: {
    environmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'auto'
      }
      // Registry access uses the identity and an AcrPull assignment; no admin account or password secret.
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: pullIdentity.id
        }
      ]
    }
    template: {
      containers: [
        {
          name: serviceName
          // Use the accepted immutable digest (or exact release tag), never a mutable tag such as latest.
          image: '${containerRegistry.properties.loginServer}/${serviceName}@${imageDigest}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
    }
  }
  dependsOn: [
    acrPullAssignment
  ]
}

resource pullIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${resourcePrefix}-pull-id'
  location: location
}

// AcrPull role definition ID: 7f951dda-4ed3-4680-a7ca-43fe172d538d
resource acrPullAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(containerRegistry.id, pullIdentity.id, '7f951dda-4ed3-4680-a7ca-43fe172d538d')
  scope: containerRegistry
  properties: {
    principalId: pullIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '7f951dda-4ed3-4680-a7ca-43fe172d538d'
    )
  }
}
```

## With Managed Identity (Recommended)

```bicep
resource containerApp 'Microsoft.App/containerApps@2026-01-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    // ... configuration
  }
}
```

## Container Apps Environment

```bicep
// Logs go to Azure Monitor through a diagnostic setting; no workspace shared key is read or embedded.
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2026-01-01' = {
  name: '${resourcePrefix}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'azure-monitor'
    }
  }
}

resource environmentDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-log-analytics'
  scope: containerAppsEnvironment
  properties: {
    workspaceId: logAnalyticsWorkspace.id
    logs: [
      {
        categoryGroup: 'allLogs'
        enabled: true
      }
    ]
  }
}
```
