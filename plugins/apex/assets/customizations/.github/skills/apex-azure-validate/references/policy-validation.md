> Managed Azure reads use verified `apex-azure` namespaces and actual command schemas.
> Other provider examples are conditional; absent tools never grant mutation or hook-bypass authority.

<!-- ref:policy-validation-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Policy Validation

## How to Validate Policies

### 1. Get Subscription ID

Retrieve your current Azure subscription ID:

```bash
az account show --query id -o tsv
```

### 2. Validate Policies

Call the Azure MCP Policy tool to retrieve policies for your subscription:

```text
apex-azure/policy({
  intent: "read policy assignments for the approved subscription",
  command: "policy_assignment_list",
  parameters: { subscription: "<subscription-id>" }
})
```

Replace `<subscription-id>` with the actual subscription ID obtained from step 1.

## Review Policy Compliance

When validating Azure policies for your subscription:

- **Check for policy violations** — Identify any resources or configurations that don't comply with assigned policies
- **Verify organizational compliance** — Ensure the planned deployment meets all organizational policy requirements
- **Address policy conflicts** — Resolve any policy issues before proceeding to deployment

## Common Policy Issues

| Issue                       | Resolution                                                             |
| --------------------------- | ---------------------------------------------------------------------- |
| Non-compliant resource SKUs | Update resource SKUs to comply with allowed values                     |
| Missing required tags       | Add required tags to resources in your infrastructure code             |
| Disallowed resource types   | Replace with allowed alternatives or request policy exception          |
| Location restrictions       | Deploy to allowed regions only                                         |
| Network security violations | Update NSG rules, firewall settings, or virtual network configurations |

## Next Steps

Only proceed to deployment after all policy violations are resolved and compliance is confirmed.
