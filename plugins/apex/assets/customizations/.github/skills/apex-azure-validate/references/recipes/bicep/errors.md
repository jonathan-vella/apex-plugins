> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Bicep Validation Errors

| Error                        | Fix                   |
| ---------------------------- | --------------------- |
| `BCP035: Invalid type`       | Check API version     |
| `BCP037: Not a member`       | Check resource schema |
| `BCP018: Expected character` | Fix syntax            |
| `Module not found`           | Check relative paths  |
| `Template validation failed` | Review error details  |

## Debug

```bash
az bicep build --file ./main.bicep 2>&1
```
