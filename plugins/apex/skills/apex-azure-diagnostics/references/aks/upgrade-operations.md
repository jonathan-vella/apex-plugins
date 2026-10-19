> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Upgrade Operations

Use this guide when node image rotation, Kubernetes version changes, or node-pool upgrade settings appear to be the
failure domain.

## Node Image / OS Upgrade Issues

> ⚠️ **Warning:** `az aks nodepool upgrade` and `az aks nodepool update --max-surge ...` change cluster state. During
> diagnostics, do not recommend or run upgrade actions by default. Only surface these commands after the user explicitly
> approves remediation or confirms the change window / change-control context.

```bash
# Check current node image versions
az aks nodepool show -g <rg> --cluster-name <cluster> -n <nodepool> \
  --query "{nodeImageVersion:nodeImageVersion, osType:osType}"

# Check available upgrades
az aks nodepool get-upgrades -g <rg> --cluster-name <cluster> --nodepool-name <nodepool>

# Upgrade node image (non-disruptive with surge)
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az aks nodepool upgrade -g <rg> --cluster-name <cluster> -n <nodepool> --node-image-only
```

---

## Kubernetes Version Upgrade Failures

**Pre-upgrade check:**

```bash
# Check for deprecated API usage before upgrading
kubectl get --raw /metrics | grep apiserver_requested_deprecated_apis

# Verify available upgrade paths (can only skip one minor version)
az aks get-upgrades -g <rg> -n <cluster> -o table
```

**Upgrade stuck or failed:**

```bash
# Check control plane provisioning state
az aks show -g <rg> -n <cluster> --query "provisioningState"

# If stuck: check AKS diagnostics blade in portal
# Azure Portal -> AKS cluster -> Diagnose and solve problems -> Upgrade
```

Common causes: PDB blocking drain (`kubectl get pdb -A`), deprecated APIs in use, custom admission webhooks failing
(`kubectl get validatingwebhookconfiguration`).

---

## Zero-Downtime Node Pool Upgrades

`maxSurge` controls how many extra nodes are provisioned during upgrade.

```bash
# Check current maxSurge
az aks nodepool show -g <rg> --cluster-name <cluster> -n <nodepool> \
  --query "upgradeSettings.maxSurge"

# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az aks nodepool update -g <rg> --cluster-name <cluster> -n <nodepool> \
  --max-surge 33%
```

**Upgrade stuck / nodes not draining:**

```bash
kubectl get pdb -A
kubectl describe pdb <pdb-name> -n <ns>
```

If `DisruptionsAllowed: 0`, scale up the workload or temporarily relax `minAvailable`.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/aks/upgrade-operations.md).
Load only the reference needed for the active task.
