<!-- ref:private-endpoint-pattern-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Private Endpoint Pattern

Standard three-resource pattern using AVM-TF private endpoint module.

Apply the [canonical networking contract](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/instructions/references/iac-security-baseline.md#private-networking-and-dns)
before selecting this project-owned DNS pattern. Reuse verified central zones and avoid provisioning
components owned by effective DINE policy. DNS resolution and private-client reachability remain required.

## Private Endpoint + DNS Zone + VNet Link

```hcl
# Private endpoint for a PaaS service
module "storage_private_endpoint" {
  source  = "Azure/avm-res-network-privateendpoint/azurerm"
  version = "0.2.0" # example; resolve the current exact version at plan time

  name                   = "pe-${local.st_name}-${local.suffix}"
  network_interface_name = "nic-pe-${local.st_name}-${local.suffix}"
  resource_group_name    = azurerm_resource_group.this.name
  location               = var.location

  private_connection_resource_id = module.storage.resource_id
  subnet_resource_id             = module.spoke_vnet.subnets["PrivateEndpoints"].resource_id

  private_dns_zone_group_name = "default"
  private_dns_zone_resource_ids = [
    azurerm_private_dns_zone.blob.id
  ]

  subresource_names = ["blob"]
  tags              = local.tags
}

# Private DNS Zone (one per service type)
resource "azurerm_private_dns_zone" "blob" {
  name                = "privatelink.blob.core.windows.net"
  resource_group_name = azurerm_resource_group.networking.name
  tags                = local.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "blob" {
  name                  = "pdnslink-blob-${local.suffix}"
  resource_group_name   = azurerm_resource_group.networking.name
  private_dns_zone_name = azurerm_private_dns_zone.blob.name
  virtual_network_id    = module.spoke_vnet.resource_id
  registration_enabled  = false
  tags                  = local.tags
}
```

## Subresource Names per Service

| Service        | Subresource | Private DNS Zone                     |
| -------------- | ----------- | ------------------------------------ |
| Storage (Blob) | `blob`      | `privatelink.blob.core.windows.net`  |
| Storage (File) | `file`      | `privatelink.file.core.windows.net`  |
| Key Vault      | `vault`     | `privatelink.vaultcore.azure.net`    |
| SQL Server     | `sqlServer` | `privatelink.database.windows.net`   |
| Container Reg. | `registry`  | `privatelink.azurecr.io`             |
| App Service    | `sites`     | `privatelink.azurewebsites.net`      |
| Service Bus    | `namespace` | `privatelink.servicebus.windows.net` |
| Cosmos DB      | `Sql`       | `privatelink.documents.azure.com`    |
