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

For the managed integrated API, set only non-secret values. Managed Functions do not resolve
`@Microsoft.KeyVault(...)` references, so a Key Vault reference here would reach the code as a literal string
([supported API features](https://learn.microsoft.com/azure/static-web-apps/apis-functions)).

```bicep
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2025-03-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    API_BASE_PATH: '/api'
  }
}
```

When the API needs a secret, link a bring-your-own Azure Functions app as the backend and configure the
`@Microsoft.KeyVault(VaultName=<vault>;SecretName=<secret>)` reference on that Function App's application settings,
using its managed identity with a Key Vault secrets-read role.

## Deployment Token

> ⚠️ **Security Warning:** Do NOT expose deployment tokens in Bicep outputs.

See [deployment.md](deployment.md) for secure token handling.
