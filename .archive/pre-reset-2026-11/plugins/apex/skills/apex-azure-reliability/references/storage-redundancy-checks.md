# Storage Redundancy and Backup Assessment

## Contents

- [Replication semantics](#replication-semantics)
- [Scoped discovery and dependency mapping](#scoped-discovery-and-dependency-mapping)
- [Targets and conversion risk](#targets-and-conversion-risk)
- [Backup and recovery evidence](#backup-and-recovery-evidence)
- [Reporting](#reporting)

## Replication Semantics

| Replication | Zone protection in primary | Regional copy | Important limitation |
| --- | --- | --- | --- |
| LRS | No | No | Local redundancy is not zone or regional isolation |
| ZRS | Yes, where supported | No | A regional outage still affects the primary endpoint |
| GRS | No; primary uses LRS | Asynchronous secondary | Regional copy does not make primary-zone storage available |
| GZRS | Yes | Asynchronous secondary | Regional data loss and failover time remain possible |
| RA-GRS | No; primary uses LRS | Read-access secondary | Read access is not writable failover or application consistency |
| RA-GZRS | Yes | Read-access secondary | Same asynchronous replication and write-failover caveats |

Validate actual account type, service and feature support with current documentation. Do not interpret copy counts
or labels as an end-to-end availability guarantee. Geo-replication is asynchronous: compare observed replication
lag/last sync semantics with the RPO rather than promising no data loss.

Redundancy is **not backup**: deletion, corruption or a compromised identity can affect replicated data.

## Scoped Discovery and Dependency Mapping

Read-only examples only with an installed, granted capability and accepted target:

```bash
az graph query --subscriptions "<subscription>" -q "
Resources
| where resourceGroup =~ '<rg>'
| where type =~ 'microsoft.storage/storageaccounts'
| project id, name, resourceGroup, location, replication=sku.name, tier=sku.tier, kind
" --query "data[]" -o json
az storage account show --subscription "<subscription>" --name "<account>" --resource-group "<rg>" \
  --query "{id:id,name:name,sku:sku.name,kind:kind,location:location}"
```

Find explicit LRS/GRS observations without claiming a missing SKU defaulted to any value. The source asserts
unspecified ARM/AVM storage defaults to `Standard_GRS`; this is not portable and is not retained as a fact.
Read deployed metadata and the selected module/provider schema instead.

Relate each app/plan to its **accepted storage resource ID**, not name similarity or resource-group co-location.
For Functions, inventory app setting **names only** to distinguish identity-based `AzureWebJobsStorage__*`
configuration from a potential key-based connection. Obtain dependency account names/IDs from accepted projected
configuration/IaC, not app setting values. Never print `AzureWebJobsStorage` or connection strings.

The source's read of `AzureWebJobsStorage__accountName` values is excluded here to maintain a uniform names-only
configuration boundary. If no accepted dependency mapping exists, report `unknown host-storage mapping`.

## Targets and Conversion Risk

- Zone-capable compute with LRS/GRS host storage can still depend on one primary zone. Compare ZRS/GZRS options
  with the actual availability requirement; GRS is not primary-zone protection.
- Regional recovery needs an appropriate replication/recovery design, not automatically a GZRS SKU.
  Multiple independent regional accounts can require application-managed synchronization.
- Select replication/SKU intent only from the workload decision manifest. Record why an explicit SKU is needed;
  do not silently substitute the source's preferred `Standard_ZRS` or `Standard_GZRS`.
- Candidate IaC fields from the source include AVM `skuName` and Terraform `account_replication_type`; verify exact
  resolved module/provider support before an implementation task uses them.
- Conversion paths depend on Standard/Premium, account kind, enabled features, direction, region and current
  service support. The source's general-purpose-v2 conversion example is not permission to migrate.
- Conversion may require a new account and authorized data movement, may be long-running and may affect availability.
  No hours/days estimate is a tested duration. Assess irreversible constraints, rollback and data consistency.

All configuration conversion, copy, replication change and failover operations are outside this skill.
An approved IaC deployment does not authorize storage data movement or account failover automatically.

## Backup and Recovery Evidence

For each relevant data set, record:

1. Scope: application files/configuration, database records, blobs/files/queues and external dependencies.
2. Mechanism: backup, snapshots/versioning, soft delete or point-in-time recovery; each has different coverage.
3. Schedule/retention and isolation/immutability, with owner-approved retention and deletion boundaries.
4. Restore dependencies: permissions, encryption keys/Key Vault, private DNS/network, compatible runtime and target.
5. Latest accepted backup metadata versus latest accepted **restore** receipt: source/time/scope and success criteria.
6. RTO/RPO expectation, recovery sequencing, replay/reconciliation needs and untested assumptions.

Configured retention is not proof that a backup contains all data or can be restored. A successful restore of one
object is not proof of whole-system recovery. Do not download backup data, retrieve keys, initiate restores or run
failure drills as observations.

## Reporting

Report per-account actual SKU and linked dependency, protection scope, configuration evidence, RTO/RPO gap,
backup coverage and whether recovery is untested. Unknown mappings or missing evidence remain explicit.
At design stage, propose future restore evaluation without adding new required workflow gates.

Verify [Storage redundancy](https://learn.microsoft.com/azure/storage/common/storage-redundancy),
[redundancy conversions](https://learn.microsoft.com/azure/storage/common/redundancy-migration)
and [Storage disaster recovery](https://learn.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance).
