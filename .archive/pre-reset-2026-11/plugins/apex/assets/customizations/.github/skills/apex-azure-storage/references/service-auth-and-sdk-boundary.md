# Storage Authentication And SDK Boundary

Use this reference to record storage access intent. It is not permission to install an SDK or to create, upload, or
delete data. Read-only `az storage` commands follow [storage CLI commands](storage-cli-commands.md).

## Credential Posture

| Workload location | Preferred posture |
| --- | --- |
| Azure-hosted production | Managed identity with least-privilege Azure RBAC |
| Outside Azure, production | Workload identity federation or certificate-based service principal |
| CI/CD pipeline | The pipeline's federated workload identity |
| Local development | Developer sign-in through a credential chain; never a production design |

Credential chains that try several sources in turn are for local development only; production needs a deterministic
credential. Never include account keys, connection strings, SAS tokens, or credential values in an APEX artifact.

## Data-Plane Access

Data access is granted by data-plane roles, not management roles. Reader or Contributor on the account does not grant
blob, queue, or table data access through Entra authorization; Contributor can still list account keys, which is one
more reason to disable shared-key access. Record the required data operation
and let `apex-azure-rbac` choose the narrowest role, for example a blob data reader role for reads and a blob data
contributor role for writes, at the narrowest scope such as the container.

Record the identity owner, scope, network posture, and evidence needed for the selected service. Missing
classification, policy, network, or recovery evidence is a blocker.

## SDK Boundary

Language SDK installation, client construction, and data-operation samples remain implementation work outside this
skill. An authorized implementation capability selects libraries, acquires its own approved identity evidence, and
performs any data operation. This architecture reference supplies service and authentication intent only.
