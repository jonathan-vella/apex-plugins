> MCP names in this reference are upstream pseudo-interfaces, not current vNext tool registrations.
> Use only capabilities projected by the active task; unavailable tools are blockers, never substitutes.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# AZCLI Validation

Validation steps for Azure CLI deployments.

## Prerequisites

- Working directory is the project's IaC folder, `infra/bicep/{project}/` (never the repository root)
- `./main.bicep` exists
- Docker available (if containerized)

## Validation Steps

### 1. Azure CLI Installation

Verify Azure CLI is installed:

```bash
az version
```

**If not installed:**

```text
mcp_azure-mcp_extension_cli_install(cli-type: "az")
```

### 2. Authentication

```bash
az account show
```

**If not logged in:**

```bash
az login
```

**Set subscription:**

```bash
# Changes Azure/state: provider syntax only; use apex preview, local Gate 4 and apex deploy. Never run directly.
az account set --subscription <subscription-id>
```

### 3. Bicep Compilation

```bash
az bicep build --file ./main.bicep
```

### 4. Template Validation

```bash
# Subscription scope
az deployment sub validate \
  --location <location> \
  --template-file ./main.bicep \
  --parameters ./main.parameters.json

# Resource group scope
az deployment group validate \
  --resource-group <rg-name> \
  --template-file ./main.bicep \
  --parameters ./main.parameters.json
```

### 5. What-If Preview

```bash
# Subscription scope
az deployment sub what-if \
  --location <location> \
  --template-file ./main.bicep \
  --parameters ./main.parameters.json

# Resource group scope
az deployment group what-if \
  --resource-group <rg-name> \
  --template-file ./main.bicep \
  --parameters ./main.parameters.json
```

### 6. Docker Build (if containerized)

```bash
docker build -t <image>:test ./src/<service>
```

### 7. Azure Policy Validation

See [Policy Validation Guide](../../policy-validation.md) for instructions on retrieving and validating Azure policies
for your subscription.

## References

- [Error handling](./errors.md)

## Next

Return results to **apex-azure-validate**. Validation-only stops;
deployment continuation follows its workflow and approval rules.
