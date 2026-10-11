> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# General AKS Investigation & Diagnostics

## "What happened in my cluster?"

When a user asks a broad question like "what happened in my AKS cluster?" or "check my AKS status", follow this
systematic flow:

1. Cluster health
2. Recent events
3. Node status
4. Unhealthy pods
5. All pods overview
6. System pods health
7. Activity log

Run the individual read commands above within the accepted task scope. The
[`aks-baseline`](../script-examples/aks-baseline.sh.md) source example shows how upstream prints a single labeled digest
(provisioning state, node pool summary, recent activity log, node readiness, unhealthy pods, kube-system health and
recent warning events); it is non-executable and not installed.

After reviewing the digest, deep-dive into a specific pod with `kubectl describe` / `kubectl logs`.

---

## AKS CLI Tools

```bash
# Get cluster credentials (required before kubectl commands)
az aks get-credentials -g <rg> -n <cluster>

# View node pools
az aks nodepool list -g <rg> --cluster-name <cluster> -o table
```

### AppLens (MCP) for AKS

For AI-powered diagnostics:

```text
mcp_azure-mcp_applens
  intent: "diagnose AKS cluster issues"
  command: "diagnose"
  parameters:
    resourceId: "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ContainerService/managedClusters/<cluster>"
```

> 💡 **Tip:** AppLens automatically detects common issues and provides remediation recommendations using the cluster
> resource ID.

---

## Best Practices

1. **Start with kubectl get/describe** - Always check basic status first
2. **Check events** - `kubectl get events -A` reveals recent issues
3. **Use systematic isolation** - Pod -> Node -> Cluster -> Network
4. **Document changes** - Note what you tried and what worked
5. **Escalate when needed** - For control plane issues, contact Azure support

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/aks/general-diagnostics.md).
Load only the reference needed for the active task.
