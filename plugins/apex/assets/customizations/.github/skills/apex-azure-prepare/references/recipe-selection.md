<!-- ref:recipe-selection-v1 -->

# Recipe and Configuration Comparison

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). The accepted selected-track binding wins;
workspace detection suggests questions, not an automatic track change.

| Configuration | Useful context | Static files | Execution boundary |
| --- | --- | --- | --- |
| azd + Bicep | Azure multi-service apps, environment/service packaging | `azure.yaml`, Bicep, service files | Planned azd executor for Bicep only (CP-26, #443); not enabled today |
| azd + Terraform | Upstream context only | `azure.yaml` with `infra.provider: terraform`, HCL | Not an APEX path: DECISION-036 adds no azd Terraform adapter; native Terraform CLI with exact saved plans is the Terraform path |
| Azure CLI | Existing scripts, imperative service diagnostics, custom integration | Reviewed syntax and diagnostic queries | Read directly; mutations only through a supported bounded operation |
| Bicep | Azure-native declarative infrastructure | Bicep modules and accepted parameter binding | Current native Bicep preview/deploy track |
| Terraform | Accepted provider/module/state management | HCL, locks, backend and parameter binding | Current native saved-plan preview/deploy track |

Do not route Terraform requests through azd or imply CP-26 is delivered. `azd up` is historical upstream context
only; APEX never runs it, and provisioning and application deployment stay separate operations. See
[planned purpose-bound delivery](kernel-boundary.md#planned-purpose-bound-delivery). Unsupported paths fail closed.

## Detection and Preservation

- `*.AppHost.csproj`/`Aspire.Hosting`: preserve AppHost-derived composition; see [Aspire](aspire.md).
  `azd init --from-code -e <environment>` is a local materialization example, not an independently authorized write.
- Existing `azure.yaml`: preserve accepted service names, provider and paths; reconcile changes through the task.
- Existing HCL, Bicep or `az` scripts: preserve authorized ownership and bindings; do not regenerate user work.
- A new application: ask relevant requirements/architecture questions and bind one accepted track.

Record rationale, infrastructure provider, application host, environment handling, packaging and pipeline intent as
typed task content. Multi-cloud capability, developer convenience and learning curve are trade-offs, not approval.
Static GitHub Actions generation is not `azd pipeline config` and does not authorize identities/RBAC/settings changes.

## Technical References

- [azd](recipes/azd/README.md), [Terraform with azd (upstream context only)](recipes/azd/terraform.md)
- [Azure CLI](recipes/azcli/README.md), [Bicep](recipes/bicep/README.md),
  [Terraform](recipes/terraform/README.md)
