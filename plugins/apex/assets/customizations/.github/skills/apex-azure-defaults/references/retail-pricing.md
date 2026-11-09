# Retail Pricing Evidence

## Navigation

- Query Contract
- Empty Results
- Service Names And Billing Regions
- Meter Selection
- Priced-Line Provenance
- Monthly Calculations
- Actual Costs Are Separate

Use the verified `apex-azure/pricing` namespace with command `pricing_get` for planned-resource prices. Azure MCP Server
`3.0.0` returns a `prices` collection; the caller selects meters and calculates totals. Pricing is public and read-only.
Never substitute remembered or embedded rates for a returned record. Namespace discovery and authorization follow
[Azure MCP tools](azure-mcp-tools.md).

## Query Contract

Pass only the filters needed to identify the intended meter.

| Filter | Source | Rule |
| --- | --- | --- |
| `service` | Retail catalog service name | Required. Use a name the catalog returns; never guess. |
| `region` | Deployment region slug | Keep the deployment region unless evidence shows global billing. |
| `sku` | Verified ARM catalog SKU | Optional. Many services leave it empty; do not copy a deployment tier into it by default. |
| `filter` | Additional raw OData expression | Optional meter/product disambiguation using returned catalog fields. |
| `price-type` | Requirement | `Consumption`, `Reservation`, or `DevTestConsumption`; never `SavingsPlan`. |
| `currency` | Requirement | Keep one currency per estimate; never mix currencies. |
| `include-savings-plan` | Commitment comparison | Boolean; request nested savings-plan rates with Consumption prices. |
| `service-family` | Verified service family | Optional refinement, not a substitute for a bounded service/SKU query. |

Call shape (replace placeholders with accepted workload values):

```text
apex-azure/pricing
{
  intent: "price chosen SKU",
  command: "pricing_get",
  parameters: {
    service: "<catalog service>",
    sku: "<verified SKU>",
    region: "<billing region>",
    currency: "<estimate currency>",
    "price-type": "Consumption",
    "include-savings-plan": true
  }
}
```

Pass only these pricing parameters; do not forward retired camelCase filters or authentication/retry options.

Group identical parameter sets and query once per group, then reuse the rows across quantities and candidate tiers.
The command follows API pages internally but silently stops at 5,000 rows. It returns no continuation link or
completeness flag. Treat **5,000 or more returned rows as potentially incomplete**: narrow and repeat the query, or
record the affected resource in `unpricedItems`. Never accept a capped response as a priced line, invent a next page,
or turn a failed/incomplete lookup into a successful zero-price fallback. For tier- or operation-billed services such as
Container Registry and Key Vault, start with service, region, price type, and currency, then select the exact
SKU, product, meter, and unit locally.

## Empty Results

An empty narrow result is not proof that a service or regional SKU is unavailable. Retry once with the unverified SKU
or meter filters removed, keeping the deployment region, and inspect the returned names. If no matching row appears,
leave the line unresolved with the attempted parameters and timestamp. Never submit a zero or placeholder price.

## Service Names And Billing Regions

| Azure service | `service` |
| --- | --- |
| App Service | `Azure App Service` |
| Container Apps | `Azure Container Apps` |
| Azure Functions | `Functions` |
| Virtual Machines | `Virtual Machines` |
| Storage | `Storage` |
| SQL Database | `SQL Database` |
| Cosmos DB | `Azure Cosmos DB` |
| PostgreSQL or MySQL flexible server | `Azure Database for PostgreSQL`, `Azure Database for MySQL` |
| Key Vault | `Key Vault` |
| Container Registry | `Container Registry` |
| Log Analytics | `Log Analytics` |
| Front Door | `Azure Front Door` |
| Private Endpoint | `Virtual Network` |
| Azure DNS, including private zones | `Azure DNS` |

Some services bill from a global or empty region. Query Azure DNS, Front Door, Traffic Manager, Microsoft Entra ID and
Microsoft Defender for Cloud without `region` first. Private endpoints bill in the `Global` region under
`Virtual Network`, with separate inbound and outbound data-processing meters. These billing regions never change the
deployment region. A regional comparison uses identical queries that differ only in `region`.

## Meter Selection

A row is usable only when service, region, product, meter, price type, currency, operating-system variant, and any
applicable SKU field match the resource and billing dimension. An empty returned ARM SKU does not disqualify a row and is
never a wildcard. Fail the line when several plausible rows remain and no explicit usage or meter name decides.

- Exclude `DevTestConsumption` and Spot meters unless the requirement asks for them.
- Sum component meters when a service bills compute, storage, requests, transactions, and transfer separately.
- Record product, meter, unit, price type, currency, and any returned tier bands in the line notes. Do not assume the
  MCP mapping contains every raw Retail Prices API field; unresolved tier details require explicit uncertainty.

## Priced-Line Provenance

Use source provider `Azure MCP Server` and pricing provider `azure-mcp-server`, preserving actual `source.uri`,
`priceId` and `retrievedAt` lineage. For Azure MCP-priced lines, populate `source.azureMcp` with
`toolVersion: "OBSERVED_STABLE_3_X_VERSION"` replaced by the exact observed stable version, integer `returnedRowCount`
(1–5000), and `paginationStatus: "complete"` or `"partial"`. A priced line requires count below 5000 and complete
status, plus an exact matching meter from a successfully completed query. Partial/capped queries remain explicit
unpriced evidence, not accepted priced lines. This metadata is declared evidence, not cryptographic attestation.
Never invent a query hash or missing meter, price or completeness data. ARM retail provider labels are rejected;
separately authorized direct Retail Prices API evidence keeps its actual provider, never an Azure MCP label.

## Monthly Calculations

| Unit | Monthly calculation |
| --- | --- |
| `1 Hour` | `price * 730 * quantity` |
| `1/Day` | `price * billable days * quantity`, stating the period |
| `1/Month` | `price * quantity` |
| `1 GB/Month` | `price * GB stored * quantity` |
| `1 GB` | `price * GB transferred * quantity` |
| `10K` operations | `price * (operations / 10000) * quantity` |
| `1M` operations | `price * (operations / 1000000) * quantity` |

Variable meters need explicit usage from requirements or telemetry; absent usage is unresolved, not zero. Apply tiered
rates band by band in `tierMinimumUnits` order. A zero line is valid only for a returned zero-price meter or a service
that has no charge.

## Actual Costs Are Not Available Here

The guarded Azure MCP integration provides retail prices for proposed resources, not actual bills or forecasts for
deployed scopes. Historical spend, AKS cost allocation, budget and alert records, and commitment utilization are
unsupported. Never use retail rates or optimization estimates as substitutes for those records.
