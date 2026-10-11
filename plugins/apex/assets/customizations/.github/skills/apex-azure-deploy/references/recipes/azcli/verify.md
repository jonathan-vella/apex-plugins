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
curl -s https://<endpoint>/health | jq .
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

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azcli/verify.md).
Load only the reference needed for the active task.
