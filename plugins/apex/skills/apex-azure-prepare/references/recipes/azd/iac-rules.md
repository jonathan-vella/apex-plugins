> Managed Azure reads use verified `apex-azure` namespaces and actual command schemas.
> Other provider examples are conditional; absent tools never grant mutation or hook-bypass authority.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# AZD IAC Rules

## Navigation

- AVM Module Selection Order (MANDATORY)
- Retrieval Strategy (Hybrid: azure-documentation MCP + Context7)
- Validation Plan
- File Structure
- Naming Convention
- Required Tags
- Module Parameters
- Security
- Recommended Outputs
- Templates

IaC rules for AZD projects. For Bicep, the managed provider supplies `apex-azure/bicepschema` with `bicepschema_get`;
pass a bounded intent and `parameters["resource-type"]`. A separate Bicep provider's best-practices/catalog tools are
conditional and not granted by this namespace. Use verified documentation and the accepted module-version lookup
boundary for missing guidance. For Terraform, use `apex-azure/azureterraformbestpractices` with
`azureterraformbestpractices_get` first; then apply these azd-specific rules.

## AVM Module Selection Order (MANDATORY)

Always prefer modules in provider-specific order:

For **Bicep**:

1. AVM Bicep Pattern Modules (AVM+AZD first when available)
2. AVM Bicep Resource Modules
3. AVM Bicep Utility Modules

For **Terraform**:

1. AVM Terraform Pattern Modules
2. AVM Terraform Resource Modules
3. AVM Terraform Utility Modules

If no pattern module exists for the active provider, default immediately to AVM modules in the same provider order
(resource, then utility) instead of using non-AVM modules.

## Retrieval Strategy (Hybrid: azure-documentation MCP + Context7)

- **Primary (authoritative):** Use `apex-azure/documentation` with `microsoft_docs_search` for current Azure guidance and
  AVM integration documentation.
- **Module catalog (conditional):** A separate Bicep catalog provider needs its own active grant. Otherwise use the
  accepted module-version lookup boundary and official documentation; `bicepschema_get` is a schema read, not a catalog.
- **Secondary (conditional):** Context7 is not part of the managed Azure grant. When `apex-azure/documentation` does
  not provide enough detail, record the gap; use a separate provider only if the active task explicitly grants it.

## Validation Plan

Before finalizing generated guidance:

1. Verify the selected module path uses the required AVM order above.
2. Verify AVM+AZD pattern modules were checked first, and fallback moved to AVM resource/utility modules when no pattern
   module exists.
3. Verify Terraform guidance follows pattern -> resource -> utility ordering.
4. Include selected module names and source links in the plan/output for traceability.

## File Structure

| Requirement | Details                                                  |
| ----------- | -------------------------------------------------------- |
| Location    | `.` (project root) folder                                |
| Entry point | `main.bicep` with `targetScope = 'subscription'`         |
| Parameters  | `main.parameters.json`                                   |
| Modules     | `./modules/*.bicep` with `targetScope = 'resourceGroup'` |

## Naming Convention

> ⚠️ **Before generating any resource name in Bicep, check
> [Resource naming rules](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-name-rules) for
> that resource type's valid characters, length limits, and uniqueness scope.** Some resources forbid dashes or special
> characters, require globally unique names, or have short length limits. Adapt the pattern below accordingly.

**Default pattern:** `{resourceAbbreviation}-{name}-{uniqueHash}`

For resources that disallow dashes, omit separators: `{resourceAbbreviation}{name}{uniqueHash}`

- [Resource abbreviations](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)
  — recommended prefixes per resource type

```bicep
var resourceSuffix = take(uniqueString(subscription().id, environmentName, location), 6)
// Adapt separator/format per resource naming rules
var defaultName = '${name}-${resourceSuffix}'
var alphanumericName = replace('${name}${resourceSuffix}', '-', '')
```

**Forbidden:** Hard-coded tenant IDs, subscription IDs, resource group names

## Required Tags

| Tag                | Apply To          | Value                        |
| ------------------ | ----------------- | ---------------------------- |
| `azd-env-name`     | Resource group    | `{environmentName}`          |
| `azd-service-name` | Hosting resources | Service name from azure.yaml |

## Module Parameters

All modules must accept: `name` (string), `location` (string), `tags` (object)

## Security

| Rule             | Details                  |
| ---------------- | ------------------------ |
| No secrets       | Use Key Vault references |
| Managed Identity | Least privilege          |
| Diagnostics      | Enable logging           |
| API versions     | Use latest               |

## Recommended Outputs

`azd` reads `output` values from `main.bicep` and stores UPPERCASE names as environment variables (accessible via
`azd env get-values` ).

| Output                              | When                     |
| ----------------------------------- | ------------------------ |
| `AZURE_RESOURCE_GROUP`              | Always (required)        |
| `AZURE_CONTAINER_REGISTRY_ENDPOINT` | If using containers      |
| `AZURE_KEY_VAULT_NAME`              | If using secrets         |
| `AZURE_LOG_ANALYTICS_WORKSPACE_ID`  | If using monitoring      |
| `API_URL`, `WEB_URL`, etc.          | One per service endpoint |

## Templates

**main.bicep:**

```bicep
targetScope = 'subscription'

param environmentName string
param location string

var resourceSuffix = take(uniqueString(subscription().id, environmentName, location), 6)
var tags = { 'azd-env-name': environmentName }

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module resources './modules/resources.bicep' = {
  name: 'resources'
  scope: rg
  params: { location: location, tags: tags }
}

// Outputs — UPPERCASE names become azd env vars
output AZURE_RESOURCE_GROUP string = rg.name
output API_URL string = resources.outputs.apiUrl
```

**Child module:**

```bicep
targetScope = 'resourceGroup'

param name string
param location string = resourceGroup().location
param tags object = {}

var resourceSuffix = take(uniqueString(subscription().id, resourceGroup().name, name), 6)
```

> ⚠️ **Container resources:** CPU must use `json()` wrapper: `cpu: json('0.5')`, memory as string: `memory: '1Gi'`
