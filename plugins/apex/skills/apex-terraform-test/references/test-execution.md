<!-- ref:test-execution-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform Test Execution

CLI commands, parallel execution, verbose/debug modes, and diagnostics.

---

## CLI Commands

```bash
# Run all tests
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
terraform test

# Run specific test file
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
terraform test -filter=tests/defaults_unit_test.tftest.hcl

# Verbose output (shows plan/apply details)
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
terraform test -verbose

# Run tests in a custom directory
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
terraform test -test-directory=integration-tests

# Select multiple test files (not run-block names)
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
terraform test -filter=tests/defaults_unit_test.tftest.hcl -filter=tests/validation_unit_test.tftest.hcl
```

## Parallel Execution (TF 1.9+)

Run blocks execute **sequentially by default**. Enable parallel with `parallel = true`.

### Requirements

- No inter-run output references (`run.<name>` not allowed between parallel blocks)
- Different state files (via different modules or `state_key`)
- Explicit `parallel = true` attribute

```hcl
run "test_networking" {
  command  = plan
  parallel = true
  module {
    source = "./modules/networking"
  }
  assert {
    condition     = output.vnet_id != ""
    error_message = "VNet should be created"
  }
}

run "test_security" {
  command  = plan
  parallel = true
  module {
    source = "./modules/security"
  }
  assert {
    condition     = output.key_vault_id != ""
    error_message = "Key Vault should be created"
  }
}

# Synchronization point — waits for parallel runs above
run "test_integration" {
  command = plan
  assert {
    condition     = output.combined != ""
    error_message = "Integration should work"
  }
}
```

### Test-Wide Parallel

```hcl
test {
  parallel = true  # All run blocks parallel by default
}
```

## State Key Management (TF 1.9+)

Control which state file a run block uses:

```hcl
run "create_foundation" {
  command   = apply
  state_key = "foundation"
}

run "create_application" {
  command   = apply
  state_key = "foundation"  # Shares state with foundation
  variables {
    resource_group_name = run.create_foundation.resource_group_name
  }
}
```

## Diagnostics & Debugging

### Verbose Output

```bash
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
terraform test -verbose
```

Shows full plan/apply output for each run block.

### Debug Logging

```bash
# Only an authorized, explicitly selected mock/plan test; apply-mode and cleanup mutations require separate Gate 4 authorization.
TF_LOG=debug terraform test
```

Full provider-level debug output for diagnosing authentication or API issues.

## Cleanup Behavior

Resources are destroyed in **reverse run block order** after test completion.
This handles dependency ordering automatically.
Apply-mode tests require authorization for resource creation and cleanup. If cleanup fails,
inspect Terraform's reported remaining resources and state before choosing a recovery command;
do not assume an ordinary `terraform destroy` targets the test's isolated state.

```text
Run order:    setup_vpc → create_subnet → deploy_app
Cleanup:      destroy_app → destroy_subnet → destroy_vpc
```

## Troubleshooting

| Issue                     | Solution                                                |
| ------------------------- | ------------------------------------------------------- |
| Assertion failures        | Use `-verbose`, check actual vs expected                |
| Provider auth failures    | Configure credentials or use mock providers             |
| Missing dependencies      | Use sequential runs with `run.<name>` references        |
| Long execution            | Use `command = plan` where possible; use mocks          |
| State conflicts           | Use `state_key` or different modules                    |
| Unsupported module source | Only local and registry modules supported (no git/HTTP) |
| Resources not cleaned up  | Inspect reported resources/state and perform authorized recovery |

## Acceptance Test Patterns

For modules that need real Azure integration testing:

### Environment Variables

```bash
export TF_ACC=1                          # Enable acceptance tests
export ARM_SUBSCRIPTION_ID="..."          # Azure credentials
export ARM_TENANT_ID="..."
export ARM_CLIENT_ID="..."
export ARM_CLIENT_SECRET="..."
```

### Diagnostic Escalation

1. Select the failing file with `-filter=tests/<file>.tftest.hcl`
2. Use `-verbose` for detailed output
3. Use `TF_LOG=debug` for provider-level logging; redact sensitive output before sharing
4. Inspect any cleanup failures and remaining resource/state details
