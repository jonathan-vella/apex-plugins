<!-- ref:test-patterns-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform Test Patterns

Extended test patterns beyond the core examples in SKILL.md.

---

## Unit Test Patterns (Plan Mode)

### Testing Module Outputs

```hcl
run "test_module_outputs" {
  command = plan

  assert {
    condition     = output.vnet_id != null
    error_message = "VNet ID output must be defined"
  }

  assert {
    condition     = can(regex("^/subscriptions/", output.vnet_id))
    error_message = "VNet ID should be a valid Azure resource ID"
  }

  assert {
    condition     = length(output.subnet_ids) >= 2
    error_message = "Should output at least 2 subnet IDs"
  }
}
```

### Testing Data Sources

```hcl
run "test_client_config" {
  command = plan

  assert {
    condition     = data.azurerm_client_config.current.tenant_id != ""
    error_message = "Should resolve tenant ID"
  }
}
```

### Testing Validation Rules

```hcl
# Test that valid input passes
run "test_valid_environment" {
  command = plan
  variables { environment = "staging" }
  assert {
    condition     = var.environment == "staging"
    error_message = "Valid environment should be accepted"
  }
}

# Test that invalid input is rejected
run "test_invalid_environment" {
  command = plan
  variables { environment = "invalid" }
  expect_failures = [var.environment]
}
```

### Complex Conditions

Check every prefix, not a textual prefix or only the first subnet range. Both
network endpoints must fall inside the allowed IPv4 parent `10.0.0.0/8`.
For a different governed parent, change the mask and network in both comparisons.

```hcl
run "test_all_subnets_in_vnet_range" {
  command = plan
  assert {
    condition = alltrue([
      for subnet in azurerm_subnet.this :
      length(subnet.address_prefixes) > 0 && alltrue([
        for prefix in subnet.address_prefixes : try(
          cidrhost("${cidrhost(prefix, 0)}/8", 0) == "10.0.0.0" &&
          cidrhost("${cidrhost(prefix, -1)}/8", 0) == "10.0.0.0",
          false
        )
      ])
    ])
    error_message = "Every subnet prefix must be a valid IPv4 CIDR contained in 10.0.0.0/8"
  }
}
```

### Sequential Tests with Dependencies

```hcl
run "setup_resource_group" {
  command = apply
  variables {
    project     = "test"
    environment = "dev"
    location    = "swedencentral"
  }
  assert {
    condition     = output.resource_group_id != ""
    error_message = "Resource group should be created"
  }
}

run "test_vnet_in_resource_group" {
  command = plan
  variables {
    resource_group_name = run.setup_resource_group.resource_group_name
    location            = "swedencentral"
  }
  assert {
    condition     = azurerm_virtual_network.this.resource_group_name == run.setup_resource_group.resource_group_name
    error_message = "VNet should be in the setup resource group"
  }
}
```

## Integration Test Patterns (Apply Mode)

### Full Stack Test

```hcl
run "integration_full_stack" {
  # command defaults to apply
  variables {
    project     = "integration-test"
    environment = "test"
    location    = "swedencentral"
  }

  assert {
    condition     = azurerm_resource_group.this.id != ""
    error_message = "Resource group should be created"
  }

  assert {
    condition     = azurerm_virtual_network.this.id != ""
    error_message = "VNet should be created"
  }

  assert {
    condition     = length(azurerm_subnet.this) == 2
    error_message = "Should create 2 subnets"
  }
}
# Resources are destroyed automatically in reverse order
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Terraform Tests
on:
  pull_request:
    branches: [main]

jobs:
  apex-terraform-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<reviewed-full-commit-SHA>
      - uses: hashicorp/setup-terraform@<reviewed-full-commit-SHA>
        with:
          terraform_version: "1.9"
      - run: terraform init -backend=false -lockfile=readonly
      - run: terraform fmt -check -recursive
      - run: terraform validate
      # Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
      - run: terraform test -filter=tests/defaults_unit_test.tftest.hcl -verbose
```

This is a static offline-unit-test sketch: replace action placeholders with reviewed full commit SHAs and the
Terraform version with the accepted toolchain. The selected file must explicitly use mocks and plan mode.
No Azure credentials or apply/cleanup runs belong in this job. Live integration needs a separately supported bounded
operation, the current Gate 4 and exact preview binding; CI job identity (OIDC) or an environment pause is not human
approval. CI-owned production flows (CP-28 and CP-29) are not shipped.

### GitLab CI

```yaml
apex-terraform-test:
  image: hashicorp/terraform:1.9
  stage: test
  before_script:
    - terraform init -backend=false -lockfile=readonly
  script:
    - terraform fmt -check -recursive
    - terraform validate
    # Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
    - terraform test -filter=tests/defaults_unit_test.tftest.hcl -verbose
  only:
    - merge_requests
    - main
```

## Testing AVM Modules

When testing Azure Verified Modules, include:

1. **Plan-mode unit tests** for naming, tags, conditional resources
2. **Expect_failures tests** for all validation rules
3. **Mock tests** for complex logic without Azure access
4. **Integration tests** only through an explicitly supported authorized operation; CI credentials are not Gate 4

```hcl
# Test AVM module via registry
run "test_avm_key_vault" {
  command = plan
  module {
    source  = "Azure/avm-res-keyvault-vault/azurerm"
    version = "0.11.0"
  }
  variables {
    name                = "kv-test-dev-a1b2"
    resource_group_name = "rg-test"
    location            = "swedencentral"
    tenant_id           = "00000000-0000-0000-0000-000000000000"
  }
  assert {
    condition     = output.resource_id != ""
    error_message = "Key Vault should be created"
  }
}
```
