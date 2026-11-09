# AKS Spot Node Pools

## Suitability

Spot is an interruptible capacity option, not guaranteed cheap or available capacity. Use only for workloads that
can tolerate interruption; price proposals through the parent's official cap-aware pricing contract. Do not quote
fixed discounts or promise savings. Apply all parent execution restrictions.

| Workload | Assessment |
| --- | --- |
| Batch/data processing and checkpointed jobs | Candidate if retries/checkpoints tolerate eviction |
| Dev/test | Candidate if interruption and rebuild time are acceptable |
| Stateless replicated APIs | Conditional: verify regular-capacity fallback and availability objectives |
| Databases/stateful workloads | Do not recommend without a specific accepted durability/failure design |
| Critical single-replica services | Unsuitable without a redesigned availability model |

## Existing Pool and Workload Evidence

Read-only example for a granted capability:

```bash
az aks nodepool list --cluster-name "<cluster>" --resource-group "<rg>" --subscription "<subscription>" \
  --query "[].{name:name,size:vmSize,priority:scaleSetPriority,count:count,mode:mode}" -o json
```

Use already-granted namespace-scoped Kubernetes observations to compare replicas, PDB selectors, current
disruptions, topology constraints, tolerations and node affinity. A single-replica deployment is not a query for
missing PDBs; absence of a PDB does not by itself establish interruption tolerance.

## Mixed Regular and Spot Design

- Keep system/critical workloads on suitable regular pools. Derive the regular floor and maximum from the accepted
  workload and zone-failure objectives, not the source's example counts.
- Place only suitable workloads on a Spot user pool with the provider's supported priority, taint and labels.
  Choose the node SKU from `workload-decision-manifest-v1`. Confirm accepted policy and supported pool features.
- A toleration permits Spot scheduling; it does not force it. Required Spot affinity or a Spot `nodeSelector`
  prevents rescheduling to regular nodes. Prefer nonbinding preference when fallback is required.
- Regular fallback needs actual available quota, IPs and capacity plus compatible constraints. It is a design
  assumption until evidenced, not a guaranteed consequence of adding a second pool.
- The source's Delete eviction policy and max-price `-1` are provider-setting candidates: `-1` means no lower
  bid cap than the provider's on-demand ceiling, not a guarantee of price or capacity. Verify current semantics.

Illustrative toleration only; not an instruction to modify a deployment:

```yaml
tolerations:
  - key: kubernetes.azure.com/scalesetpriority
    operator: Equal
    value: spot
    effect: NoSchedule
```

Do not append a Spot-only selector when claiming fallback to regular capacity.

## Interruption and Recovery

The source discusses a short eviction-notice window (approximately 30 seconds). Verify current notice semantics;
delivery and usable shutdown time are not guaranteed. Plan idempotency, durable checkpoints, bounded graceful
shutdown, readiness removal and replay/retry handling. The source's 25-second grace and five-second pre-stop delay
are illustrative, not safe universal values; no shell lifecycle helper is imported.

PDBs can constrain voluntary disruption but do **not** prevent involuntary Spot eviction or guarantee simultaneous
eviction limits. Use topology spread and replicas, but state explicitly which correlated-capacity loss is tolerated.
Document what happens if regular pools cannot grow: backlog, deferred jobs, rejected traffic or an SLO breach.

Return suitability, placement intent, regular fallback assumptions, interruption/data-loss consequences, unknowns
and owner follow-up. No pool creation, scaling, eviction simulation, cordon/drain or workload apply is performed.

Verify [AKS Spot pools](https://learn.microsoft.com/azure/aks/spot-node-pool)
and [Spot eviction](https://learn.microsoft.com/azure/virtual-machines/spot-vms).
