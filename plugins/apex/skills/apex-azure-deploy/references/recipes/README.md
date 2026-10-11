> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Recipes

Deployment recipes for different infrastructure approaches.

| Recipe                           | When to Use                        |
| -------------------------------- | ---------------------------------- |
| [AZD](azd/README.md)             | Azure Developer CLI projects (planned, Bicep only) |
| [AZCLI](azcli/README.md)         | Projects using Azure CLI scripts   |
| [Bicep](bicep/README.md)         | Projects using Bicep templates     |
| [Terraform](terraform/README.md) | Projects using Terraform           |
| [CI/CD](cicd/README.md)          | Pipeline-based deployments         |

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/README.md).
Load only the reference needed for the active task.
