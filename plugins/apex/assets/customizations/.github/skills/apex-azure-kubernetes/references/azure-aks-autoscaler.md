# AKS Cluster Autoscaler

## Purpose and Evidence

Cluster Autoscaler (CAS) changes pool capacity to accommodate scheduling demand and removes nodes only when its
eligibility and eviction checks permit. It does not resize pods, guarantee safe disruptions or create cloud capacity.
Apply the parent skill's boundary: no direct enabling, profile updates, pool changes, resets or rollback commands.

Read-only examples require a granted Azure observation capability and the exact approved target:

```bash
az aks show --name "<cluster>" --resource-group "<rg>" --subscription "<subscription>" \
  --query "agentPoolProfiles[].{name:name,enabled:enableAutoScaling,min:minCount,max:maxCount,count:count}"
az aks show --name "<cluster>" --resource-group "<rg>" --subscription "<subscription>" \
  --query "autoScalerProfile"
```

Interpret node utilization alongside scheduling failures, pod resource requests, affinity, taints, local storage,
daemonsets, PDBs, zone balance, IP availability and [historical metric coverage](./azure-aks-rightsizing.md).
Idle nodes alone do not establish an autoscaler defect.

## Pool Bounds

The upstream dev/test `min=1`, production web `min=2`, batch `min=0` and maximums based on current count × 3 or × 5
are illustrative heuristics, **not defaults or availability guarantees**. Derive proposed bounds from:

- Required system-pool floor and supported scale-to-zero behavior for user pools.
- Critical workload replicas, zone failure, rescheduling and peak capacity needs.
- Supported pool/cluster limits, network IP headroom, workload manifest SKUs, budget and accepted governance.
- Quota, SKU availability and allocation uncertainty; at design stage these remain assumptions unless evidenced.

Compare Node Auto-Provisioning/Automatic behavior before proposing a CAS pool configuration; they are not
interchangeable feature combinations.

## Profile Trade-Offs

The following values preserve the source's comparison examples. They are **historical design candidates**, not
current platform defaults; verify supported settings and semantics in current documentation.

| Source example | Delay after add | Unneeded time | Utilization threshold | Intended trade-off |
| --- | --- | --- | --- | --- |
| General | 10m | 10m | 0.5 | Moderate churn and consolidation |
| Cost-sensitive | 5m | 5m | 0.5 | Earlier consolidation, more potential churn |
| Conservative | 30m | 30m | 0.7 | Longer observation before consolidation; threshold behavior needs review |
| Aggressive | 2m | 2m | 0.4 | Short dwell time; workload-specific disruption risk |

These dimensions interact: a higher utilization threshold can make more nodes eligible, so a profile name does not
prove safety. Record each setting's consequence rather than recommending a named bundle blindly.

`max-graceful-termination-sec` constrains graceful eviction time; compare it with application shutdown and
termination grace. `skip-nodes-with-system-pods=false` can expose system workloads to eviction: never recommend it
as a blanket cost optimization. PDBs, system-pod scheduling and current autoscaler eviction behavior need review.

## Disruption and Rollback Planning

With already-granted Kubernetes reads, inspect approved-namespace PDB desired/current health and
`disruptionsAllowed`; names alone do not prove protection. PDBs govern voluntary disruptions, not all failures.
Overly restrictive budgets, singleton workloads and local storage can block consolidation.

Propose staged nonproduction evaluation and regression criteria (pending pods, failed evictions, tail latency,
restarts, cost/capacity change). These are future validation expectations, not required new kernel gates.
Capture the current exact profile as the rollback baseline; resetting to remembered defaults is not rollback.
No rollback is executed by this skill.

Verify current [AKS autoscaler guidance](https://learn.microsoft.com/azure/aks/cluster-autoscaler)
and [autoscaler profile](https://learn.microsoft.com/azure/aks/cluster-autoscaler-overview).
