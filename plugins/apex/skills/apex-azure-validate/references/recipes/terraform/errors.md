> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform Validation Errors

| Error                       | Fix                             |
| --------------------------- | ------------------------------- |
| `Backend init failed`       | Check storage account access    |
| `Provider version conflict` | Update required_providers       |
| `State lock failed`         | Wait; diagnose lease/owner. Never force-unlock; recover through the authorized ownership/recovery path |
| `Validation failed`         | Check terraform validate output |

## Debug

```bash
TF_LOG=DEBUG terraform plan
```
