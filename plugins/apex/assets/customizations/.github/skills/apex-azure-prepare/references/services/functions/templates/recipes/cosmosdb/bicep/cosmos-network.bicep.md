> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# cosmos-network syntax reference

```bicep
// recipes/cosmosdb/bicep/cosmos-network.bicep
// Cosmos DB networking recipe — private endpoint + DNS zone
// Only deployed when VNET_ENABLED=true
//
// USAGE: Add this as a conditional module in main.bicep:
//   module cosmosNetwork './app/cosmos-network.bicep' = if (vnetEnabled) {
//     name: 'cosmosNetwork'
//     scope: rg
//     params: {
//       cosmosAccountId: cosmos.outputs.cosmosAccountId
//       cosmosAccountName: cosmos.outputs.cosmosAccountName
//       vnetId: vnet.outputs.vnetId
//       subnetId: vnet.outputs.subnetId
//       location: location
//       tags: tags
//     }
//   }

targetScope = 'resourceGroup'

@description('Cosmos DB account resource ID')
param cosmosAccountId string

@description('Cosmos DB account name')
param cosmosAccountName string

@description('VNet resource ID')
param vnetId string

@description('Subnet resource ID for private endpoint')
param subnetId string

@description('Azure region')
param location string = resourceGroup().location

@description('Resource tags')
param tags object = {}

// ============================================================================
// Private DNS Zone
// ============================================================================
resource privateDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  name: 'privatelink.documents.azure.com'
  location: 'global'
  tags: tags
}

resource privateDnsZoneVnetLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2024-06-01' = {
  parent: privateDnsZone
  name: '${cosmosAccountName}-dns-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}

// ============================================================================
// Private Endpoint
// ============================================================================
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2025-09-01' = {
  name: 'pe-${cosmosAccountName}'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: subnetId
    }
    privateLinkServiceConnections: [
      {
        name: 'cosmos-connection'
        properties: {
          privateLinkServiceId: cosmosAccountId
          groupIds: ['Sql']
        }
      }
    ]
  }
}

resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2025-09-01' = {
  parent: privateEndpoint
  name: 'cosmos-dns-group'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'cosmos-dns-config'
        properties: {
          privateDnsZoneId: privateDnsZone.id
        }
      }
    ]
  }
}
```
