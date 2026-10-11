> MCP names in this reference are upstream pseudo-interfaces, not current vNext tool registrations.
> Use only capabilities projected by the active task; unavailable tools are blockers, never substitutes.

<!-- ref:region-availability-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Region Availability Index

> **DISCOVERY INDEX** — Consult service-specific files BEFORE recommending any region. This static page is not
> evidence: recommendations still need accepted current service/model/SKU availability and quota evidence for the target.
>
> Official reference: https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table

## How to Use

1. Check if your architecture includes any **limited availability** services below
2. If yes → consult the service-specific file or use the MCP tool to list supported regions with sufficient quota for
   that service, and only offer regions that support ALL services
3. If all services are "available everywhere" → offer common regions

## MCP Tools Used

| Tool                  | Purpose                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `mcp_azure-mcp_quota` | Check Azure region availability and quota by setting `command` to `quota_usage_check` or `quota_region_availability_list` |

---

## Services with LIMITED Region Availability

| Service                        | Availability            | Details                                                                     |
| ------------------------------ | ----------------------- | --------------------------------------------------------------------------- |
| Static Web Apps                | Limited (5 regions)     | [Region Details](services/static-web-apps/region-availability.md)           |
| Azure AI Foundry               | Very limited (by model) | [Region Details](services/foundry/region-availability.md)                   |
| Azure Kubernetes Service (AKS) | Limited in some regions | To get available regions with enough quota, use `mcp_azure-mcp_quota` tool. |
| Azure Database for PostgreSQL  | Limited in some regions | To get available regions with enough quota, use `mcp_azure-mcp_quota` tool. |

---

## Services Available in Most Regions

These services are available in all major Azure regions — no special consideration needed:

- Container Apps
- Azure Functions
- App Service
- Azure SQL Database
- Cosmos DB
- Key Vault
- Storage Account
- Service Bus
- Event Grid
- Application Insights / Log Analytics
