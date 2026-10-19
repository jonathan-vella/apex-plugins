> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# CI/CD Verification

Check pipeline run status:

- **GitHub**: Actions tab → workflow run
- **Azure DevOps**: Pipelines → pipeline run

## Verify Deployed Resources

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

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/verify.md).
Load only the reference needed for the active task.
