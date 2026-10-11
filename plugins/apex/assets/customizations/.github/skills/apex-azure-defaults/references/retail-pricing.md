# Retail Pricing Evidence

Use `apex-azure-pricing/get_retail_prices` for planned-resource prices. It returns raw Azure Retail Prices records; the
caller selects meters and calculates totals. The tool is read-only and public. Never call the server's write or
operation tools, and never substitute remembered or embedded rates for a returned record.

## Query Contract

Pass only the filters needed to identify the intended meter.

| Filter | Source | Rule |
| --- | --- | --- |
| `serviceName` | Retail catalog service name | Required. Use a name the catalog returns; never guess. |
| `armRegionName` | Deployment region slug | Keep the deployment region unless evidence shows global billing. |
| `armSkuName` | Verified catalog SKU | Optional. Many services leave it empty; do not copy a deployment tier into it by default. |
| `meterName` | Billing dimension | Optional disambiguation when one product carries unrelated meters. |
| `priceType` | Requirement | Usually `Consumption`. Use `Reservation` only for commitment comparisons. |
| `currencyCode` | Requirement | Keep one currency per estimate; never mix currencies. |

Group identical parameter sets and query once per group, then reuse the rows across quantities and candidate tiers.
Follow the next-page link when a complete result set is required. For tier- or operation-billed services such as
Container Registry and Key Vault, start with service, region, price type, and currency, then select the exact
`skuName`, `productName`, `meterName`, and unit locally.

## Empty Results

An empty narrow result is not proof that a service or regional SKU is unavailable. Retry once with the unverified SKU
or meter filters removed, keeping the deployment region, and inspect the returned names. If no matching row appears,
leave the line unresolved with the attempted parameters and timestamp. Never submit a zero or placeholder price.

## Service Names And Billing Regions

| Azure service | `serviceName` |
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
Microsoft Defender for Cloud without `armRegionName` first. Private endpoints bill in the `Global` region under
`Virtual Network`, with separate inbound and outbound data-processing meters. These billing regions never change the
deployment region. A regional comparison uses identical queries that differ only in `armRegionName`.

## Meter Selection

A row is usable only when service, region, product, meter, price type, currency, operating-system variant, and any
applicable SKU field match the resource and billing dimension. An empty `armSkuName` does not disqualify a row and is
never a wildcard. Fail the line when several plausible rows remain and no explicit usage or meter name decides.

- Exclude `DevTestConsumption` and Spot meters unless the requirement asks for them.
- Sum component meters when a service bills compute, storage, requests, transactions, and transfer separately.
- Record `productName`, `meterName`, `unitOfMeasure`, `priceType`, currency, and tier bands in the line notes.

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

## Actual Costs Are Separate

`apex-azure-pricing/query_costs`, `query_aks_costs`, and `forecast_costs` report actual or forecast spend for deployed,
authorized scopes. They never replace retail prices for proposed resources.
