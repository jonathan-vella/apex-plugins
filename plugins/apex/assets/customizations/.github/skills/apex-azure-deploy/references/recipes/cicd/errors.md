> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# CI/CD Errors

| Error                 | Resolution                                    |
| --------------------- | --------------------------------------------- |
| Authentication failed | Check service principal/federated credentials |
| Missing secrets       | Add required secrets to repository            |
| Missing variables     | Add required variables                        |
| Pipeline timeout      | Increase timeout or optimize deployment       |
| Approval pending      | Request approval in environment settings      |

## GitHub Actions Debugging

Check workflow logs in Actions tab for detailed error messages.

## Azure DevOps Debugging

Check pipeline run logs for detailed error messages.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/errors.md).
Load only the reference needed for the active task.
