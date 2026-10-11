# Pre-Deployment Checklist

Read [execution boundaries](execution-boundaries.md). Run readiness checks only for the recipe, target and action
provided by the active task. Preparation-only, validation-only and preview-only never authorize apply. This checklist
neither initializes projects nor deploys resources.

## 0. Resolve Recipe, Inputs and Approval

Require accepted preparation/validation receipts, commit/dependency revision, exact target and operation type.
Select [Bicep, Terraform, azd or provider-context recipes](recipes/README.md) from the task, not a new prose plan.
Missing infrastructure, manifest, package or service configuration returns to preparation. Execution also requires the
unexpired kernel preview and its current Gate 4 approval; checklist completion is not approval.

## 1. Inspect and Verify the Subscription

Read the authenticated context without token output:

```bash
az account show --query "{name:name, id:id}" -o json
```

Compare it with the accepted subscription/tenant. The default is a candidate, not confirmation. Reuse unchanged
accepted project/environment context; request a missing or changed choice with actual name and ID through the kernel.
Do not switch subscriptions as incidental recovery.

## 2. Verify the azd Environment, If Selected

Pure Bicep/Terraform tasks skip azd entirely. An azd project needs a validated `azure.yaml`, co-located provider files
and the selected environment created by authorized preparation. Never manually create `.azure/` or edit its `.env`.
`azd env new <name>` is local preparation, not a deployment preflight command; a missing environment blocks this task.
The environment often affects resource naming, so it must match the approved target.

Inspect only known non-secret context:

```bash
azd env get-value AZURE_SUBSCRIPTION_ID
azd env get-value AZURE_LOCATION
```

Do not dump all environment values or write secrets from chat. Changes to environment settings invalidate prior previews.

## 3. Check the Exact Resource Group

Never infer a resource group from an environment name for non-azd deployments:

```bash
az group show --subscription <accepted-subscription-id> --name <accepted-resource-group> \
  --query "{location:location}" -o json
```

A confirmed not-found response is absence; authorization, network and malformed-request failures are not.
If the location conflicts, request an accepted choice: reuse a compatible existing location or choose a separately
authorized target. Deleting the group is a destructive operation needing its own preview/Gate 4, not a checklist fix.

## 4. Check azd Service Tags

Within the exact target resource group, each `azure.yaml` service must resolve without conflicting
`azd-service-name` tags:

```bash
az resource list --subscription <accepted-subscription-id> --resource-group <accepted-resource-group> \
  --tag azd-service-name=<service-name> --query "[].{name:name,id:id}" -o json
```

Tags in other groups are not conflicts. Duplicates block delivery; a new environment or resource deletion changes
target/cost scope and needs renewed validation/approval. These discovery tags never replace governance-required tags.

## 5. Verify Location and Service Support

Use accepted governance/defaults and fresh service/SKU capacity evidence. Existing resource-group location is fixed.
Check [regional limitations](region-availability.md), including Static Web Apps, AKS, PostgreSQL and Azure OpenAI.
The historical tables are research starting points, not current availability proof or fallback-region selection.

## 6. Service-Specific Checks

### Container Apps: Existing Environments

```bash
az containerapp env list --subscription <accepted-subscription-id> --resource-group <accepted-resource-group> \
  --query "[].{name:name,location:location,provisioningState:properties.provisioningState}" -o json
```

An existing `Succeeded` environment may be a reuse candidate; `Failed`/`Deleting` is not. Reuse versus new environment
is a user-owned target choice that must be accepted before preview, not automatic duplicate creation.

### Container Apps and ACR: Provision Before Delivery

Verify IaC declares `AcrPull` on the registry for the intended managed identity with
`principalType: 'ServicePrincipal'`. Read [live role verification](live-role-verification.md); propagation gaps block
application delivery. Do not add role assignments manually.

The CP-26 design (azd for Bicep only) separates provisioning preview and approval from a later
service/package-digest preview and approval. It is **planned**, not executable today. Preserve this ordering
without `azd up`.

### Durable Functions: Backend Contract

Verify the accepted hosting/runtime/extension choices and orchestration backend. A Durable Task Scheduler backend
needs the endpoint, managed identity, task-hub configuration and required data-plane role; Azure Storage needs its
own supported identity-based configuration. Do not infer one from a sample or grant access during preflight.
Missing endpoint/roles/extension compatibility returns to its owning preparation task.

## 7. Non-azd Parameters and Handoff

Bicep's accepted parameter artifact and Terraform's accepted variables/workspace/backend must specify the intended
environment and region. Never override parameters or replan after approval. Return readiness observations to the task;
only the trusted lifecycle creates the approvable preview and executes the exact approved inputs.

Common mistakes: combining provision and delivery; choosing a default subscription; setting location without checking
an existing group; ignoring service-tag conflicts; treating local outputs or endpoint reachability as accepted evidence.

## Port Source

Adapted from [the upstream pre-deploy checklist](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/pre-deploy-checklist.md).
