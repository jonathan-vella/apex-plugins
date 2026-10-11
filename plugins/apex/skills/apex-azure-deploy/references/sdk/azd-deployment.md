# Azure Developer CLI Reference

Read [execution boundaries](../execution-boundaries.md). azd provider guidance remains useful, but CP-26 support is
**planned**. Do not claim these commands are implemented APEX tracks or run mutations directly.

## Setup and Authentication

Tool installation/authentication requires the owning setup task and supported host. Prefer a reviewed package-manager
installation (for example `winget install microsoft.azd` on an appropriate host); do not pipe a remote installer into
a shell. Confirm required provider versions and read authenticated context without exposing tokens or secrets.
An upstream `azd auth login` example is interactive setup, not an incident/deployment fallback.

## Local Project Preparation

Under authorized preparation, `azd init` creates provider configuration; `azd env new` selects an environment and
`azd env set` changes local inputs. These actions may alter deployment/package inputs and invalidate old previews.
Do not manually edit azd-produced `.azure/<env>/.env`, dump all values or pass secrets from chat.

Read only named non-secret context keys:

```bash
azd env get-value AZURE_SUBSCRIPTION_ID
azd env get-value AZURE_LOCATION
```

## Lifecycle and Pipelines

Use [the planned azd recipe](../recipes/azd/README.md): provision preview → approval → bound provision; then a
separate service/package-digest approval → bound deploy. APEX never runs `azd up`. `azd pipeline config` has remote
Azure/Entra/GitHub setting side effects and needs its own preview and approval through trusted deployment.
Static workflow files are separate CodeGen output; they do not authorize production CI apply, which is planned
(CP-28, DECISION-036) and not available.
azd Terraform provisioning replans before apply, so native Terraform saved-plan/apply remains authoritative and the
azd provider path blocks. `azd deploy --preview` and `--from-package` cannot combine; pipeline config has no native
preview. azd is planned for Bicep only (CP-26); none of this is implemented runtime support.

## Provider Best Practices

- Validate `azure.yaml` service language, host, project path, output directory and the required `azd-service-name`
  discovery tag. The tag supplements, never replaces, policy-required tags.
- Match build and target architecture. `remoteBuild` may be appropriate for cross-architecture builds, but is a
  task-selected option whose resulting package identity and side effects need to be covered.
- Bicep outputs populate azd environment context. Missing outputs (especially Aspire limited mode registry and UAMI
  identifiers) return to the provider owner; do not mutate generated environment files to bypass preview checks.
- Hooks execute code and can change SQL, roles, data and packages. Review every hook and bind covered side effects
  explicitly; uncovered work is a separate operation. Never mask failures with blanket `|| true`.
- Use identity/Key Vault references instead of keys and plaintext environment secrets. Scope least-privilege grants
  through accepted IaC; “already exists” requires a checked idempotent result, not ignored errors.
- Preserve diagnostics visibly without exposing secrets; long-running provision/delivery may be partial or
  indeterminate. Follow kernel reconciliation rather than automatic retry.

## Port Source

Adapted from [the upstream azd SDK reference](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/sdk/azd-deployment.md).
