> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# AZCLI Validation Errors

| Error                         | Fix                          |
| ----------------------------- | ---------------------------- |
| `AADSTS700082: Token expired` | `az login`                   |
| `Please run 'az login'`       | `az login`                   |
| `AADSTS50076: MFA required`   | `az login --use-device-code` |
| `AuthorizationFailed`         | Request Contributor role     |
| `Template validation failed`  | Check Bicep syntax           |

## Debug

```bash
az <command> --verbose --debug
```
