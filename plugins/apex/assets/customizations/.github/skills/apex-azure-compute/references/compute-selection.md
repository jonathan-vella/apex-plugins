# Compute Selection

## Hosting Model

Use a single VM for a distinct, stateful, or individually configured workload. Use VM Scale Sets when the workload has
an evidenced fleet requirement: interchangeable instances, defined minimum/maximum capacity, and metric or schedule
scaling. Flexible orchestration suits heterogeneous fleet requirements; record why state, licensing, or networking does
not prohibit it.

## Family Candidates

Evaluate at least two compatible families when the requirement permits it:

- General purpose for balanced CPU and memory workloads.
- Compute optimized for sustained CPU-bound work.
- Memory optimized for memory-bound databases or caches.
- Storage optimized for high local IOPS or throughput.
- GPU or HPC families only when an explicit accelerator or interconnect requirement exists.

Do not assert SKU availability, memory, CPU, or feature support from memory. Bind those claims to accepted current
source evidence for the intended region.

## Recommendation Record

Record workload fit, hosting model, instance count or range, availability design, candidate SKUs, rejected alternatives,
and unresolved risks. Regional capacity and quota are independent evidence inputs, not inferred from a published SKU.
