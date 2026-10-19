> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> The azd Bicep executor is implemented; Bicep live runs wait for CP-30 qualification, and `azd deploy` packages and
> pipeline operations are not available. Examples do not create kernel artifacts, approvals or provider lifecycle
> authority.

# Bicep Deploy Recipe

Provider command context for the Bicep track, which runs only through azd. Only trusted APEX preview/Gate 4/deploy
owns execution; azd is bound to the accepted `azure.yaml`, infrastructure tree, parameters, azd environment, pinned azd
version and Azure identity. Hooks and extensions are trusted (DECISION-037) and listed in the approval material.
Azure Deployment Stacks are not used, so there is no deny-settings protection or unmanage cleanup.

## Prerequisites

- `azd` at the exact version bundled with APEX, and `az` signed in to the approved cloud, tenant and subscription
- Accepted preparation/validation receipts match the exact artifacts, target and dependency revision
- The generated azd project (`azure.yaml`, `infra/main.bicep`) is the project root configured for the provider
- The approved resource group exists and carries the tag `azd-env-name=<environment>`; azd finds an environment's
  resources through that tag
- **Subscription and location confirmed** → See [Pre-Deploy Checklist](../../pre-deploy-checklist.md)

## Workflow

| Step | Task                                                      | Command                                 |
| ---- | --------------------------------------------------------- | --------------------------------------- |
| 1    | **[Pre-deploy checklist](../../pre-deploy-checklist.md)** | Confirm subscription/location with user |
| 2    | Build (optional)                                          | `bicep build infra/main.bicep --stdout` |
| 3    | Preview                                                   | `azd provision --preview`               |
| 4    | Deploy                                                    | `azd provision`                         |
| 5    | Verify                                                    | `az resource list`                      |

## Commands

APEX runs these itself with explicit `--environment`, `--cwd` and `--no-prompt`, after an identity preflight. They are
context only; never run them as a shortcut. APEX never runs `azd up`.

```bash
# Read-only prediction (azd's what-if): a bounded preview against live Azure state, not an immutable plan.
azd provision --preview --no-state --environment dev --cwd "$PROJECT_ROOT" --no-prompt --output json

# Changes remote state — context only; fresh preview + current Gate 4 + trusted execution required.
# --no-state always deploys the approved Bicep instead of skipping on azd's stored deployment state.
azd provision --no-state --environment dev --cwd "$PROJECT_ROOT" --no-prompt

# Changes remote state, DESTRUCTIVE — separate preview and approval. Deletes the whole approved resource group.
# --force replaces the prompt with the Gate 4 approval; --purge is never used, so soft-deleted resources remain.
azd down --force --environment dev --cwd "$PROJECT_ROOT" --no-prompt
```

Values that `main.parameters.json` resolves at provision time (for example azd functions that read Key Vault) are not
part of the preview. Provisioning and application-package delivery are separate operations; `azd deploy` packages are
not available yet.

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

Destroy is its own operation: `azd down` deletes the entire approved resource group, so its preview lists every
resource in the group and blocks when any is not accepted managed ownership. It needs a fresh preview and approval.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/bicep/README.md).
Load only the reference needed for the active task.
