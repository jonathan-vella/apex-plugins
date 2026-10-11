> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Terraform Deploy Recipe

Explain the native Terraform saved-plan lifecycle. Do not substitute azd provisioning: its Terraform `Deploy()`
replans before apply and violates exact-plan authority. That provider path is planned/unqualified and blocked.

## Prerequisites

- Terraform CLI installed
- Accepted preparation and validation receipts match the task's artifacts, target and dependency revision
- Terraform initialized (`terraform init`)
- The trusted preview creates the saved plan to be approved; an ad hoc plan is not Gate 4 evidence
- **Subscription and location confirmed** → See [Pre-Deploy Checklist](../../pre-deploy-checklist.md)

## Workflow

| Step | Task                                                      | Command                                 |
| ---- | --------------------------------------------------------- | --------------------------------------- |
| 1    | **[Pre-deploy checklist](../../pre-deploy-checklist.md)** | Confirm subscription/location with user |
| 2    | Verify accepted workspace/backend                         | No post-approval workspace switching    |
| 3    | Trusted apply after current Gate 4                           | Applies the exact saved approved plan   |
| 4    | Get safe named outputs                                    | Never dump sensitive outputs            |
| 5    | Application delivery                                      | Separate authorized operation           |

## Deployment Commands

### Apply the Exact Saved Plan (Required)

Provider command context only. The kernel creates the approvable preview and binds the exact plan bytes:

```bash
terraform plan -out=tfplan
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
terraform apply tfplan
```

### Variables, Targeting and CI

Set accepted variables, region, backend and workspace **before** creating the preview. Upstream
`terraform apply -auto-approve`, apply-time `-var` changes and apply-time `-target` are rejected APEX patterns:
they replan or substitute the approved operation. A targeted change, when supported, needs a separately validated
saved plan and a new approval decision. CI executes only a plan approved under the current runtime's gates;
CI-owned production apply with human approval verified before apply is planned (CP-28), not available. No flag
bypasses approval.

## Get Outputs

```bash
# Read only the accepted non-secret endpoint output.
terraform output -raw api_url
```

## Application Deployment

Infrastructure success does not approve image build/push or app update. These provider command shapes describe
separate remote mutations; bind an immutable image digest, not `latest`, in their own operation:

```bash
ACR_NAME=$(terraform output -raw acr_name)
APP_NAME=$(terraform output -raw container_app_name)
RG_NAME=$(terraform output -raw resource_group_name)

# Changes Azure — context only; requires its own approved operation.
az acr build --registry "$ACR_NAME" --image <accepted-image-tag> ./src/api

# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
az containerapp update \
  --name $APP_NAME \
  --resource-group $RG_NAME \
  --image "$ACR_NAME.azurecr.io/myapp@<accepted-image-digest>"
```

## References

- [Verification steps](verify.md)
- [Error handling](errors.md)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/terraform/README.md).
Load only the reference needed for the active task.
