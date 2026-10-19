# Compute Recommendation And Scale Rules

Use these rules to form a bounded architecture recommendation. They do not establish regional availability, quota,
SKU specifications, or price; bind those claims to accepted current evidence.

## Recommendation Inputs

Record workload type, CPU and memory demand, accelerator or local I/O requirements, operating system, region,
availability target, budget, instance range, scaling trigger, and load-balancing need. Missing inputs are blockers or
kernel input requests rather than reasons to select a default SKU.

## Scale Set Orchestration

Prefer Flexible orchestration for every new scale set unless an accepted constraint requires Uniform. The mode is fixed
at creation, so it is a durable design decision.

| Capability | Flexible | Uniform |
| --- | --- | --- |
| Mixed sizes in one set | Yes | No |
| Add existing VMs | Yes | No |
| Single-instance scale set | Yes | No |
| Zone spread and fault-domain control | Yes | Yes |
| Spot instances | Yes | Yes |

Take instance-count and per-region scale-set limits from current documentation evidence, not from memory.

## Autoscale

| Pattern | Trigger | Example |
| --- | --- | --- |
| Metric | CPU, memory, queue length, or a custom metric | Scale out when average CPU stays high for several minutes |
| Schedule | Time of day or day of week | Larger baseline during business hours |
| Combined | Schedule baseline plus metric bursts | Predictable floor with headroom for spikes |

- Keep at least two instances for production high availability.
- Use a cool-down period so rules do not flap.
- Scale out aggressively and scale in conservatively.
- Treat predictive autoscale as preview unless current documentation says otherwise.

Record minimum and maximum capacity, triggers, cool-down intent, and availability design. A scale set alone does not
establish production availability.

## Load Balancing

| Component | Use when |
| --- | --- |
| Azure Load Balancer | Layer 4 TCP or UDP distribution for backend services. |
| Application Gateway | Layer 7 HTTP or HTTPS with TLS termination, path routing, or WAF. |
| No load balancer | Batch or HPC instances that pull work from a queue. |

## Recommendation Record

Present two or three options with hosting model and orchestration mode, size, vCPU and memory, instance count or range,
unit and monthly price, fit, and trade-off. For a scale set, also state the autoscale strategy and load-balancer type.

Record the selected model, candidate families, assumptions, rejected alternatives, capacity range, availability intent,
current-evidence references, and unresolved risks. Escalate missing quota, capacity, or documentation evidence instead
of treating published SKU names as deployment feasibility.
