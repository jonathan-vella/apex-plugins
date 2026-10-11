> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# AZD Errors

## Deployment Runtime Errors

These are upstream provider errors from provisioning, packaging and service delivery. APEX never runs the combined
`azd up`; CP-26 remains planned/unqualified. Diagnosis may collect reads, but fixes need their owning task.

| Error                                                                     | Cause                                                          | Resolution                                                                                                                                                               |
| ------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `unknown flag: --location`                                                | Location is not an apply-time override                       | Accept the region during authorized preparation, then renew validation/preview; never use combined deployment |
| Provision failed                                                          | Bicep template errors                                          | Check detailed error in output                                                                                                                                           |
| Deploy failed                                                             | Build or Docker errors                                         | Check build logs                                                                                                                                                         |
| Package failed                                                            | Missing Dockerfile or deps                                     | Verify Dockerfile exists and dependencies                                                                                                                                |
| Quota exceeded                                                            | Subscription limits                                            | Request increase or change region                                                                                                                                        |
| `could not determine container registry endpoint`                         | Missing `AZURE_CONTAINER_REGISTRY_ENDPOINT`                    | See [Missing Container Registry Variables](#missing-container-registry-variables)                                                                                        |
| `map has no entry for key "AZURE_CONTAINER_REGISTRY_MANAGED_IDENTITY_ID"` | Missing managed identity env vars                              | See [Missing Container Registry Variables](#missing-container-registry-variables)                                                                                        |
| `map has no entry for key "MANAGED_IDENTITY_CLIENT_ID"`                   | Missing managed identity client ID                             | See [Missing Container Registry Variables](#missing-container-registry-variables)                                                                                        |
| `found '2' resources tagged with 'azd-service-name: <name>'`              | Duplicate-tagged resources in the exact target RG            | Return to the owner; changing target or deleting conflicts requires new validation/preview/Gate 4 |

> ℹ️ **Pre-flight validation**: Run `apex-azure-validate` before deployment to catch configuration errors early. See
> [Pre-Deploy Checklist](../../pre-deploy-checklist.md).

| Error                                                                                              | Cause                                                              | Resolution                                                    |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| `PrincipalId '...' has type 'ServicePrincipal', which is different from specified PrincipalType 'User'` | A template assigns roles to the deploying identity with `principalType: 'User'`, but CI/CD deploys as a service principal | See [Principal Type Mismatch](#principal-type-mismatch) |
| `Operation expired` or a Container App revision timeout (about 900 s)                             | The app's managed identity doesn't have `AcrPull` on the registry yet | See [Container App Revision Timeout](#container-app-revision-timeout) |

## Principal Type Mismatch

Many azd templates assign roles to the deploying user with a hard-coded
`principalType: 'User'`, often behind an `allowUserIdentityPrincipal` flag. In
CI/CD the deploying identity is a service principal, so provisioning fails.

Report it to the IaC owner: parameterize `principalType` (see
[SQL
auth](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-prepare/references/services/sql-database/auth.md))
or set the template's `allowUserIdentityPrincipal` flag to `false` for service principal deployments. Clearing
`AZURE_PRINCIPAL_ID` with `azd env set` has no effect, because azd repopulates it from the current sign-in.

## Container App Revision Timeout

**Symptom:** provisioning succeeds, then revision creation times out and the
Container App shows `Failed` with no active revision.

**Upstream combined-command cause:** `azd up` provisions and deploys in one run; it is never used by APEX. The revision
pulls the image before the new `AcrPull` assignment has propagated, which can take several minutes.

**Check (read-only):**

```bash
az containerapp show --name <app-name> --resource-group <resource-group> \
  --query "{provisioningState:properties.provisioningState, latestRevision:properties.latestRevisionName}" -o json
PRINCIPAL_ID=$(az containerapp identity show --name <app-name> --resource-group <resource-group> --query principalId -o tsv)
az role assignment list --scope "$(az acr show --name <acr-name> --resource-group <resource-group> --query id -o tsv)" \
  --assignee-object-id "$PRINCIPAL_ID" --query "[].roleDefinitionName" -o tsv
```

**Resolution:** report missing/propagating roles and preserve the provider outcome. Any retry is a kernel decision
with a current exact operation/approval; no direct `azd deploy` retry. The IaC owner must declare `AcrPull` with
`principalType: 'ServicePrincipal'`; role changes need preview/Gate 4/trusted deployment.
Use the [two-phase design](../../pre-deploy-checklist.md#container-apps-and-acr-provision-before-delivery),
subject to CP-26's unqualified boundaries.

## Missing Container Registry Variables

**Symptom:** Errors during `azd deploy` about missing container registry or managed identity environment variables:

```text
ERROR: could not determine container registry endpoint, ensure 'registry' has been set in the docker options or 'AZURE_CONTAINER_REGISTRY_ENDPOINT' environment variable has been set
```

Or:

```text
ERROR: failed executing template file: template: manifest template:6:14: executing "manifest template" at <.Env.AZURE_CONTAINER_REGISTRY_MANAGED_IDENTITY_ID>: map has no entry for key "AZURE_CONTAINER_REGISTRY_MANAGED_IDENTITY_ID"
```

Or:

```text
ERROR: failed executing template file: template: manifest template:39:26: executing "manifest template" at <.Env.MANAGED_IDENTITY_CLIENT_ID>: map has no entry for key "MANAGED_IDENTITY_CLIENT_ID"
```

**Cause:** This typically occurs with .NET Aspire projects using azd "limited mode" (in-memory infrastructure generation
without explicit `infra/` folder). The `azd provision` command creates the Azure Container Registry and Managed Identity
resources but doesn't automatically populate the environment variables that `azd deploy` needs to reference them.

> Verify required outputs during accepted preparation before the separate delivery operation. No environment-variable
> workaround proves preview fidelity or guarantees deployment success.

**Solution:**

The upstream workaround below illustrates environment fields. The preparation owner must resolve exact accepted
registry/identity IDs, never choose `[0]` from a resource listing. Setting fields invalidates prior previews:

```bash
# Get the resource group name (typically rg-{environment-name})
azd env get-value AZURE_SUBSCRIPTION_ID

# Set container registry endpoint
azd env set AZURE_CONTAINER_REGISTRY_ENDPOINT $(az acr list --resource-group <resource-group-name> --query "[0].loginServer" -o tsv)

# Set managed identity resource ID
azd env set AZURE_CONTAINER_REGISTRY_MANAGED_IDENTITY_ID $(az identity list --resource-group <resource-group-name> --query "[0].id" -o tsv)

# Set managed identity client ID
azd env set MANAGED_IDENTITY_CLIENT_ID $(az identity list --resource-group <resource-group-name> --query "[0].clientId" -o tsv)
```

**PowerShell:**

```powershell
# Set container registry endpoint
azd env set AZURE_CONTAINER_REGISTRY_ENDPOINT (az acr list --resource-group <resource-group-name> --query "[0].loginServer" -o tsv)

# Set managed identity resource ID
azd env set AZURE_CONTAINER_REGISTRY_MANAGED_IDENTITY_ID (az identity list --resource-group <resource-group-name> --query "[0].id" -o tsv)

# Set managed identity client ID
azd env set MANAGED_IDENTITY_CLIENT_ID (az identity list --resource-group <resource-group-name> --query "[0].clientId" -o tsv)
```

After authorized input correction, request new validation/preview and a kernel retry decision. Provider context only:

```bash
# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
azd deploy --no-prompt
```

> Preserve native-provider output ownership; don't manually edit generated files or invent missing identities.

## Retry

Never retry from this skill. An indeterminate operation first needs reconciliation; supported retry needs renewed
bound authority. CP-26's Terraform replan/package-preview/pipeline-config limitations remain blockers.

```bash
# Upstream combined azd up removed: APEX never runs it.
# Planned (CP-26, Bicep only): provision preview -> approval -> bound provision;
# separate service/package-digest preview -> approval -> bound deploy.
```

## Cleanup (DESTRUCTIVE)

```bash
# Changes Azure — destructive provider context only; no direct cleanup or automatic purge.
azd down --force --purge
```

⚠️ Permanently deletes ALL resources including databases and Key Vaults.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/errors.md).
Load only the reference needed for the active task.
