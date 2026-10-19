> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Static Web Apps - Bicep Patterns

## Basic Resource

```bicep
resource staticWebApp 'Microsoft.Web/staticSites@2025-03-01' = {
  name: '${resourcePrefix}-${serviceName}-${uniqueHash}'
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    buildProperties: {
      appLocation: '/'
      apiLocation: 'api'
      outputLocation: 'dist'
    }
  }
}
```

## Custom Domain

```bicep
resource customDomain 'Microsoft.Web/staticSites/customDomains@2025-03-01' = {
  parent: staticWebApp
  name: 'www.example.com'
  properties: {}
}
```

## Application Settings

For the integrated API:

```bicep
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2025-03-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    DATABASE_URL: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=db-url)'
  }
}
```

## Deployment Token

> ⚠️ **Security Warning:** Do NOT expose deployment tokens in Bicep outputs.

See [deployment.md](deployment.md) for secure token handling.
