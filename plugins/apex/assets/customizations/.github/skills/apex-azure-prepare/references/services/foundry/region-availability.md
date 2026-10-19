> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Foundry Region Availability

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

## Recommended Regions

| Need                    | Recommended Region                   |
| ----------------------- | ------------------------------------ |
| Full model availability | `eastus`, `eastus2`, `swedencentral` |
| Europe compliance       | `swedencentral`, `westeurope`        |
| With SWA                | `eastus2` (only overlap)             |
