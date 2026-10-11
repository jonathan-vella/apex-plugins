# Azure Developer CLI Quick Reference

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](../kernel-boundary.md). azd is the planned executor for Bicep only (CP-26, #443); it is
not implemented, and it is never a Terraform executor.

## Setup and Context

Use the supported host's reviewed azd installer; do not pipe a downloaded script into a shell as a preparation shortcut.
azd authentication is separate from Azure CLI authentication:

```bash
azd auth login --check-status
azd show
azd env list
```

If authentication is missing, the user signs in to the intended tenant. `azd init` and
`azd init --from-code -e <environment>` write local configuration and require an authorized materialization capability.

## Separate Operations

```bash
# Read-only provisioning preview; accepted kernel preview evidence is still required.
azd provision --preview

# Provider syntax only: Changes Azure. Planned CP-26 runtime (Bicep only); not enabled today.
# azd provision

# Changes Azure: planned CP-26 operation, separate from provisioning; not enabled today.
# azd deploy --service <accepted-service>

# Changes Entra/RBAC/GitHub settings: operator-owned setup; the agent never runs it.
# azd pipeline config
```

Historical upstream quick starts used `azd up`; APEX never runs that composite command.
azd Terraform provisioning replans inside `Deploy()` before `Apply()`; it cannot execute an existing exact-approved
Terraform saved plan, and DECISION-036 adds no azd Terraform adapter. Terraform uses the native CLI.
Current `azd deploy --preview` cannot combine with `--from-package`; `azd pipeline config` has no native preview.
These are CP-26 design constraints, not exceptions to approval or package-digest authority.

## Configuration Guidance

- Evaluate `remoteBuild: true` where local architecture differs from the target; verify the accepted build/package
  environment rather than applying it blindly.
- Bicep outputs populate azd environment configuration. Do not hand-edit generated values or infer accepted facts
  from `.azure/<environment>/.env`.
- Preserve `azd-service-name` resource tags for Container Apps service discovery; these are optional service metadata,
  not a replacement for the effective required tag contract.
- Prefer managed identity, Key Vault secret references and OIDC. Do not store secrets in parameter defaults,
  `azure.yaml`, environment transcripts or workflow files.
- Hooks are reviewable source, not a bypass. Never use blanket error suppression for RBAC/policy failures.
  Observe existing assignments, distinguish absence from read failure, and stop on unexpected provider results.
- Static OIDC workflow generation is not identity/federation/RBAC setup. OIDC job identity is not human approval:
  CI-owned production runs (CP-28) and setup (CP-29) are planned, and the current runtime gates stay enforced.
