# AKS Workload Identity

## Contents

- [Identity chain](#identity-chain)
- [Accepted configuration](#accepted-configuration)
- [Service authorization](#service-authorization)
- [Credential-chain considerations](#credential-chain-considerations)
- [Missing evidence and boundaries](#missing-evidence-and-boundaries)

## Identity Chain

Use only accepted projected identity configuration and metadata, never keys or live token material.
Workload Identity exchanges a projected Kubernetes service-account token for a Microsoft Entra token that can
authorize access to Azure services. This removes stored application credentials, not authorization requirements.

Three components must agree:

1. An approved managed identity with resource-specific management/data-plane permissions.
2. A federated identity credential whose issuer matches the cluster's OIDC issuer, whose subject is exactly
   `system:serviceaccount:<namespace>:<service-account>` and whose audience is appropriate to the exchange
   (the source uses `api://AzureADTokenExchange`).
3. A Kubernetes service account annotated with the identity's **client ID**, referenced by the workload.

Do not confuse identity **client ID** with **object/principal ID**. User-assigned identities can be referenced by
multiple approved resources; a new system-assigned identity has a different principal and requires new authorization.
Federation trust is not itself a role assignment or permission to read a service.

## Accepted Configuration

Illustrative configuration relationships, not a complete applyable manifest or permission to create identities:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: "<service-account>"
  namespace: "<namespace>"
  annotations:
    azure.workload.identity/client-id: "<accepted-client-id>"
```

```yaml
spec:
  template:
    metadata:
      labels:
        azure.workload.identity/use: "true"
    spec:
      serviceAccountName: "<service-account>"
      automountServiceAccountToken: false
```

The workload label enables the supported webhook integration. The webhook projects a dedicated token volume and
sets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID` and `AZURE_FEDERATED_TOKEN_FILE`. These names describe application
configuration; this skill does not read their values or open the token file.

`automountServiceAccountToken: false` disables the default Kubernetes API token mount; it does not disable the
separate Workload Identity projected volume. Applications genuinely needing Kubernetes API access require their
own narrowly scoped RBAC design; do not enable the default mount as an authentication repair.

For Key Vault/Secrets Store CSI, assess provider identity, RBAC, rotation and mount exposure separately.
Do not retrieve a secret to demonstrate that federation works.

## Service Authorization

| Service | Required design distinction |
| --- | --- |
| PostgreSQL Flexible Server | Microsoft Entra server configuration and database principal/privileges are separate from Azure RBAC; do not grant database admin merely to connect |
| Key Vault | Distinguish secret, key and certificate operations; use the least-privilege data-plane role (for example Secrets User for a justified secret read) |
| Blob Storage | Storage Blob Data Reader versus Contributor follows required operations; management Reader does not grant blob data access |
| Azure Managed Redis | Microsoft Entra data access policy assignment is separate from Azure RBAC; verify supported client/cluster policy and token renewal |

The source's PostgreSQL SDK audience is `https://ossrdbms-aad.database.windows.net/.default`.
Preserve TLS and database least privilege; application connection logic belongs to the application owner.
For Key Vault, credential-based SDK clients can be configured with the vault URI without embedding credentials.
For Storage, a credential-based Blob client uses an account endpoint and Entra authorization rather than account keys.

For Azure Managed Redis, the source describes TLS to `<cache>.<region>.redis.azure.net` on port `10000`,
the managed identity's **object/principal ID** as Redis username, and token scope
`https://redis.azure.com/.default`. Verify the actual accepted endpoint, cloud, port and auth mode.
Long-running clients must refresh authorization before token expiry; a one-time token assignment is insufficient.
OSS cluster policy can require a cluster-aware client. The source discusses `RedisCluster` for Python and
`Microsoft.Azure.StackExchangeRedis` for .NET token refresh. These are implementation considerations, not package
installation, SDK execution or permission to connect to data.

## Credential-Chain Considerations

Supported Azure Identity SDK credential chains can consume federation automatically. Check installed SDK version,
credential-chain behavior and explicit identity selection with the application owner; do not assume
`DefaultAzureCredential` always selects the intended workload identity.

When an SDK requires user-assigned identity selection, bind the client ID explicitly from accepted configuration.
Do not print access tokens, environment values, database passwords or connection strings; an error that contains
them must be redacted before reporting. Never request token contents to diagnose an audience/issuer mismatch.

## Missing Evidence and Boundaries

- Missing issuer, subject, namespace, client/principal mapping or required data-plane role means the identity
  design is incomplete. Return the exact missing field and owning task.
- Role-assignment metadata is not proof of effective access; deny assignments, propagation, network reachability
  and database/data-policy permissions may still block it.
- A successful token exchange is not proof that a database/secret/blob/cache operation is authorized.
- No identity creation, federated credential update, role assignment, database grant, namespace/service-account
  creation, token retrieval or secret access occurs here.
- Do not repair a mismatch by assigning broad roles, enabling local accounts or substituting keys.

Verify current [AKS Workload Identity](https://learn.microsoft.com/azure/aks/workload-identity-overview),
[Workload Identity deployment concepts](https://learn.microsoft.com/azure/aks/workload-identity-deploy-cluster)
and [AMR Entra authentication](https://learn.microsoft.com/azure/redis/entra-for-authentication).
Treat linked deployment examples as documentation, not executable authorization.
