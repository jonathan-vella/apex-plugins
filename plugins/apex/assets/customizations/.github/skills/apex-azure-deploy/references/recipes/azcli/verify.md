> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure CLI Verification

```bash
az resource list --resource-group <rg-name> --output table
```

## Health Check

```bash
# --fail-with-body makes curl exit non-zero on HTTP 4xx/5xx; pipefail keeps that failure through jq, so the block
# status is the health result. Bound the wait.
# <endpoint> is a bare host name; if the accepted output already includes https://, use it as the base URL instead.
set -o pipefail
curl --fail-with-body -sS --connect-timeout 5 --max-time 15 https://<endpoint>/health | jq .
```

## Container Apps

```bash
az containerapp revision list \
  --name <app-name> \
  --resource-group <rg-name> \
  --query "[].{name:name, active:properties.active}" \
  --output table
```

## App Service

```bash
az webapp show \
  --name <app-name> \
  --resource-group <rg-name> \
  --query "{state:state, hostNames:hostNames}"
```
