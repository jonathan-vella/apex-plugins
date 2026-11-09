> Managed Azure reads use verified `apex-azure` namespaces and actual command schemas.
> Other provider examples are conditional; absent tools never grant mutation or hook-bypass authority.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# AZD Recipe

## Navigation

- When to Use
- IaC Provider Options
- Before Generation
- Generation Steps
- Outputs
- References
- Next

Azure Developer CLI workflow for preparing Azure deployments.

## When to Use

- New projects, multi-service apps, want separate provisioning and service deployment
- Need environment management, auto-generated CI/CD
- Team prefers simplified deployment workflow

> 💡 **Tip:** azd supports both Bicep and Terraform as IaC providers. Choose based on your team's expertise and requirements.

## IaC Provider Options

| Provider            | Use When                                                    |
| ------------------- | ----------------------------------------------------------- |
| **Bicep** (default) | Azure-only, no existing IaC, want simplest setup            |
| **Terraform**       | Multi-cloud IaC, existing TF expertise, want azd simplicity |

**For Terraform with azd:** See [terraform.md](terraform.md)

## Before Generation

**REQUIRED: Research best practices before generating any files.**

### Check for Existing Codebase Patterns

**⚠️ CRITICAL: For existing codebases with special patterns, use `azd init --from-code -e <environment-name>` instead of
manual generation.**

| Pattern                 | Detection                                      | Action                                                                          |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| **.NET Aspire**         | `*.AppHost.csproj` or `Aspire.Hosting` package | Use `azd init --from-code -e <environment-name>` → [aspire.md](../../aspire.md) |
| **Existing azure.yaml** | `azure.yaml` present                           | MODIFY mode - update existing config                                            |
| **New project**         | No azure.yaml, no special patterns             | Manual generation (steps below)                                                 |

> 💡 **Note:** The `-e <environment-name>` flag is **required** when running `azd init --from-code` in non-interactive
> environments (agents, CI/CD pipelines). Without it, the command will fail with a prompt error.

### References for Manual Generation

| Artifact                  | Reference                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| azure.yaml                | [Schema Guide](azure-yaml.md)                                                                         |
| .NET Aspire projects      | [Aspire Guide](../../aspire.md)                                                                       |
| Terraform with azd        | [Terraform Guide](terraform.md)                                                                       |
| AZD IAC rules             | [IAC Rules](iac-rules.md)                                                                             |
| Azure Functions templates | [Templates](../../services/functions/templates/README.md)                                             |
| Bicep best practices      | `apex-azure/documentation`, command `microsoft_docs_search`, bounded intent and `parameters.query` |
| Bicep resource schema     | `apex-azure/bicepschema`, command `bicepschema_get`, bounded intent and `parameters["resource-type"]` |
| Azure Verified Modules    | [AVM module order](iac-rules.md#avm-module-selection-order-mandatory); a separate Bicep catalog provider is conditional, not granted |
| Terraform best practices  | `apex-azure/azureterraformbestpractices`, command `azureterraformbestpractices_get` |
| Dockerfiles               | [Docker Guide](docker.md)                                                                             |

## Generation Steps

### For Bicep (default)

| #   | Artifact         | Reference                                              |
| --- | ---------------- | ------------------------------------------------------ |
| 1   | azure.yaml       | [Schema Guide](azure-yaml.md)                          |
| 2   | Application code | Entry points, health endpoints, config                 |
| 3   | Dockerfiles      | [Docker Guide](docker.md) (if containerized)           |
| 4   | Infrastructure   | `./main.bicep` + modules per [IAC Rules](iac-rules.md) |

### For Terraform

| #   | Artifact                                    | Reference                                    |
| --- | ------------------------------------------- | -------------------------------------------- |
| 1   | azure.yaml with `infra.provider: terraform` | [Terraform Guide](terraform.md)              |
| 2   | Application code                            | Entry points, health endpoints, config       |
| 3   | Dockerfiles                                 | [Docker Guide](docker.md) (if containerized) |
| 4   | Terraform files                             | `./*.tf` per [Terraform Guide](terraform.md) |

## Outputs

### For Bicep

| Artifact       | Path                                          |
| -------------- | --------------------------------------------- |
| azure.yaml     | `./azure.yaml`                                |
| App Code       | `src/<service>/*`                             |
| Dockerfiles    | `src/<service>/Dockerfile` (if containerized) |
| Infrastructure | `.` (Bicep files, co-located with azure.yaml) |

### For Terraform

| Artifact       | Path                                              |
| -------------- | ------------------------------------------------- |
| azure.yaml     | `./azure.yaml` (with `infra.provider: terraform`) |
| App Code       | `src/<service>/*`                                 |
| Dockerfiles    | `src/<service>/Dockerfile` (if containerized)     |
| Infrastructure | `.` (Terraform files, co-located with azure.yaml) |

## References

- [.NET Aspire Projects](../../aspire.md)
- [azure.yaml Schema](azure-yaml.md)
- [.NET Aspire Apps](aspire.md)
- [Terraform with AZD](terraform.md)
- [Docker Configuration](docker.md)
- [IAC Rules](iac-rules.md)

## Next

→ Update `accepted preparation artifacts` → **apex-azure-validate**
