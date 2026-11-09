> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# AKS MCP Reference

Use the verified basic Azure MCP AKS namespace for accepted-scope read-only evidence. It does not grant a separate
AKS-MCP provider, arbitrary Kubernetes commands or a stronger access mode.

## Preference Order

1. `apex-azure/aks` with a verified basic AKS read command.
2. Supporting `apex-azure/applens`, `apex-azure/monitor`, and `apex-azure/resourcehealth` reads.
3. Explicit unavailable/coverage-gap result when the managed surface cannot perform the check; no shell bypass.

## Happy Path

Discover a namespace using exactly `{intent: "", learn: true}`, omitting command and parameters. Then choose the
smallest command in the verified inventory with its actual schema. A nonempty learn intent can execute sampling.

Favor the obvious read paths first:

- cluster and Azure-side inspection
- detector or diagnostic workflows
- monitoring, metrics, or control-plane-log checks
- only Kubernetes observations actually exposed and permitted by the basic namespace inventory

## Authentication And Access

Use the already approved identity, tenant and subscription. Basic Azure MCP authentication does not establish that
a separate AKS provider is installed or authorized. Never suggest switching to `readwrite` or `admin`, acquiring
credentials or changing identity to make a managed diagnostic pass.

## Detector Notes

For detector-style workflows, use the cluster resource ID, keep the time window within the last 30 days, cap each run to
24 hours, and stay within the supported AKS detector categories.

## Fallback Rule

If the managed namespace does not expose the required read, report the missing capability. Separately produced
Azure/Kubernetes observations need their own authorization and evidence acceptance; they are not an automatic fallback.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/aks/references/aks-mcp.md).
Load only the reference needed for the active task.
