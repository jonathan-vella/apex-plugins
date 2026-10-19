<!-- ref:plan-interpretation-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform Plan Interpretation

Reading `terraform plan` output to assess impact before applying.

## Plan Commands

```bash
# Generate a plan
terraform plan -out=plan.tfplan

# Human-readable summary
terraform show plan.tfplan

# Machine-readable JSON for analysis
terraform show -json plan.tfplan > plan.json
```

## Change Type Symbols

| Symbol | Meaning         | Action                                                                       |
| ------ | --------------- | ---------------------------------------------------------------------------- |
| `+`    | Create          | New resource — assess changed attributes (exposure, cost, identity, policy)  |
| `-`    | Destroy         | Resource deleted — REVIEW before applying                                    |
| `~`    | Update in-place | Attribute change — assess the attributes (network, access, SKU, identity)    |
| `-/+`  | Destroy/Create  | Replace — causes downtime for stateful resources                             |
| `<=`   | Read            | Data source refresh — non-destructive                                        |

The action symbol alone never establishes safety; approval requires reviewing the actual changed attributes against
the accepted policy and intent.

## Red Flags in Plan Output

- `-/+` on databases, Key Vaults, storage accounts — stateful, causes data risk
- Large number of `~` changes on Application Gateway / NSG — likely Set-type phantom diff (see AVM pitfalls)
- `destroy` on resources with `prevent_destroy = true` — Terraform will error

## Plan Summary Assessment

```bash
# Quick count of changes
terraform show -json plan.tfplan | \
  python3 -c "
import json, sys
plan = json.load(sys.stdin)
changes = plan.get('resource_changes', [])
by_action = {}
for c in changes:
    a = '+'.join(c['change']['actions'])
    by_action[a] = by_action.get(a, 0) + 1
for k, v in sorted(by_action.items()): print(f'{k}: {v}')
"
```
