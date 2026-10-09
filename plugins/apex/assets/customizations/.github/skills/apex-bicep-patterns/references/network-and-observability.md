# Network And Observability

Read this reference when a Bicep binding includes hub-spoke networking, private connectivity, or resource diagnostics.

## Hub-Spoke Composition

Use hub-spoke topology only when shared connectivity, inspection, DNS, or platform services are accepted architectural
requirements. Bind peering, routing, subnet, and network-security intent explicitly; do not imply those choices from a
resource name or a module default.

The hub owns accepted shared services. Spokes peer to the hub and do not peer directly unless the architecture records
a specific exception. Pass the hub resource ID through module outputs rather than reconstructing it. Apply network
security at the subnet boundary, and verify address spaces and service CIDRs do not overlap before generation.

## Private Endpoint And DNS

Private endpoint intent includes the target subresource, approved subnet, private DNS zone, and DNS zone group. A
private endpoint without its DNS and network dependencies is incomplete. Public access exceptions require an accepted
risk and policy-compatible boundary.

When shared private DNS is not provided by the platform, the owning binding must create the zone, link it to the
accepted VNet, and pass the created zone resource ID to the endpoint. Do not construct an ID for a zone that no binding
creates or accepts as existing evidence.

Common service subresources and zones include:

| Service | Subresource | Private DNS zone |
| --- | --- | --- |
| Blob storage | `blob` | `privatelink.blob.core.windows.net` |
| Table storage | `table` | `privatelink.table.core.windows.net` |
| Key Vault | `vault` | `privatelink.vaultcore.azure.net` |
| Azure SQL | `sqlServer` | `privatelink.database.windows.net` |
| Cosmos DB for NoSQL | `Sql` | `privatelink.documents.azure.com` |
| App Service | `sites` | `privatelink.azurewebsites.net` |
| Event Hubs | `namespace` | `privatelink.servicebus.windows.net` |
| Container Registry | `registry` | `privatelink.azurecr.io` |

Treat this table as a pattern aid, not live service-availability evidence. Confirm the exact target resource contract
when accepting a binding.

## Diagnostics And Dependencies

Every governed resource should have diagnostics and metrics mapped to the accepted monitoring destination. Category
selection, retention, cost, and ownership remain typed planning decisions; generated settings and deployment success
require validator and operation receipts.

Prefer supported category groups when they satisfy the accepted requirement; otherwise bind explicit categories from
current provider evidence. Include metrics only when the resource supports them.

An `existing` resource reference does not create an implicit dependency on a module that creates that resource in the
same deployment. Extension resources such as diagnostics and private DNS zone groups need explicit ordering when their
parent is created by another module.
