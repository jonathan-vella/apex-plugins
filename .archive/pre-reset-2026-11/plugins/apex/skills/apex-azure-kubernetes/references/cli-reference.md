# AKS Observation Boundary

## Prerequisites

The parent skill grants no tools. Only use installed, granted observation capabilities with the accepted target,
field projections, time window and sensitivity limits. Upstream `mcp_azure-mcp_aks` is a capability hint; inspect
actual tool schemas and grants rather than inventing names or proxying arbitrary commands.

If no Kubernetes observation capability/context is already available, return `cluster observation unavailable`.
Do not retrieve kubeconfig, run `az aks get-credentials` (including non-admin variants), log in, install extensions,
download clients or request credentials. Identity metadata comes from accepted projected data, not keys.

## Azure Metadata Examples

These read-only examples do not provide authorization; the subscription and target must already be accepted:

```bash
az aks list --subscription "<subscription>" --resource-group "<rg>" \
  --query "[].{name:name,id:id,location:location}" -o json
az aks show --subscription "<subscription>" --resource-group "<rg>" --name "<cluster>" \
  --query "{name:name,version:kubernetesVersion,privateAPI:apiServerAccessProfile.enablePrivateCluster}"
az aks get-versions --subscription "<subscription>" --location "<accepted-location>" -o json
az aks nodepool list --subscription "<subscription>" --resource-group "<rg>" --cluster-name "<cluster>" \
  --query "[].{name:name,mode:mode,size:vmSize,count:count,version:orchestratorVersion}" -o json
```

Version listings do not prove upgrade compatibility, actual regional capacity or permission to upgrade.
Do not replace safe projections with full configuration dumps.

## Kubernetes Observations

Use an existing approved context and namespace only when the capability grants Kubernetes reads. For example:

```bash
kubectl --context "<accepted-context>" --namespace "<namespace>" get pdb \
  -o custom-columns='NAME:.metadata.name,HEALTHY:.status.currentHealthy,DESIRED:.status.desiredHealthy,ALLOWED:.status.disruptionsAllowed'
```

Do not read Secrets, tokens, raw environment values or unrestricted logs. Namespace/config/manifest reads can
contain sensitive fields too; request only needed metadata.

## Explicit Unsupported Actions

No cluster creation or upgrade, node OS update, stop/start/reset, pool modification, role/identity changes,
`kubectl exec`/debug, port forwarding, cordon/drain, apply/patch/delete or mutation disguised as diagnostics.
Supported IaC changes belong to an existing kernel-authorized preview/Gate 4/trusted execution; Kubernetes runtime
operations without a supported executor remain blocked. Production fails closed. Do not substitute a manual command
or suggest that a generic deployment approval covers these actions.

Record command/query, producer, observation time, target scope, coverage and redactions. Submit observations through
the active task's evidence contract before calling findings accepted.
