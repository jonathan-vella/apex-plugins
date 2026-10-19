> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Key Vault

Centralized secrets, keys, and certificate management.

## When to Use

- Storing application secrets
- Managing certificates
- Storing encryption keys
- Centralizing secret management
- Enabling secret rotation

## Required Supporting Resources

| Resource         | Purpose                     |
| ---------------- | --------------------------- |
| None required    | Key Vault is self-contained |
| Private Endpoint | Secure access (optional)    |

## SKU Selection

| SKU      | Features                |
| -------- | ----------------------- |
| Standard | Software-protected keys |
| Premium  | HSM-protected keys      |

## RBAC Roles

| Role                           | Permissions         |
| ------------------------------ | ------------------- |
| Key Vault Administrator        | Full access         |
| Key Vault Secrets Officer      | Manage secrets      |
| Key Vault Secrets User         | Read secrets        |
| Key Vault Certificates Officer | Manage certificates |
| Key Vault Crypto Officer       | Manage keys         |

## Environment Variables

| Variable         | Value                                   |
| ---------------- | --------------------------------------- |
| `KEY_VAULT_URL`  | `https://{vault-name}.vault.azure.net/` |
| `KEY_VAULT_NAME` | Vault name                              |

## Best Practices

1. **Always use RBAC** over access policies
2. **Enable soft delete and purge protection** for production
3. **Use managed identities** instead of storing keys in apps
4. **Set expiration dates** on secrets
5. **Use separate vaults** for different environments

## References

- [Bicep Patterns](bicep.md)
- [SDK Access](sdk.md)
