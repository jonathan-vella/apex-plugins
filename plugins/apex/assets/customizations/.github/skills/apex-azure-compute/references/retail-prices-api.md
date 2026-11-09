# Azure Retail Prices API

Managed APEX pricing uses the guarded Azure MCP Server `pricing_get` command, not direct Retail Prices API calls.
The public API may be useful for independent customer research, but it is not an agent fallback, APEX evidence source,
or a way around the managed command and its completeness checks.

Follow the [central retail pricing contract](../../apex-azure-defaults/references/retail-pricing.md) for supported
parameters, meter matching, provenance, and unresolved results. If `pricing_get` is unavailable or the response is
ambiguous or capped, leave the affected line unpriced and report the limitation.

For independent research outside a managed APEX assessment, see the
[Azure Retail Prices API documentation](https://learn.microsoft.com/rest/api/cost-management/retail-prices/azure-retail-prices).
