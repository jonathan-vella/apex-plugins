# Cost CLI Workflow

Azure CLI procedure for cost optimization, ported from the upstream `workflow-steps.md`, `detailed-workflow-steps.md`,
`tools-and-safety.md`, `azure-redis.md` and `best-practices-notes.md`. The `apex-azure-pricing` tools stay first for
cost, forecast and price evidence; the CLI covers what they do not expose (inventory, utilization metrics, Redis
listings) and serves as a fallback when a required tool operation is unavailable.

## Command Routing

| Class | Commands | How it runs |
| --- | --- | --- |
| Local client setup | `az extension add --name costmanagement`, `az extension add --name resource-graph`, `az login` | Directly; changes only the local CLI |
| Read and diagnostic | `az account show`, `az account list`, `az resource list`, `az graph query`, `az monitor metrics list`, `az redis list`, `az redis show`, azqr scans, `az rest --method post` to the Cost Management Query API | Directly, against the approved scope. The Cost Management query is a POST but only reads |
| Changes Azure | Deletes, resizes, stops, tier or SKU changes, reservation or savings plan purchases, budgets | Never by the agent. Delivered through `apex preview`, the current runtime's Gate 4 and `apex deploy` (a CI-owned production run with human approval verified before apply is a planned target, DECISION-036) |

Read output is an observation. A finding still cites labeled evidence (see
[cost tool guardrails](cost-tool-guardrails.md#evidence-labels)), and an opportunity is never an approved action.

## Step 0: Prerequisites

- Azure CLI signed in for the intended tenant (`az login`).
- Azure CLI extensions `costmanagement` and `resource-graph`.
- Azure Quick Review (azqr) for orphan discovery, through the Azure MCP server's azqr tool or the azqr CLI.
- Roles: Cost Management Reader, Monitoring Reader, and Reader on the subscription or resource group.

```powershell
az --version
az account show
az extension show --name costmanagement
azqr version
```

## Tool Preference

Use the `apex-azure-pricing` tools first. When a required operation is unavailable, use the matching fallback API through
the already signed-in Azure CLI (`az rest`) or Azure PowerShell (`Invoke-AzRestMethod`). Prefer a native command when it
exposes the required fields. Do not fall back for invalid input, denied access, throttling or empty data.

| Workflow | Fallback API |
| --- | --- |
| Historical cost | Cost Management Query API |
| Existing-scope forecast | Cost Management Forecast API |
| AKS cost | Cost Management Query API for Kubernetes cost data |
| Public SKU or meter price | Azure Retail Prices API |
| Resource inventory or changes | Azure Resource Graph Resources API |
| Utilization metrics | Azure Monitor Metrics API |

Preserve the tool workflow's scope, period, row limits, pagination, currency and evidence labels, and state which
fallback was used. Never expose access tokens or price sheet URLs. Negotiated price sheets stay out of scope: the
shipped tools deny price sheet downloads.

Do not start a shell or interpreter only to parse or aggregate a tool response. Request server-side grouping or sorting,
or issue smaller bounded queries.

## Step 1: Redis-Specific Branch

Use the Redis branch only for an explicitly Redis-only request; a mixed request keeps the whole scope and adds Redis
signals for those caches. Reuse a confirmed scope (one subscription ID, a subscription name, a subscription prefix, all
accessible subscriptions, or tenant-wide) and ask only when it is missing or ambiguous.

```bash
# List subscriptions
az account list --output table

# List Redis caches in a subscription
az redis list --subscription <subscription-id> --output table

# Show one cache
az redis show --name <cache-name> --resource-group <rg-name> --subscription <subscription-id>
```

Redis mutation commands belong only in a separately approved remediation plan routed through `apex deploy` (Gate 4),
never in an assessment.

## Step 2: Orphan Discovery With azqr

Run azqr against the approved scope to find orphan candidates (unattached disks, unused NICs, idle NAT gateways),
over-provisioned settings (excessive retention, oversized SKUs) and missing cost tags. The scan is read-only.

```text
mcp_azure-mcp_extension_azqr
  subscription: <subscription-id>
  resource-group: <optional-rg-name>
```

An azqr result is a candidate list, not savings evidence.

## Step 3: Discover Resources

Use the Resource Graph patterns in [Azure Resource Graph cost queries](azure-resource-graph.md) for cross-subscription
discovery. For a single subscription or resource group:

```powershell
# Subscription context
az account show

# All resources in scope
az resource list --subscription "<SUBSCRIPTION_ID>" --resource-group "<RESOURCE_GROUP>"
```

## Step 4: Query Actual Costs

Query the last 30 days with `apex-azure-pricing/query_costs` first: `from` and `to` as `YYYY-MM-DD`, no time
granularity, grouped by `ResourceId`, `top` up to 5000, at subscription or resource-group scope. Label partial results.

Only when `query_costs` is unavailable, use the Cost Management Query API. Create a unique run-owned scratch directory,
never a shared `temp/` folder:

```powershell
$runTemp = Join-Path ([System.IO.Path]::GetTempPath()) ("apex-cost-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $runTemp -ErrorAction Stop | Out-Null
$queryPath = Join-Path $runTemp "cost-query.json"
```

Create `$queryPath` with the file editing tool:

```json
{
  "type": "ActualCost",
  "timeframe": "Custom",
  "timePeriod": {
    "from": "<START_DATE>",
    "to": "<END_DATE>"
  },
  "dataset": {
    "granularity": "None",
    "aggregation": {
      "totalCost": {
        "name": "Cost",
        "function": "Sum"
      }
    },
    "grouping": [
      {
        "type": "Dimension",
        "name": "ResourceId"
      }
    ]
  }
}
```

Use ISO 8601 dates for `<START_DATE>` (30 days ago) and `<END_DATE>` (today), for example `2025-11-03T00:00:00Z`.

```powershell
az rest --method post `
  --url "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.CostManagement/query?api-version=2023-11-01" `
  --body "@$queryPath"
```

Follow every `nextLink` page before using the results. Use `az rest` with a JSON body, not `az costmanagement query`.
Keep the query and response as the audit trail for the evidence the task submits.

## Step 5: Validate Pricing

Validate unit prices with `apex-azure-pricing/get_retail_prices`, following the retail pricing guidance in
`apex-azure-defaults`. Record the query parameters and the returned meter. Pricing pages are human references, not price
evidence. Check free allowances; many services have free tiers that explain a zero cost.

## Step 6: Collect Utilization Metrics

Query Azure Monitor for the last 14 days to support rightsizing:

```powershell
# Dates for the last 14 days
$startTime = (Get-Date).AddDays(-14).ToString("yyyy-MM-ddTHH:mm:ssZ")
$endTime = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"

# VM CPU utilization
az monitor metrics list `
  --resource "<RESOURCE_ID>" `
  --metric "Percentage CPU" `
  --interval PT1H `
  --aggregation Average `
  --start-time $startTime `
  --end-time $endTime

# App Service plan utilization
az monitor metrics list `
  --resource "<RESOURCE_ID>" `
  --metric "CpuTime,Requests" `
  --interval PT1H `
  --aggregation Total `
  --start-time $startTime `
  --end-time $endTime

# Storage capacity
az monitor metrics list `
  --resource "<RESOURCE_ID>" `
  --metric "UsedCapacity,BlobCount" `
  --interval PT1H `
  --aggregation Average `
  --start-time $startTime `
  --end-time $endTime
```

## Step 7: Report Content

The assessment output the task stages carries:

- Total actual cost for the scope and period, with the top cost drivers and Azure portal links.
- A cost breakdown of the top resources.
- Resources operating within free tiers.
- Orphan candidates from azqr, each pending ownership, dependency, retention and actual-cost validation.
- Ranked opportunities: high impact and low risk, medium impact and medium risk, and long-term options such as
  reservations or storage tiering. Each shows the actual baseline, actual metrics, validated pricing and estimated
  savings with its method.
- Monthly and annual estimated savings.
- Implementation as routed changes: each opportunity names the IaC change that would deliver it through
  `apex deploy` (Gate 4), never a command for the agent to run.
- The data sources: cost query and response, pricing queries and meters, and applicable free allowances.

Portal link format:

```text
https://portal.azure.com/#@<TENANT_ID>/resource/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/<RESOURCE_PROVIDER>/<RESOURCE_TYPE>/<RESOURCE_NAME>/overview
```

## Step 8: Scratch Files

Retain scratch files on success, failure and cancellation, and report their exact path. Never delete a shared temporary
root, pre-existing files or evidence automatically.

## Common Pitfalls

- **Assuming costs:** always query actual data.
- **Ignoring free tiers:** many services have generous allowances (for example the Container Apps free vCPU-seconds).
- **Wrong date ranges:** 30 days for costs, 14 days for utilization.
- **Broken portal links:** verify the tenant ID and resource ID format.
- **Cost query failures:** fix the input for validation errors. For an unavailable `query_costs`, use `az rest` with a
  JSON body, not `az costmanagement query`.

## Safety

- Every delete, resize, stop, tier change or purchase changes Azure. It needs the current runtime's Gate 4 decision
  and runs only through `apex deploy`; the agent never runs it.
- Test changes in non-production first.
- Provide dry-run or `what-if` previews (read-only) for review.
- Include rollback procedures and monitor impact after the routed change.
