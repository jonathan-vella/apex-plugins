> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Azure CLI Deploy Recipe

Provider command context, not an independent Azure CLI deployment track or a direct agent workflow.

## Prerequisites

- `az` CLI available through authorized setup; a missing tool blocks this task
- Accepted preparation/validation receipts match the exact inputs and target
- Bicep/ARM templates exist in the project directory
- **Subscription and location confirmed** → See [Pre-Deploy Checklist](../../pre-deploy-checklist.md)

## Workflow

| Step | Task                                                      | Command                                 |
| ---- | --------------------------------------------------------- | --------------------------------------- |
| 1    | **[Pre-deploy checklist](../../pre-deploy-checklist.md)** | Confirm subscription/location with user |
| 2    | Deploy infrastructure                                     | `az deployment sub create`              |
| 3    | Deploy application                                        | Service-specific commands               |
| 4    | Verify                                                    | `az resource list`                      |

## Infrastructure Deployment

### Subscription-Level (Recommended)

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az deployment sub create \
  --location "$AZURE_LOCATION" \
  --template-file ./main.bicep \
  --parameters environmentName=dev
```

### Resource Group Level

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az group create --name rg-myapp-dev --location "$AZURE_LOCATION"

# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az deployment group create \
  --resource-group rg-myapp-dev \
  --template-file ./main.bicep \
  --parameters environmentName=dev
```

## Application Deployment

### Container Apps

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az containerapp update \
  --name <app-name> \
  --resource-group <rg-name> \
  --image <acr-name>.azurecr.io/myapp@<accepted-image-digest>
```

### App Service

```bash
# Changes Azure — application delivery is a separate bound operation, not implicit after provision.
az webapp deploy \
  --name <app-name> \
  --resource-group <rg-name> \
  --src-path ./publish.zip
```

### Azure Functions

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
func azure functionapp publish <function-app-name>
```

## References

- [Verification steps](verify.md)
- [Error handling](errors.md)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azcli/README.md).
Load only the reference needed for the active task.
