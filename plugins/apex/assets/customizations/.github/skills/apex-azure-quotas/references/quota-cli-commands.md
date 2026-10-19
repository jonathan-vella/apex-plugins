# Azure Quota CLI Commands

Reference for the Azure CLI `quota` extension, ported from the upstream `commands.md` and `advanced-commands.md`.
Every scope below is illustrative: substitute the approved subscription, provider and region, never the CLI default.

## Command Routing

| Class | Commands | How it runs |
| --- | --- | --- |
| Local client setup | `az extension add --name quota`, `az login`, `az account set` | Directly; changes only the local CLI |
| Read and diagnostic | `az quota list`, `az quota show`, `az quota usage list`, `az quota usage show`, `az quota request status list`, `az quota request status show`, `az quota operation list`, `az vm list-usage` | Directly, against the approved scope |
| Changes Azure | `az quota update`, `az quota create`, `az provider register` | Never by the agent. Deliver as a reviewed `Microsoft.Quota/quotas` change through `apex preview`, the current runtime's Gate 4 and `apex deploy` (a CI-owned production run with human approval verified before apply is a planned target, DECISION-036) |

Read-command output is an observation. A typed capacity decision still cites accepted quota evidence from
`apex/taskContext`.

## Prerequisites

- Azure CLI 2.50 or later, signed in with `az login` for the intended tenant.
- The quota extension, installed once:

  ```bash
  az extension add --name quota
  ```

- `Reader` to view quotas. Submitting increases needs `Quota Request Operator`, held by the identity that runs the
  routed change, not by the agent.

## Quota Evidence and Fallback

Use the CLI first with the confirmed subscription, provider and region. Keep limit and usage from the same scope, quota
name, units and collection window. Normalize demand first: instance count times vCPUs per instance, including surge.
Check both the VM-family and the total regional vCPU quota. Other quotas use their own units.

1. Discover names with `az quota list`; fetch limit and usage with the commands below.
2. On command failure, do not calculate. Classify scope or argument, authorization, registration, throttling or
   unsupported-resource errors from the actual diagnostics. `BadRequest` alone does not prove an unsupported provider.
   Repair a malformed scope before retrying; registration or permission changes are routed changes.
3. For confirmed unsupported types, consult
   [service limits](https://learn.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits)
   and a documented service-specific usage command for the same subscription and region. For Compute:
   `az vm list-usage --subscription <subscription-id> --location <region>`. If current usage cannot be established,
   report headroom as unknown. Published defaults are not observed subscription limits. The portal or a support request
   may clarify or handle an approved request; REST against the same provider is not a coverage bypass.
4. Missing, nonnumeric, `No Limit` or `Unlimited` values are unknown evidence, never zero or proof of unlimited quota.
   Preserve the diagnostic and source.
5. Sufficient headroom is quota-only. Check SKU restrictions and regional capacity separately; even an unrestricted SKU
   listing does not guarantee allocation.

### Checked Headroom

Define this Bash helper before the region-comparison workflow. It validates nonnegative integral quota units, rejects
missing evidence and reports quota only. Exit 0 means sufficient quota, 1 insufficient quota, 2 invalid or unknown
evidence.

```bash
quota_headroom() {
  local scope="$1" limit="$2" usage="$3" need="$4"
  if [[ ! "$scope" =~ ^/subscriptions/[[:xdigit:]]{8}-[[:xdigit:]]{4}-[[:xdigit:]]{4}-[[:xdigit:]]{4}-[[:xdigit:]]{12}/providers/Microsoft\.[[:alnum:]]+/locations/[[:alnum:]-]+$ ]]; then
    echo "Unknown quota: invalid scope" >&2
    return 2
  fi
  local value
  for value in "$limit" "$usage" "$need"; do
    if [[ ! "$value" =~ ^[0-9]{1,9}$ ]]; then
      echo "Unknown quota: expected nonnegative integer units" >&2
      return 2
    fi
  done
  local remaining=$((10#$limit - 10#$usage - 10#$need))
  echo "Quota remaining after demand: $remaining; regional capacity: unknown"
  ((remaining >= 0))
}
```

## Resource Name Mapping

No one-to-one mapping exists between ARM resource types and quota names. Always discover names with `az quota list`.

1. List all quotas: `az quota list --scope /subscriptions/<subscription-id>/providers/<Provider>/locations/<region>`.
2. Match `properties.name.localizedValue` to the resource type.
3. Use the exact `name` value in later commands.

| ARM type | Quota names |
| --- | --- |
| `Microsoft.App/managedEnvironments` | `ManagedEnvironmentCount` |
| `Microsoft.Compute/virtualMachines` | `standardDSv3Family`, `cores`, `virtualMachines` |
| `Microsoft.Network/publicIPAddresses` | `PublicIPAddresses`, `IPv4StandardSkuPublicIpAddresses` |

## Command Summary

| Command | Description | Class |
| --- | --- | --- |
| [az quota list](#az-quota-list) | List all quota limits for a scope | Read |
| [az quota show](#az-quota-show) | Show the quota limit for one resource | Read |
| [az quota usage list](#az-quota-usage-list) | List current usage for all resources | Read |
| [az quota usage show](#az-quota-usage-show) | Show current usage for one resource | Read |
| [az quota request status list](#az-quota-request-status-list) | List quota requests for a scope | Read |
| [az quota request status show](#az-quota-request-status-show) | Show one quota request | Read |
| [az quota operation list](#az-quota-operation-list) | List Microsoft.Quota operations | Read |
| [az quota update](#az-quota-update) | Request a quota increase | Changes Azure |
| [az quota create](#az-quota-create) | Create a quota limit (advanced) | Changes Azure |

## az quota list

List all quota limits for a scope. Use this first to discover quota resource names.

```bash
az quota list --scope SCOPE [--max-items N] [--next-token TOKEN]
```

`--scope` is the Azure resource URI `/subscriptions/<subscription-id>/providers/<Provider>/locations/<region>`.

```bash
# List compute quotas
az quota list --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>

# List network quotas
az quota list --scope /subscriptions/<subscription-id>/providers/Microsoft.Network/locations/<region>

# Table format
az quota list --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region> --output table
```

Key output fields: `name` (the quota resource name used in other commands), `properties.name.localizedValue` (the
human-readable description) and `properties.limit.value` (the limit).

## az quota show

Show the quota limit for one resource.

```bash
az quota show --resource-name NAME --scope SCOPE
```

```bash
# Get the DSv3 family vCPU limit
az quota show \
  --resource-name standardDSv3Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>
```

Key output fields: `properties.limit.value`, `properties.name.localizedValue` and `properties.quotaPeriod` (the reset
period, for example `P1M` for one month).

## az quota usage list

List current usage for all resources in a scope.

```bash
az quota usage list --scope SCOPE [--max-items N] [--next-token TOKEN]
```

```bash
# List compute usage
az quota usage list --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>

# Table format
az quota usage list --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region> --output table
```

`properties.usages.value` is the current usage count. Combine it with `az quota show` to calculate headroom.

## az quota usage show

Show current usage for one resource.

```bash
az quota usage show \
  --resource-name standardDSv3Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>
```

Calculate quota headroom:

1. Limit: `az quota show --resource-name <name> --scope <scope>`.
2. Usage: `az quota usage show --resource-name <name> --scope <scope>`.
3. Headroom is limit minus usage; remaining after demand is limit minus usage minus need.

Example: a limit of 350 vCPUs with 12 in use leaves 338 vCPUs of quota headroom. Regional capacity remains unknown.

## az quota request status list

List quota requests for a one-year period. Filter with OData on `requestSubmitTime` (`ge`, `le`, `eq`),
`provisioningState` (`eq`) or `resourceName` (`eq`).

```bash
az quota request status list --scope SCOPE [--filter FILTER] [--max-items N] [--next-token TOKEN] [--skip-token TOKEN] [--top N]
```

```bash
# List compute quota requests
az quota request status list --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>

# List network quota requests
az quota request status list --scope /subscriptions/<subscription-id>/providers/Microsoft.Network/locations/<region>
```

## az quota request status show

Show one quota request by ID. The ID comes from the routed `az quota update` or `Microsoft.Quota/quotas` change.

```bash
az quota request status show \
  --id <request-id> \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>
```

## az quota operation list

List all operations the `Microsoft.Quota` resource provider supports.

```bash
az quota operation list --output table
```

## az quota update

Request a quota increase. This changes the subscription's quota. The agent proposes the target scope, quota name, new
limit and buffer; the human approves it, and it is delivered through `apex deploy` (Gate 4).

```bash
az quota update --resource-name NAME --scope SCOPE --limit-object value=N [--resource-type TYPE] [--no-wait]
```

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Increase FSv2 family vCPUs to 100
az quota update \
  --resource-name standardFSv2Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region> \
  --limit-object value=100 \
  --resource-type dedicated

# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Non-blocking request
az quota update \
  --resource-name standardFSv2Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region> \
  --limit-object value=100 \
  --no-wait true
```

`--resource-type` takes values such as `dedicated` or `lowPriority`. Most adjustable quotas are approved within minutes;
some need manual review that takes hours or days, and non-adjustable quotas need an Azure support request.

## az quota create

Create a quota limit for a resource. Rarely used; `az quota update` is the usual request.

```bash
az quota create --resource-name NAME --scope SCOPE --limit-object value=N [--resource-type TYPE]
```

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Create a network quota
az quota create \
  --resource-name MinPublicIpInterNetworkPrefixLength \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Network/locations/<region> \
  --limit-object value=10 \
  --resource-type MinPublicIpInterNetworkPrefixLength

# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
# Create a Machine Learning quota
az quota create \
  --resource-name TotalLowPriorityCores \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.MachineLearningServices/locations/<region> \
  --limit-object value=10 \
  --resource-type lowPriority
```

## Troubleshooting

Apply [quota evidence and fallback](#quota-evidence-and-fallback) to every failure; this table classifies errors
without defining a second procedure.

| Error | Cause | Resolution |
| --- | --- | --- |
| `No Limit` or `Unlimited` | Missing numeric quota evidence | Report unknown; follow the fallback |
| REST API failure | Scope, permission, throttling or coverage error | Classify the diagnostics; the same provider is not a coverage bypass |
| `ExtensionNotFound` | Quota extension not installed | `az extension add --name quota` |
| `BadRequest` | Invalid arguments or scope, or an unsupported resource | Validate the scope first; use the documented fallback only when unsupported is confirmed |
| `MissingRegistration` | `Microsoft.Quota` not registered | Registration changes the subscription: propose it as a routed change |
| `QuotaExceeded` | Deployment would exceed quota | Propose a routed increase or a region decision; neither guarantees capacity |
| `InvalidScope` | Incorrect scope format | Use `/subscriptions/<id>/providers/<namespace>/locations/<region>` |

Coverage is specific to resource type, region, subscription and API version. Do not treat a static provider catalog as
proof of support. For Cosmos DB, consult [Cosmos DB limits](https://learn.microsoft.com/azure/cosmos-db/concepts-limits).
Unavailable evidence remains unknown, not unlimited capacity.
