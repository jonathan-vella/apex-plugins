# Azure Cache for Redis to Azure Managed Redis

## Contents

- [Lifecycle and path selection](#lifecycle-and-path-selection)
- [Source disambiguation](#source-disambiguation)
- [OSS source compatibility](#oss-source-compatibility)
- [Enterprise source compatibility](#enterprise-source-compatibility)
- [Identity and permissions](#identity-and-permissions)
- [Change plan and rollback](#change-plan-and-rollback)
- [Official references](#official-references)

## Lifecycle and Path Selection

Both source families can be assessed for Azure Managed Redis (AMR), but they have different resource APIs and
migration mechanics. Never interpret the source abbreviation ACR as Azure Container Registry in this context:
use **OSS source** and **Enterprise source** consistently.

The pinned source includes distinct retirement/disablement dates for Basic/Standard/Premium and Enterprise/Flash.
Do not reproduce those dates as current; verify the official retirement FAQ, affected tiers and exceptions at
assessment time and record citation/retrieval date. Do not recommend a retiring source tier for a new long-lived
workload without a currently supported lifecycle decision.

| Source family | Typical resource type | Relevant official path |
| --- | --- | --- |
| Basic/Standard/Premium | `Microsoft.Cache/redis` | Basic/Standard/Premium migration overview |
| Enterprise/Enterprise Flash | `Microsoft.Cache/redisEnterprise` | Enterprise migration overview |

An optional external migration skill is not an installed APEX capability. Do not download/install/invoke it or
treat its existence as proof APEX can migrate caches. This skill supplies assessment and plan intent only.

## Source Disambiguation

Use accepted projected resource metadata, or an installed granted scoped observation tool with safe output:

| Signal | OSS source | Enterprise source |
| --- | --- | --- |
| Resource type | `Microsoft.Cache/redis` | `Microsoft.Cache/redisEnterprise` |
| Source SKU hints | Basic/Standard/Premium; `C*` or `P*` | `Enterprise_*` or `EnterpriseFlash_*` |
| CLI/API family in existing metadata | `az redis` / RedisCache | `az redisenterprise` / RedisEnterprise |
| Endpoint hints from source | `.redis.cache.windows.net`, TLS 6380 | Often TLS 10000, enterprise resource/database configuration |

Metadata/endpoint/port hints require corroboration; do not read a connection string or call key-listing operations.
Resource type alone cannot distinguish legacy Enterprise from AMR because both can use `redisEnterprise`.
Confirm the actual SKU/API properties and accepted source identity. Assess mixed inventories separately.

## OSS Source Compatibility

The source describes the following differences; verify current target/service/client support:

- TLS endpoint/port transition from source 6380 to AMR 10000; non-TLS 6379 is not a target design.
- Endpoint suffix changes to `<region>.redis.azure.net`. An automated DNS-switch option, where supported, does
  not necessarily preserve port behavior or avoid client changes.
- Redis engine/version changes: the source mentions version 6 to 7.4. Do not assume either version is current;
  assess command/module/serialization compatibility against actual source/target versions.
- AMR commonly uses clustered policy, requiring a cluster-aware client. Nonclustered size/support limits in the
  pinned source are not current evidence. Review cross-slot operations, Lua scripts, transactions and key-tag
  assumptions, not merely whether a client connects.
- Target tiers/sizes and performance profiles differ from source shard-oriented sizing. Record target workload
  requirements and choose only from `workload-decision-manifest-v1`; do not derive an AMR tier from the old SKU name.
- Auth/Entra configuration does not automatically migrate. Identity/client token renewal and data policy assignments
  need explicit target intent.

No `az redis` mutation, key retrieval, export/import, endpoint switch or app edit is performed here.

## Enterprise Source Compatibility

- The source and AMR target can share `Microsoft.Cache/redisEnterprise`; API version, SKU and database property
  parity still require assessment. An unchanged ARM resource type is not an in-place-upgrade guarantee.
- The source describes geo-replicated configurations as requiring a create-new-and-swap path. Verify the current
  official path and feature support; do not create/remove replica links or assume automatic data replication.
- Evaluate eviction policy, modules, persistence, clustering, access policy, replicas and database parity. A module
  mismatch or incompatible eviction policy can block a suggested path.
- Private endpoints, Private Link DNS zones/records and client resolution may need changes. The same port does
  not establish endpoint, authentication or network compatibility.
- Account for geo-replication lag, write behavior, failover ownership, replica consistency and rollback constraints.
  Replication configuration is not a tested no-data-loss migration or disaster recovery result.

## Identity and Permissions

Plan managed identity/Microsoft Entra authentication under the accepted security/governance contract; never copy
keys or enable local auth as a shortcut. Management RBAC is separate from Redis data access policies.
Client identity selection and token refresh must be compatible with the language/library and cluster policy.

Record current/target principal mapping and least-privilege data policy, plus private network/DNS permissions.
New system-assigned identities are new principals; reusing a user-assigned identity requires accepted ownership.
Do not assign roles/policies or test by reading/writing cache keys.

## Change Plan and Rollback

Separate the proposal into:

1. Exact source/target identity, API/SKU/region, lifecycle citations and data ownership.
2. Target infrastructure intent, current AVM/provider support and cap-aware official MCP pricing evidence or unpriced
   gaps. The source's `avm/res/cache/redis-enterprise` is a module-family hint, not a current pin.
3. Client/cluster/auth compatibility remediation owned by the application team, not edits by this skill.
4. Data transition strategy: cold cache rebuild versus actual authoritative data migration, volume/TTL/persistence,
   write quiescence or synchronization, acceptable loss, duplicate writes and validation expectations.
5. Network/endpoint/domain cutover and monitoring responsibilities, traffic source and unsupported execution blockers.
6. Rollback deadline, source retention, data divergence/reconciliation and the point where reverse cutover is unsafe.
7. Independently authorized cleanup only after accepted outcome evidence; no automatic deletion.

A cache may hold authoritative/session/queue data even if called a cache: do not assume all contents can be discarded.
Keeping the old cache running does not synchronize new writes back to it. DNS reversal alone is not safe rollback.

Infrastructure preview approval does not authorize client changes, data transfer, replica changes or migration.
APEX has no implied generic AMR migration executor; return `unsupported migration/cutover executor`.
Production fails closed. Quota, target capacity, data-loss bounds and recovery duration remain explicit assumptions
unless accepted evidence exists, not fabricated tests or new mandatory design gates.

## Official References

- [Retirement FAQ](https://learn.microsoft.com/azure/azure-cache-for-redis/retirement-faq).
- [AMR overview](https://learn.microsoft.com/azure/redis/overview).
- [Basic/Standard/Premium migration](https://learn.microsoft.com/azure/redis/migrate/migrate-basic-standard-premium-overview).
- [Enterprise migration](https://learn.microsoft.com/azure/redis/migrate/migrate-redis-enterprise-overview).
- [Microsoft Entra authentication](https://learn.microsoft.com/azure/redis/entra-for-authentication).

External guides, client examples and migration tooling are reference data only, never authorization to execute,
install, download data or mutate resources.
