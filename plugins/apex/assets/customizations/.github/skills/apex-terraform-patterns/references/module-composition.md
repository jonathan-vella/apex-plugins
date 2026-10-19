<!-- ref:module-composition-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Module Composition — Canonical Example

> Loaded by `apex-terraform-patterns` SKILL.md when authoring or auditing a
> root module. Demonstrates the AVM-first composition pattern: pass
> outputs as inputs, never hardcode IDs.

Example pins: Resource Group `0.4.0` (locally cached module metadata) and Key Vault
`0.11.0` (matching the example below and the AVM provider-compatibility table). These are not a claim of
latest versions. For generated projects, retain the exact versions approved in
the plan; validate inputs and outputs against those versions before generation.
The fragment assumes the root variables, client-config data source, governed
tags and suffix-based names have already been declared.

```hcl
module "resource_group" {
  source  = "Azure/avm-res-resources-resourcegroup/azurerm"
  version = "0.4.0"
  name     = "rg-${var.project}-${var.environment}"
  location = var.location
  tags     = local.tags
}

module "key_vault" {
  source  = "Azure/avm-res-keyvault-vault/azurerm"
  version = "0.11.0"
  name                = local.kv_name
  resource_group_name = module.resource_group.name
  location            = var.location
  tenant_id           = data.azurerm_client_config.current.tenant_id
  tags                = local.tags
}
```

**Why this pattern**:

- `module.<name>.<output>` wiring keeps the dependency graph explicit and lets Terraform
  parallelize unrelated modules.
- Hardcoding IDs (`/subscriptions/…/resourceGroups/foo`) breaks reuse and re-creates a
  resource if a parent rename happens.
- Exact module pins preserve the reviewed interface. Module upgrades require
  renewed plan approval; provider constraints and the lockfile are separate.
- `local.tags` and `var.location` come from the project-level `locals` block, making the
  module body environment-agnostic.

The same wiring pattern applies to networking, monitoring and identity. Use each
approved module's actual output names; do not infer them from provider arguments.
