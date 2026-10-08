# Compute Recommendation And Scale Rules

Use these rules to form a bounded architecture recommendation. They do not establish regional availability, quota,
SKU specifications, or price; bind those claims to accepted current evidence.

## Recommendation Inputs

Record workload type, CPU and memory demand, accelerator or local I/O requirements, operating system, region,
availability target, budget, and expected instance range. Missing inputs are blockers rather than reasons to select a
default SKU.

## Model And Family Selection

Use a single VM for a distinct, stateful, long-lived, or individually configured workload. Use VM Scale Sets for an
interchangeable fleet with an evidenced capacity range and metric or schedule-based scaling need. A stateless web or
API tier, parallel batch work, and homogeneous replicas are scale-set signals; a jump host, domain controller, or
unique per-instance configuration is a single-VM signal. Prefer Flexible orchestration for a new scale set unless an
accepted constraint requires Uniform; orchestration mode is a durable design decision.

Select compatible candidates from the workload shape:

- General-purpose families for balanced workloads; burstable families only when the credit and throttling trade-off is
  acceptable.
- Compute-optimized families for sustained CPU demand, memory-optimized families for memory-bound data workloads,
  and storage-optimized families for high local I/O.
- GPU, confidential-computing, or HPC families only when an explicit accelerator, isolation, or interconnect
  requirement exists.
- Treat Spot capacity as interruptible. It is not suitable for work that cannot tolerate eviction.

## Scale And Cost Evidence

For scale sets, record minimum and maximum capacity, scale triggers, cool-down intent, availability design, and the
load-balancing or work-pull model. Do not infer production availability from a VMSS choice alone.

Compare at least two viable candidates when requirements permit. Cost comparisons must identify region, operating
system, price type, unit, collection time, candidate SKU, and instance range. VMSS cost is the underlying instance
cost across its range; include baseline and peak estimates. Retail price lookup is capability-supplied evidence, not a
skill operation, and a stale or incomplete result blocks a final cost claim.

## Recommendation Record

Record the selected model, candidate families, assumptions, rejected alternatives, capacity range, availability
intent, current-evidence references, and unresolved risks. Escalate missing quota, capacity, or documentation evidence
instead of treating published SKU names as deployment feasibility.
