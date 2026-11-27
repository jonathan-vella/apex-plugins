# Cost Tool Guardrails

Cost analysis uses only the reviewed, read-only `apex-azure` MCP integration. The commands below are already part of
the guarded Azure MCP contract; pass only parameters accepted by their schemas. A successful read is an observation,
not kernel evidence or permission to change Azure.

## Supported

| Question | Namespace and command | Evidence limit |
| --- | --- | --- |
| What does a proposed service/SKU cost at retail rates? | `apex-azure/pricing`, `pricing_get` | Retail catalog price, not negotiated price or actual charges |
| What Advisor recommendations exist? | `apex-azure/advisor`, `advisor_recommendation_list`; `advisor_recommendation_summary` for aggregation | Returned recommendation records, not a complete bill |
| What optimization recommendations exist? | `apex-azure/optimization`, `optimization_recommendation_list` | Returned recommendations and estimates only |
| What resize alternatives exist for a VM or VM scale set? | `apex-azure/optimization`, `optimization_recommendation_alternatives` | Only the returned resource and alternatives |
| Why was a VM/VM scale set resize recommended? | `apex-azure/optimization`, `optimization_recommendation_explain` | Explanation for the selected recommendation; a target SKU is optional and must be user-specified |
| What Advisor recommendations are available or summarized? | `apex-azure/advisor` | Returned records or aggregate summary only |

Follow the central [retail pricing contract](../../apex-azure-defaults/references/retail-pricing.md) for meter matching,
currency, completeness, and calculations. Use the Azure MCP command schema as the source of truth for parameters and
supported scopes; do not infer parameters from examples or older tool contracts.

## Unsupported Billing Data

The integration does not provide:

- Historical actual spend or AKS cost allocation.
- Forecasts.
- Budgets, budget utilization, or alerts.
- Reservation or savings-plan utilization, transactions, or recommendations.
- Customer price sheets or negotiated rates.

For these requests, state the specific data is unavailable. Do not fall back to Azure CLI, REST, Resource Graph CLI,
azqr, another MCP server, browser lookups, or remembered values. For mixed requests, return supported recommendations
or prices and identify only the unsupported portion.

## Evidence

- Preserve the returned scope, resource identity, timestamp/freshness, currency, and completeness when available.
- Distinguish Advisor recommendation estimates from retail prices, actual charges, and realized savings.
- Do not convert missing, empty, or partial records into zero or a negative finding.
- If a required field is absent or a response is ambiguous, report that dependent conclusion as indeterminate.
- Route proposed resource changes through the kernel-authorized workflow; never execute them during assessment.
