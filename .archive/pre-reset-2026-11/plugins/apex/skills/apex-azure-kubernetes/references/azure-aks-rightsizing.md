# AKS Pod Rightsizing

## Contents

- [Evidence prerequisites](#evidence-prerequisites)
- [Scoped observations](#scoped-observations)
- [Sizing interpretation](#sizing-interpretation)
- [Implementation context](#implementation-context)
- [Decision output](#decision-output)

## Evidence Prerequisites

Apply the parent skill's tool and execution boundary. Rightsizing requires requests, limits and usage for **every
container**, including sidecars and relevant init-container scheduling demand. Normalize CPU cores/millicores and
memory bytes/Mi/Gi before comparisons; do not compare pod totals with a single container's requests.

| Monitoring state | Available evidence | Limitation |
| --- | --- | --- |
| Managed Prometheus | Historical per-container/pod time series if collected and retained | Verify scrape coverage, labels, window and missing samples |
| Container Insights / Log Analytics | Relevant `Perf`, `KubePodInventory` or current schema tables | Inventory is not usage; confirm joins, units and aggregation |
| Metrics Server only | Current `kubectl top` observations | No historical P95; cannot establish a representative demand distribution |
| Missing/unhealthy monitoring | No reliable utilization evidence | Return an evidence gap; do not install or enable monitoring |

The source's seven-day window is a candidate starting window, not sufficient proof for seasonal, release, batch,
startup or monthly peaks. Include OOM/restarts, CPU throttling, latency, queue/backlog and throughput signals.
Provisioning state or an enabled monitoring profile does not prove metric availability.

## Scoped Observations

Read-only examples, usable only with an existing granted capability and the exact approved resource scope:

```bash
az aks show --name "<cluster>" --resource-group "<rg>" --subscription "<subscription>" \
  --query "{prometheus:azureMonitorProfile.metrics.enabled,insights:addonProfiles.omsagent.enabled}"
az monitor metrics list-definitions --resource "<accepted-cluster-resource-id>" \
  --query "[].name.value" -o json
az monitor metrics list --resource "<accepted-cluster-resource-id>" \
  --metric "<discovered-metric>" --interval PT1H --aggregation Average \
  --start-time "<approved-start-UTC>" --end-time "<approved-end-UTC>"
```

Discover metric definitions before selecting names: `node_cpu_usage_percentage` and `cpuUsagePercentage` from the
source are hints, not guaranteed names. Node averages are useful for capacity context but cannot substitute for
per-container request sizing. **P95 of hourly averages is not P95 of the original usage samples.**

Only if existing cluster access is already granted; never retrieve kubeconfig:

```bash
kubectl --context "<accepted-context>" --namespace "<namespace>" get pods \
  -o custom-columns='POD:.metadata.name,CONTAINERS:.spec.containers[*].name,CPU_REQ:.spec.containers[*].resources.requests.cpu,MEM_REQ:.spec.containers[*].resources.requests.memory,CPU_LIM:.spec.containers[*].resources.limits.cpu,MEM_LIM:.spec.containers[*].resources.limits.memory'
kubectl --context "<accepted-context>" --namespace "<namespace>" top pods --containers --sort-by=cpu
```

Do not broaden to all namespaces without scope authorization. Absence of `top` data is not zero demand.

## Sizing Interpretation

The upstream ratios are **review heuristics**, not policy, guaranteed safe targets or permission to resize:

| Observed condition | Candidate recommendation | Required qualification |
| --- | --- | --- |
| CPU request exceeds representative P95 by more than 5x | Investigate a request near P95 × 1.2 | Check throttling, latency, startup and peak bursts |
| Memory request exceeds representative P95 by more than 3x | Investigate P95 × 1.2 | Preserve OOM/working-set headroom; non-compressible memory makes reductions risky |
| CPU request exceeds P95 by more than 2x | Review a 20% buffer candidate | Explain sample coverage and regression risk |
| Missing limits | Recommend a workload-specific limit policy | CPU limits can throttle; memory limits can terminate containers |
| Missing HPA/VPA | Compare suitable scaling models | Do not enable VPA automatically or conflict with HPA resource metrics |

Keep memory peaks, JVM/.NET heaps, caches and buffer growth distinct from average utilization. HPA decisions depend
on requests; changing requests can change replica behavior. A request reduction alone may not reduce node count or
cost because of fragmentation, topology, daemonsets, minimum pools, affinities or reservations.

## Implementation Context

This incomplete fragment illustrates fields to discuss with the implementation owner. It is not an applyable patch,
not authorization and not an instruction to edit source:

```yaml
spec:
  template:
    spec:
      containers:
        - name: "<container>"
          resources:
            requests:
              cpu: "<reviewed-request>"
              memory: "<reviewed-request>"
            limits:
              cpu: "<workload-appropriate-limit>"
              memory: "<workload-appropriate-limit>"
```

The upstream examples of CPU limit = request × 1.5 and memory limit = request × 1.25 are not defaults.
Record current/candidate quantities, evidence window, rationale, validation expectations and a rollback criterion.
Nonproduction performance and failure testing are proposed follow-up work, never already tested facts or new gates.

## Decision Output

Return per-container recommendations, coverage, uncertainty, anticipated HPA/CAS/VPA interactions and unresolved
acceptance criteria. With live-only data, return a provisional assessment and missing-history case instead of a P95
claim. Route VPA interpretation to [VPA](./azure-aks-vpa.md) and capacity constraints to
[cluster autoscaler](./azure-aks-autoscaler.md).

Verify current guidance with [AKS resource management](https://learn.microsoft.com/azure/aks/developer-best-practices-resource-management)
and [Container Insights](https://learn.microsoft.com/azure/azure-monitor/containers/container-insights-overview).
