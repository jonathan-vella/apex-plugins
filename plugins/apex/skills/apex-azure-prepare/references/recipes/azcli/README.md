> Managed Azure reads use verified `apex-azure` namespaces and actual command schemas.
> Other provider examples are conditional; absent tools never grant mutation or hook-bypass authority.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# AZCLI Recipe

Azure CLI workflow for imperative Azure deployments.

## When to Use

- Existing az scripts in project
- Need imperative control over deployment
- Custom deployment pipelines
- AKS deployments
- Direct resource manipulation

## Before Generation

**REQUIRED: Research best practices before generating any files.**

| Artifact             | Research Action                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Bicep files          | Verified `apex-azure/documentation` guidance; `apex-azure/bicepschema` with `bicepschema_get` for resource schemas |
| Bicep modules        | Follow [AVM module order](../azd/iac-rules.md#avm-module-selection-order-mandatory); a separate Bicep catalog provider is conditional, not granted |
| Azure CLI commands   | Call `activate_azure_cli_management_tools`                                                                                 |
| Azure best practices | `apex-azure/get_azure_bestpractices`, command `get_azure_bestpractices_get`, parameters `{resource: "general", action: "code-generation"}` |

## Generation Steps

### 1. Generate Infrastructure (Bicep)

Create Bicep templates in the project directory (co-located with `azure.yaml`).

**Structure:**

```text
infra/
├── main.bicep
├── main.parameters.json
└── modules/
    └── *.bicep
```

### 2. Generate Deployment Scripts

Create deployment scripts for provisioning.

→ [scripts.md](scripts.md)

### 3. Generate Dockerfiles (if containerized)

Manual Dockerfile creation required.

## Output Checklist

| Artifact      | Path                                  |
| ------------- | ------------------------------------- |
| Main Bicep    | `./infra/main.bicep`                        |
| Parameters    | `./infra/main.parameters.json`              |
| Modules       | `./infra/modules/*.bicep`                   |
| Deploy script | `./infra/scripts/deploy.sh` or `deploy.ps1` |
| Dockerfiles   | `src/<service>/Dockerfile`            |

## Deployment Commands

See [commands.md](commands.md) for common patterns.

## Naming Convention

Resources: `{prefix}{token}{instance}`

- Alphanumeric only, no special characters
- Prefix ≤3 chars (e.g., `kv` for Key Vault)
- Token = 5 char random string
- Total ≤32 characters

## References

- [Deployment Commands](commands.md)
- [Deployment Scripts](scripts.md)

## Next

→ Update `accepted preparation artifacts` → **apex-azure-validate**
