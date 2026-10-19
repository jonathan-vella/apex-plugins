<!-- ref:infraops-preflight-v1 — Merged from iac-common (Issue #240) -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# InfraOps Preflight Validation

This is the APEX validation branch, not an addition to generic application plan prerequisites.
Use [accepted preflight evidence](preflight-evidence.md) and the kernel's current deployment-readiness contract.
Read actual APEX handoff/environment evidence; never manufacture a generic plan or validation proof.
Validation-only reports passed, failed, and unperformed checks and stops. Preview-only stops before apply.
Resource-group creation, backend bootstrap, code regeneration, and deployment require the owning workflow
and applicable approval; recovery examples below are not permission to mutate during validation-only.

## Azure CLI Authentication

**Always** validate CLI auth with a two-step check before any deployment:

1. `az account show` — confirms login session exists
2. `az account get-access-token --resource https://management.azure.com/` —
   confirms ARM token is valid

> `az account show` alone is NOT sufficient. MSAL token cache can be stale
> in devcontainers/WSL. See `apex-azure-defaults/references/azure-cli-auth-validation.md`
> for the full recovery procedure.

**VS Code extension auth ≠ CLI auth**: Being signed into the Azure extension
does NOT authenticate CLI commands. Always validate independently.

## Known Issues (Cross-IaC)

| Issue                                 | Workaround                                            |
| ------------------------------------- | ----------------------------------------------------- |
| MSAL token stale (devcontainer/WSL)   | `az login --use-device-code` in the **same terminal** |
| Azure extension auth ≠ CLI auth       | Validate CLI auth independently                       |
| RBAC permission errors                | Use validation-level flags to isolate                 |
| JSON parsing errors in deploy scripts | Diagnose native results; never substitute direct apply |

### Bicep-Specific

| Issue                            | Workaround                             |
| -------------------------------- | -------------------------------------- |
| What-if fails (RG doesn't exist) | Return scope/bootstrap blocker; separately preview and approve RG creation |

### Terraform-Specific

| Issue                                    | Workaround                                        |
| ---------------------------------------- | ------------------------------------------------- |
| `terraform init` fails — backend missing | Return backend ownership/bootstrap blocker |
| Backend state lock held                  | Diagnose lease/owner; never force-unlock as a preflight shortcut |
| Provider init slow                       | Set `TF_PLUGIN_CACHE_DIR`                         |
| `terraform fmt -check` fails             | Run `terraform fmt -recursive` to auto-fix        |

## Governance-to-Code Property Mapping

When translating Azure Policy `Deny` constraints to IaC:

1. Read `accepted governance evidence` for the machine-actionable policy data
2. For each `Deny` policy, extract `azurePropertyPath` + `requiredValue`
3. Translate to IaC property:
   - **Bicep**: Drop leading resource-type segment from `azurePropertyPath`
   - **Terraform**: Use translation table in `.github/instructions/references/iac-policy-compliance.md`
4. Validate against the Planner's existing mapping and discovered tag contract; do not regenerate L1/L2 mappings.
   Missing mapping returns to Planner; code mismatches return to CodeGen. Canonical fallback applies only without tag policy.

Read [governance effects](../../apex-azure-governance/SKILL.md); preserve accepted property mappings and ownership.

## Stop Rules (Both IaC Tracks)

**STOP IMMEDIATELY if:**

- Auth validation fails (`az account get-access-token` error)
- Validation errors (`bicep build` / `terraform validate`)
- Delete/Destroy operations without explicit user approval
- Unexpected material changes outside the accepted scope; summarize effects for the owning task
- User hasn't approved the deployment (blocks apply, not a requested validation-only result)
- Deprecation signals detected in preview output
