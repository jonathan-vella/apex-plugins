> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# SWA Region Availability

⚠️ **NOT available in many common regions** — Check before deployment.

| ✅ Available | ❌ NOT Available (will FAIL) |
| ------------ | ---------------------------- |
| `westus2`    | `eastus`                     |
| `centralus`  | `northeurope`                |
| `eastus2`    | `southeastasia`              |
| `westeurope` | `uksouth`                    |
| `eastasia`   | `canadacentral`              |
|              | `australiaeast`              |
|              | `westus3`                    |

## Recommended Regions

| Pattern            | Use                                                         |
| ------------------ | ----------------------------------------------------------- |
| SWA only           | `westus2`, `centralus`, `eastus2`, `westeurope`, `eastasia` |
| SWA + backend      | `westus2`, `centralus`, `eastus2`, `westeurope`, `eastasia` |
| SWA + Azure OpenAI | `eastus2` (only region with full overlap)                   |
