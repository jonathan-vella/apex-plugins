<!-- ref:bootstrap-backend-template-v1 -->

# Terraform Backend Bootstrap Requirements

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). Preserve backend security and ownership requirements;
an environment authorization flag is not an APEX decision. Do not run an upstream bootstrap script.

## Accepted Inputs

Require the exact subscription, RG/account/container names and owners, location, replication SKU, network mode,
effective policy tags and intended state key. Existing resources are not assumed workload-owned.
Use the [canonical tag precedence](../../apex-azure-defaults/references/tag-precedence.md).
Private endpoint/DNS and runner connectivity are separate accepted dependencies.

## Security and Permissions

- StorageV2, HTTPS-only, minimum TLS 1.2, no public blob access, no shared-key access and OAuth by default.
- Disable public network access for production data services; verify approved private connectivity.
- Require the appropriate management-plane permissions and Storage Blob Data Contributor for container/state access.
  Role assignment is a separate authorized operation, not an implicit bootstrap step.
- Stop on RBAC, network, policy and propagation failures. Never fall back to keys or treat a failed lookup as absence.
- Idempotent provider calls may still update existing settings; preview those effects and preserve native diagnostics.

The syntax retained for accepted backend binding is:

```hcl
terraform {
  backend "azurerm" {
    use_azuread_auth = true
    # RG/account/container/key are supplied by the accepted backend binding.
  }
}
```

The approved CLI, managed identity or OIDC principal must have the required access. Do not configure `access_key`,
SAS or connection strings as fallback. `ARM_USE_AZUREAD=true` is a backend auth setting, not mutation authorization.

Backend resource/container creation goes through an accepted infrastructure binding, `apex preview`, Gate 4
and `apex deploy`. Missing bootstrap capability is a blocker. Bootstrap approval does not authorize state migration,
initialization, import or workload deployment.
