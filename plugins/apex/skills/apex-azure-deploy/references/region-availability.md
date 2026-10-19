> **APEX reference.** Read [execution boundaries](execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

<!-- ref:region-availability-v1 -->

# Azure Region Availability Reference

> **Historical upstream reference, dated 2026-03-03 — not current availability evidence or region defaults.**
> Keep the tables as research examples only. Use accepted fresh capacity evidence, current official documentation
> and [APEX defaults](../../apex-azure-defaults/SKILL.md) before any recommendation.
>
> Official reference: https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table

## How to Use

1. Check if your architecture includes any **limited availability** services below
2. Verify each service/SKU against current accepted evidence; tables and upstream MCP names are only research hints.
3. Use the accepted/default region, not a “common region” guess. A service/SKU or region change renews affected checks.

## MCP Tools Used

| Tool                  | Purpose                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `mcp_azure-mcp_quota` | Check Azure region availability and quota by setting `command` to `quota_usage_check` or `quota_region_availability_list` |

---

## Services with LIMITED Region Availability

### Azure Static Web Apps (SWA)

⚠️ **NOT available in many common regions**

| ✅ Available | ❌ NOT Available (will FAIL) |
| ------------ | ---------------------------- |
| `westus2`    | `eastus`                     |
| `centralus`  | `northeurope`                |
| `eastus2`    | `southeastasia`              |
| `westeurope` | `uksouth`                    |
| `eastasia`   | `canadacentral`              |
|              | `australiaeast`              |
|              | `westus3`                    |

---

### Azure Kubernetes Service (AKS)

It has limited quota in some regions, to get available regions with enough quota, use `mcp_azure-mcp_quota` tool.

---

### Azure Database for PostgreSQL

It has limited quota in some regions, to get available regions with enough quota, use `mcp_azure-mcp_quota` tool.

---

### Azure OpenAI

⚠️ **Very limited — varies by model**

| Region           | GPT-4o | GPT-4 | GPT-3.5 | Embeddings |
| ---------------- | :----: | :---: | :-----: | :--------: |
| `eastus`         |   ✅   |  ✅   |   ✅    |     ✅     |
| `eastus2`        |   ✅   |  ✅   |   ✅    |     ✅     |
| `westus`         |   ⚠️   |  ⚠️   |   ✅    |     ✅     |
| `westus3`        |   ✅   |  ⚠️   |   ✅    |     ✅     |
| `southcentralus` |   ✅   |  ✅   |   ✅    |     ✅     |
| `swedencentral`  |   ✅   |  ✅   |   ✅    |     ✅     |
| `westeurope`     |   ⚠️   |  ✅   |   ✅    |     ✅     |

> Check https://learn.microsoft.com/azure/ai-services/openai/concepts/models for current model availability.

---

## Services Available in Most Regions

The upstream list groups broadly available services. Every target still needs current service/SKU and capacity checks:

- **Container Apps**
- **Azure Functions**
- **App Service**
- **Azure SQL Database**
- **Cosmos DB**
- **Key Vault**
- **Storage Account**
- **Service Bus**
- **Event Grid**
- **Application Insights / Log Analytics**

---

## Common Architecture Patterns

| Pattern                                        | Historical upstream region examples (not recommendations)    |
| ---------------------------------------------- | ----------------------------------------------------------- |
| SWA only                                       | `westus2`, `centralus`, `eastus2`, `westeurope`, `eastasia` |
| SWA + backend services                         | `westus2`, `centralus`, `eastus2`, `westeurope`, `eastasia` |
| Container Apps (no SWA)                        | `eastus`, `eastus2`, `westus2`, `centralus`, `westeurope`   |
| With Azure OpenAI (GPT-4o/4/3.5 + embeddings)  | `eastus`, `eastus2`, `swedencentral`                        |
| SWA + Azure OpenAI (GPT-4o/4/3.5 + embeddings) | `eastus2` (only region with full SWA + model overlap)       |

---

**Last updated:** 2026-03-03

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/region-availability.md).
Load only the reference needed for the active task.
