> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure CLI Errors

| Error                  | Resolution                             |
| ---------------------- | -------------------------------------- |
| Not authenticated      | `az login`                             |
| Subscription not found | `az account list`                      |
| Deployment failed      | `az deployment sub operation list --name <name>` with a failed-state query |
| Template error         | `az deployment sub validate`           |
| Permission denied      | Verify RBAC roles                      |
| Quota exceeded         | Request increase or change region      |

## Cleanup (DESTRUCTIVE)

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az group delete --name <rg-name> --yes
```

⚠️ Permanently deletes ALL resources in the group.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azcli/errors.md).
Load only the reference needed for the active task.
