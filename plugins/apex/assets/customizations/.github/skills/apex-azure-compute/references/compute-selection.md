# Compute Selection

## Hosting Model

```text
Needs autoscale?                                  → VM Scale Set
Several interchangeable instances?                → VM Scale Set
Zone or fault-domain spread across many instances → VM Scale Set
Zone placement for one or two instances           → VM in an availability zone
Otherwise                                         → single VM
```

| Signal | Recommendation |
| --- | --- |
| Autoscale on CPU, memory, queue depth, or schedule | VM Scale Set |
| Stateless web or API tier behind a load balancer | VM Scale Set |
| Parallel batch work that scales out and back to zero | VM Scale Set |
| Mixed sizes in one group | VM Scale Set, Flexible orchestration |
| Single long-lived server such as a jump host or domain controller | VM |
| Unique per-instance configuration | VM |
| Stateful, tightly coupled cluster | VM, or a Flexible scale set after case-by-case review |

Record why state, licensing, or networking does not prohibit the chosen model.

## Family Map

Families describe hardware intent, not individual sizes. Shortlist two or three, then confirm series, sizes, and
features against current [VM sizes documentation](https://learn.microsoft.com/azure/virtual-machines/sizes/overview)
for the intended region.

| Workload | Family | Why |
| --- | --- | --- |
| Web servers, dev/test, microservices | General purpose, D | Balanced CPU to memory |
| Intermittent or low baseline load | General purpose, B (burstable) | Cheapest; throttled when CPU credits run out |
| CI/CD, batch, game servers | Compute optimized, F | High CPU to memory |
| Relational databases, in-memory caches | Memory optimized, E | High memory to CPU |
| SAP HANA, very large databases | Memory optimized, M | Very large memory |
| NoSQL, big data, warehousing | Storage optimized, L | High local disk throughput and IOPS |
| ML training and inference | GPU, NC and ND | NVIDIA compute; ND for multi-GPU training |
| Virtual desktop, visualization, cloud gaming | GPU, NV and NG | Graphics acceleration |
| Confidential workloads | Confidential, DC and EC | Hardware-based trusted execution |
| Tightly coupled HPC, simulation, EDA | HPC, HB, HC and HX | InfiniBand and high memory bandwidth |

```text
GPU needed?                → NC/ND for training or inference, NV/NG for graphics
Confidential computing?    → DC/EC
MPI or InfiniBand HPC?     → HB/HC/HX
High local disk I/O?       → L
Memory-heavy?              → M for very large memory, otherwise E
CPU-heavy?                 → F
Burstable dev/test?        → B
Balanced or unclear        → D as the first candidate
```

Use GPU, confidential, or HPC families only for an explicit accelerator, isolation, or interconnect requirement.

## Trade-offs

| Choice | Benefit | Cost or risk |
| --- | --- | --- |
| Burstable B family | Lowest price for spiky load | Throttled once credits are exhausted |
| AMD (`a`) instead of Intel | Often cheaper | Some workloads assume Intel-specific extensions |
| Arm (`p`) | Strong price-performance on Linux | No Windows; confirm application compatibility |
| Previous generation | Sometimes cheaper | Avoid for new deployments |
| Spot capacity | Deep discount | Evicted at short notice; only for interruption-tolerant work |

Compare prices with returned evidence; never state a discount percentage from memory.

## Reading A Size Name

Size names follow `Standard_<family><subfamily?><vCPUs><features>_<version>`. Common feature letters:

| Letter | Meaning |
| --- | --- |
| `a` | AMD processor |
| `p` | Arm processor |
| `d` | Local temporary disk |
| `s` | Premium SSD capable |
| `l` | Low memory per vCPU |
| `i` | Isolated size |
| `b` | Higher remote block-storage performance |

For example, `Standard_D4as_v5` is a D family size with an AMD processor, four vCPUs, premium SSD support, version 5.
Use the decoding to read candidates; take specifications from documentation evidence.
