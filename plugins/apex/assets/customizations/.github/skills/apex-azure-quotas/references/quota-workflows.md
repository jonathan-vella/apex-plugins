# Quota Workflows

Step-by-step quota workflows ported from the upstream `core-workflows.md`. First apply
[quota evidence and fallback](quota-cli-commands.md#quota-evidence-and-fallback). All scopes and candidate regions are
illustrative and must be replaced with approved values. A quota check never implies deployment or change approval.

## Workflow 1: Check Quota for One Resource

Verify the quota limit and current usage before deployment. Every command is read-only except the local extension
install.

```bash
# 1. Install the quota extension (local CLI only)
az extension add --name quota

# 2. List all quotas for the provider to find the quota resource name
az quota list \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>

# 3. Show the quota limit for one resource
az quota show \
  --resource-name standardDSv3Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>

# 4. Show current usage
az quota usage show \
  --resource-name standardDSv3Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>
```

Example analysis: a limit of 350 vCPUs with 50 in use leaves 300 vCPUs of quota headroom. Regional capacity remains
unknown.

## Workflow 2: Compare Quotas Across Regions

Compare quota headroom in the approved candidate regions. First define `quota_headroom` from
[checked headroom](quota-cli-commands.md#checked-headroom) in the same shell. SKU restrictions and allocation capacity
are separate checks. Take the candidate regions from the task context; the runtime's default and failover regions are
the usual pair.

```bash
REGIONS=("<primary-region>" "<failover-region>")
VM_FAMILY="standardDSv3Family"
SUBSCRIPTION_ID="<subscription-id>"
NEED_VCPUS="<normalized-vcpu-demand>"

for region in "${REGIONS[@]}"; do
  echo "=== Checking $region ==="

  LIMIT=$(az quota show \
    --resource-name "$VM_FAMILY" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.Compute/locations/$region" \
    --query "properties.limit.value" -o tsv) || { echo "Unknown quota: limit query failed" >&2; continue; }

  USAGE=$(az quota usage show \
    --resource-name "$VM_FAMILY" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.Compute/locations/$region" \
    --query "properties.usages.value" -o tsv) || { echo "Unknown quota: usage query failed" >&2; continue; }

  quota_headroom \
    "/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.Compute/locations/$region" \
    "$LIMIT" "$USAGE" "$NEED_VCPUS" || continue
done
```

## Workflow 3: Request a Quota Increase

Use this when current quota is insufficient for the planned deployment. The agent records the shortfall, proposes the
scope, quota name, new limit and buffer, and stops. The increase changes the subscription, so it is never run by the
agent: the human approves it and it is delivered through `apex preview`, the current runtime's Gate 4 and
`apex deploy` as a reviewed `Microsoft.Quota/quotas` change.

```bash
# Changes Azure: route through apex deploy (Gate 4) or the approved pipeline. Never run directly.
az quota update \
  --resource-name standardDSv3Family \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region> \
  --limit-object value=500 \
  --resource-type dedicated
```

After the routed change runs, checking its status is read-only:

```bash
az quota request status list \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region>
```

- Most adjustable quotas are approved within minutes.
- Some requests need manual review, which takes hours to days.
- Non-adjustable quotas need an Azure support request.

## Workflow 4: List All Quotas for Planning

Understand every quota for a resource provider in a region.

```bash
# All compute quotas in the target region
az quota list \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Compute/locations/<region> \
  --output table

# All network quotas
az quota list \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.Network/locations/<region> \
  --output table

# All Container Apps quotas
az quota list \
  --scope /subscriptions/<subscription-id>/providers/Microsoft.App/locations/<region> \
  --output table
```

Monitor usage against limits and alert at an agreed threshold, such as 80 percent. Alert rules change Azure and follow
the same routing.
