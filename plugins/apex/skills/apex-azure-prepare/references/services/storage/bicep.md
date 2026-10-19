> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Storage - Bicep Patterns

## Storage Account

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2026-04-01' = {
  name: '${resourcePrefix}stor${uniqueHash}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    defaultToOAuthAuthentication: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}
```

## Blob Container

```bicep
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2026-04-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    deleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2026-04-01' = {
  parent: blobService
  name: 'uploads'
  properties: {
    publicAccess: 'None'
  }
}
```

## Queue

```bicep
resource queueService 'Microsoft.Storage/storageAccounts/queueServices@2026-04-01' = {
  parent: storageAccount
  name: 'default'
}

resource queue 'Microsoft.Storage/storageAccounts/queueServices/queues@2026-04-01' = {
  parent: queueService
  name: 'orders'
}
```

## Table

```bicep
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2026-04-01' = {
  parent: storageAccount
  name: 'default'
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2026-04-01' = {
  parent: tableService
  name: 'logs'
}
```

## File Share

```bicep
resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2026-04-01' = {
  parent: storageAccount
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2026-04-01' = {
  parent: fileService
  name: 'shared'
  properties: {
    shareQuota: 100  // GB
  }
}
```
