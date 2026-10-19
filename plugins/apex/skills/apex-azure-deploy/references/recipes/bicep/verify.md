> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> The azd Bicep executor is implemented; Bicep live runs wait for CP-30 qualification, and `azd deploy` packages and
> pipeline operations are not available. Examples do not create kernel artifacts, approvals or provider lifecycle
> authority.

# Bicep Verification

```bash
az resource list --resource-group <rg-name> --output table
```

## Get Deployment Outputs

```bash
# Project one accepted non-secret output by name; never dump all outputs, which can include sensitive values.
az deployment group show \
  --resource-group <rg-name> \
  --name <azd-deployment-name> \
  --query "properties.outputs.<accepted-output-name>.value" \
  --output tsv
```

## Health Check

```bash
# --fail-with-body makes curl exit non-zero on HTTP 4xx/5xx; pipefail keeps that failure through jq, so the block
# status is the health result. Bound the wait.
# <endpoint> is a bare host name; if the accepted output already includes https://, use it as the base URL instead.
set -o pipefail
curl --fail-with-body -sS --connect-timeout 5 --max-time 15 https://<endpoint>/health | jq .
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/bicep/verify.md).
Load only the reference needed for the active task.
