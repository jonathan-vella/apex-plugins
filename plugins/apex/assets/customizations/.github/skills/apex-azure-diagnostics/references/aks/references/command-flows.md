> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# AKS Command Flows

## Cluster Baseline Flow

```text
Resolve subscription -> resolve resource group -> resolve cluster -> inspect cluster state -> inspect node pools -> inspect resource health -> inspect recent operations
```

CLI fallback when AKS-MCP cannot perform the cluster baseline read — use the individual `az aks show`,
`az aks nodepool list` and activity-log reads within the accepted task scope. The
[`aks-baseline`](../../script-examples/aks-baseline.sh.md) source example shows upstream's single read-only digest; it
is non-executable and not installed.

## Kubernetes Baseline Flow

```text
Check API reachability -> inspect nodes -> inspect kube-system -> inspect events -> inspect affected namespace -> inspect pod details and logs
```

CLI fallback when AKS-MCP cannot perform the Kubernetes baseline read — cover node readiness, unhealthy pods,
kube-system health and recent warning events with the reads below, include the affected namespace, then deep-dive on a
specific pod:

```bash
kubectl cluster-info
kubectl get nodes -o wide
kubectl get pods -n kube-system
kubectl get events -A --sort-by=.lastTimestamp
kubectl get pods -n <namespace>
```

For pod detail and logs, gather the read-only evidence bundle (describe, current + previous logs, resources vs usage)
with these reads; the [`pod-evidence`](../../script-examples/pod-evidence.sh.md) source example is non-executable and
not installed. Bound logs with `--tail` and keep only redacted excerpts:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --tail=200
kubectl logs <pod-name> -n <namespace> --previous --tail=200
```

## Connectivity Flow

```text
pod -> service -> endpoints -> ingress or load balancer -> DNS -> network controls
```

CLI fallback when AKS-MCP cannot perform the connectivity read:

```bash
kubectl get pods -n <namespace> -o wide
kubectl get svc -n <namespace>
kubectl get endpoints -n <namespace>
kubectl get ingress -n <namespace>
kubectl describe ingress <ingress-name> -n <namespace>
```

## Detector Flow

```text
resolve cluster resource ID -> list detectors or choose category -> select a focused time window -> run the detector or category -> rank critical findings above warnings -> ignore emerging issues when choosing the primary root cause
```

## Monitoring Flow

```text
check resource health -> inspect metrics -> verify diagnostics settings -> inspect control plane logs if available -> correlate with Application Insights or namespace symptoms
```

## Scheduling Flow

```text
pod events -> node capacity -> taints and tolerations -> affinity rules -> PVC state -> quotas
```

CLI fallback when AKS-MCP cannot perform the scheduling read:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get nodes -o wide
kubectl describe node <node-name>
kubectl get pvc -n <namespace>
kubectl describe quota -n <namespace>
```

## Deep Diagnostics Flow (Inspektor Gadget)

```text
Standard diagnostics inconclusive -> select gadget from symptom-to-gadget map -> run the gadget through an available authorized capability (the `run-ig` example is a non-executable source) -> interpret output -> correlate with prior evidence
```

Use when steps 1–3 of the evidence order (Azure-side, Kubernetes-side, and detector evidence) do not reveal root cause.
See [inspektor-gadget.md](inspektor-gadget.md) for the full gadget catalog and command patterns.

## Safety Boundary

Treat the following as change operations and avoid them unless the user explicitly asks for remediation:

- deleting or restarting pods
- cordon and drain operations
- scaling workloads or node pools
- cluster upgrade operations
- DNS, route, NSG, or firewall changes

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/aks/references/command-flows.md).
Load only the reference needed for the active task.
