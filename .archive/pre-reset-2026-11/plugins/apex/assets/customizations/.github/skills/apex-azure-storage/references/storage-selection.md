# Storage Selection

## Services

| Service | Use when | Consider instead |
| --- | --- | --- |
| Blob Storage | Objects, backups, media, static content | - |
| Azure Files | Managed SMB or NFS shares, lift-and-shift file servers | Azure NetApp Files for demanding enterprise file workloads |
| Queue Storage | Simple asynchronous work items | Service Bus for ordering, sessions, or dead-lettering |
| Table Storage | Basic key-value data | Cosmos DB for global distribution or richer queries |
| Data Lake Storage | Analytics needing a hierarchical namespace | - |

Record the alternative when SQL, Cosmos DB, Event Hubs, or Service Bus fits the requirement better.

## Performance Tier

Choose Standard unless an accepted latency or IOPS requirement supports Premium. Premium targets consistently low
latency and high transaction rates and is priced on provisioned capacity.

## Access Tiers

Choose the tier from observed or required access frequency and retrieval tolerance, not from a generic age rule.

| Tier | Suited to | Minimum retention | Retrieval |
| --- | --- | --- | --- |
| Hot | Frequent reads and writes | None | Immediate |
| Cool | Occasional reads | 30 days | Immediate, with a per-GB read charge |
| Cold | Rare reads, compliance copies | 90 days | Immediate, with a per-GB read charge |
| Archive | Archival and legal hold | 180 days | Offline; rehydration takes hours |

Moving or deleting data before its minimum retention incurs an early-deletion charge. Do not place data with urgent or
unpredictable retrieval in Archive. Confirm current retention periods against service documentation when the decision
depends on them.

## Redundancy

| Option | Protects against | Typical fit |
| --- | --- | --- |
| LRS | Hardware failure within one datacenter | Dev/test, recreatable or noncritical data |
| ZRS | Loss of one availability zone | Production data needing zonal resiliency |
| GRS | Loss of the primary region, with a secondary copy | Disaster recovery for regional outages |
| GZRS | Zone loss in the primary region and regional loss | Highest resiliency for critical data |

Redundancy does not establish backup, retention, point-in-time restore, RPO, or RTO. Record those separately.

## Lifecycle

A lifecycle rule names the eligible object set, the age or last-access basis, the tier or delete action, and the
retention constraint it respects. Last-access rules require access tracking on the account. Add deletion rules only for
retention periods the data owner has approved; lifecycle transitions do not replace backup.
