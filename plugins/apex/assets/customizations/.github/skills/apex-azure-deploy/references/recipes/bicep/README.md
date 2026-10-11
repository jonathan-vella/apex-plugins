> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Bicep Deploy Recipe

Provider command context for the native Bicep track. Only trusted APEX preview/Gate 4/deploy owns execution.

## Prerequisites

- `az` CLI installed with Bicep extension
- Accepted preparation/validation receipts match the exact artifacts, target and dependency revision
- Bicep templates exist in the project directory (co-located with `azure.yaml`)
- **Subscription and location confirmed** → See [Pre-Deploy Checklist](../../pre-deploy-checklist.md)

## Workflow

| Step | Task                                                      | Command                                 |
| ---- | --------------------------------------------------------- | --------------------------------------- |
| 1    | **[Pre-deploy checklist](../../pre-deploy-checklist.md)** | Confirm subscription/location with user |
| 2    | Build (optional)                                          | `az bicep build --file main.bicep`      |
| 3    | Deploy                                                    | `az deployment sub create`              |
| 4    | Verify                                                    | `az resource list`                      |

## Deployment Commands

### Subscription-Level Deployment

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az deployment sub create \
  --location "$AZURE_LOCATION" \
  --template-file ./main.bicep \
  --parameters ./main.parameters.json
```

### Resource Group Deployment

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az deployment group create \
  --resource-group rg-myapp-dev \
  --template-file ./main.bicep \
  --parameters ./main.parameters.json
```

### With Inline Parameters

Inline values illustrate provider syntax only. Real apply must use the exact parameter artifacts/values covered
by the approved preview, not change `environmentName` or region at execution.

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az deployment sub create \
  --location "$AZURE_LOCATION" \
  --template-file ./main.bicep \
  --parameters environmentName=dev location="$AZURE_LOCATION"
```

### What-If (Preview Changes)

An ad hoc read-only what-if is diagnostic context, not an approvable kernel preview or proof of approval:

```bash
az deployment sub what-if \
  --location "$AZURE_LOCATION" \
  --template-file ./main.bicep \
  --parameters environmentName=dev
```

## Get Deployment Outputs

```bash
# Project one accepted non-secret output by name; never dump all outputs, which can include sensitive values.
az deployment sub show \
  --name main \
  --query "properties.outputs.<accepted-output-name>.value" \
  --output tsv
```

## References

- [Verification steps](verify.md)
- [Error handling](errors.md)

## MCP Tools

| Tool                                    | Purpose                |
| --------------------------------------- | ---------------------- |
| `mcp_bicep_get_bicep_best_practices`    | Best practices         |
| `mcp_bicep_get_az_resource_type_schema` | Resource schemas       |
| `mcp_bicep_list_avm_metadata`           | Azure Verified Modules |

## AVM Verification Before Deploy

Before running deployment commands, verify generated templates followed AVM-first module selection:

1. AVM Bicep Pattern Modules (prefer AVM+AZD patterns)
2. AVM Bicep Resource Modules
3. AVM Bicep Utility Modules

If no AVM+AZD pattern module is available, fallback must remain within AVM modules (resource -> utility).

## Cleanup (DESTRUCTIVE)

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az group delete --name <rg-name> --yes
```

⚠️ Permanently deletes ALL resources in the group.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/bicep/README.md).
Load only the reference needed for the active task.
