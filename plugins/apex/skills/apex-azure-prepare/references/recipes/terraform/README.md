> MCP names in this reference are upstream pseudo-interfaces, not current vNext tool registrations.
> Use only capabilities projected by the active task; unavailable tools are blockers, never substitutes.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform Recipe

Terraform workflow for Azure deployments.

> **Native Terraform CLI is the Terraform path.** DECISION-036 keeps two IaC languages and adds no azd Terraform
> adapter; azd is the planned executor for Bicep only (CP-26, #443). Use this recipe for Terraform work, bind one
> accepted track, and never run `azd up`.

## When to Use This Recipe

Use this recipe whenever the accepted selected-track binding is Terraform:

- Exact saved-plan preview and apply with normal backend locking and unchanged dependencies
- Multi-cloud or module-heavy Terraform workspaces and existing Terraform CI/CD
- Any Terraform request, including Azure-first multi-service apps; deployment of application services stays a
  separate operation from provisioning

The [azd with Terraform](../azd/terraform.md) page is upstream context for reading existing `azure.yaml` files only.
## Before Generation

**REQUIRED: Research best practices before generating any files.**

| Artifact             | Research Action                                  |
| -------------------- | ------------------------------------------------ |
| Terraform patterns   | Call `mcp_azure-mcp_azureterraformbestpractices` |
| Azure best practices | Call `mcp_azure-mcp_get_azure_bestpractices` |

## Generation Steps

### 1. Generate Infrastructure

Create Terraform files in `./infra/`.

→ [patterns.md](patterns.md)

**Structure:**

```text
infra/
├── main.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars
├── backend.tf
└── modules/
    └── ...
```

### 2. Set Up State Backend

Azure Storage for remote state.

### 3. Generate Dockerfiles (if containerized)

Manual Dockerfile creation required.

## Output Checklist

| Artifact    | Path                       |
| ----------- | -------------------------- |
| Main config | `./infra/main.tf`          |
| Variables   | `./infra/variables.tf`     |
| Outputs     | `./infra/outputs.tf`       |
| Values      | `./infra/terraform.tfvars` |
| Backend     | `./infra/backend.tf`       |
| Modules     | `./infra/modules/`         |
| Dockerfiles | `src/<service>/Dockerfile` |

## References

- [Terraform Patterns](patterns.md)

## Next

→ Update `accepted preparation artifacts` → **apex-azure-validate**
