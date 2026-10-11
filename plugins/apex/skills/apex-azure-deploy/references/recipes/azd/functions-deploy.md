> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure Functions Deployment

Deployment workflows for Azure Functions using AZD.

## Prerequisites

- Azure Functions project prepared with azd template
- `azure.yaml` exists and validated
- Accepted preparation/validation receipts for the exact target, source and package inputs
- Explicit approval for the selected AZD operation, exact target/artifacts and current recipe-aware preflight
- Azure Functions Core Tools (optional, for local debugging or when using `func` commands outside azd workflows)

## AZD Deployment

### Combined Deployment Is Not Supported

```bash
# Upstream combined azd up removed: APEX never runs it.
# Planned (CP-26, Bicep only): provision preview -> approval -> bound provision;
# separate service/package-digest preview -> approval -> bound deploy.
```

### Infrastructure Only

```bash
# Provision infrastructure without deploying code
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
azd provision --no-prompt
```

### Application Only

```bash
# Deploy code to existing infrastructure
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
azd deploy --no-prompt
```

### Preview Changes

```bash
# Preview changes before deployment
azd provision --preview
```

## Environment Configuration

### Set AZD Environment Variables

These are for azd provisioning, not application runtime:

```bash
set -euo pipefail
: "${AZURE_LOCATION:?Approved region is required}"
: "${VNET_ENABLED:?Approved network setting is required}"
azd env set AZURE_LOCATION "$AZURE_LOCATION"
azd env set VNET_ENABLED "$VNET_ENABLED"
```

Do not change either value during recovery without approval and revalidation. Production data services retain
private access under governance. Preparation-only and preview-only requests never run deployment commands above.

> ⚠️ **Important**: `azd env set` sets variables for the azd provisioning process, NOT application environment variables.

## Verify Deployment

### Check Function App Status

```bash
# Show deployment details
azd show
```

## Testing HTTP Endpoints

> ⚠️ **Never use `curl -I` (HEAD) to test Azure Functions endpoints.**
>
> Azure Functions `[HttpTrigger]` with `"get"` does **not** automatically handle HEAD requests. HEAD returns 404 from
> the routing layer even when GET works correctly, causing false-negative results and misdirected debugging.

### ✅ DO — Use GET with output suppression

```bash
# Check status code only (GET, don't follow redirects)
curl -s -o /dev/null -w "%{http_code}" "https://<func-name>.azurewebsites.net/api/<route>"

# Get status code and redirect URL
curl -s -o /dev/null -w "Status: %{http_code}\nRedirect: %{redirect_url}" "https://<func-name>.azurewebsites.net/api/<route>"

# Verbose output showing response headers (GET)
curl -sS -D - -o /dev/null "https://<func-name>.azurewebsites.net/api/<route>"
```

### ❌ DON'T — Use HEAD requests

```bash
# DO NOT use this — returns 404 even when the function works
curl -I "https://<func-name>.azurewebsites.net/api/<route>"
```

## Monitoring

Monitor your Functions deployment through Azure Portal or use azd to view deployment status.

### Common Issues

1. **Deployment timeout**: Preserve a failed/indeterminate outcome and follow kernel reconciliation; never retry
   combined deployment
2. **Missing dependencies**: Ensure package.json/requirements.txt is correct and committed
3. **Function not appearing**: Check azure.yaml service configuration
4. **Cold start issues**: Compare hosting options against accepted workload/SKU decisions; a SKU change needs new validation/preview

## CI/CD Integration

For automated deployments with azd, see [cicd/README.md](../cicd/README.md) for GitHub Actions and Azure DevOps integration.

## Data Loss Warning

> ⚠️ **CRITICAL: `azd down` Data Loss Warning**
>
> `azd down` **permanently deletes ALL resources** in the environment, including:
>
> - **Function Apps** with all configuration and deployment slots
> - **Storage accounts** with all blobs and files
> - **Key Vault** with all secrets (use `--purge` to bypass soft-delete)
> - **Databases** with all data (Cosmos DB, SQL, etc.)
>
> **Best practices:**
>
> - Preview and approve the exact supported operation; azd provisioning remains CP-26 planned/unqualified
> - Use separate environments for dev/staging/production
> - Back up important data before running `azd down`

## Next Steps

After deployment:

1. Verify functions are running
2. Test endpoints
3. Monitor Application Insights
4. Request separately authorized alerts/monitoring configuration if not covered by the accepted operation

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/functions-deploy.md).
Load only the reference needed for the active task.
