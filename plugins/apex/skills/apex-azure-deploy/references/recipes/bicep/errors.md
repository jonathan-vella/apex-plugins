> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> The azd Bicep executor is implemented; Bicep live runs wait for CP-30 qualification, and `azd deploy` packages and
> pipeline operations are not available. Examples do not create kernel artifacts, approvals or provider lifecycle
> authority.

# Bicep Errors

| Error             | Resolution                                    |
| ----------------- | --------------------------------------------- |
| Syntax error      | `az bicep build` to check                     |
| Missing parameter | Add to parameters file                        |
| Invalid property  | Check the accepted resource type schema       |
| Resource conflict | Check existing resources                      |
| Deployment failed | `az deployment operation group list --resource-group <rg-name> --name <name> --query "[?properties.provisioningState=='Failed']"` |
| Permission denied | Read the denied action and scope, then verify the narrowest role that grants it |

## Cleanup (DESTRUCTIVE)

Destroy is its own operation through `azd down` (see the [deploy recipe](README.md)); never delete the group directly.
It needs a fresh destroy preview and approval and permanently deletes ALL resources in the approved group.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/bicep/errors.md).
Load only the reference needed for the active task.
