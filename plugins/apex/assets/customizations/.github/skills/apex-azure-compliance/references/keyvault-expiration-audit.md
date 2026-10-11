# Key Vault Expiration Audit Commands

Key Vault expiration audit procedure and CLI commands ported from the upstream `azure-keyvault-expiration-audit.md`.
Every command lists or shows metadata only and may run directly against the approved vault. Never retrieve secret
values, including the secrets that back certificates.

## Audit Patterns

| Pattern | Use for |
| --- | --- |
| Single-vault quick scan | One vault, with a configurable day threshold (default 30 days) |
| Multi-vault compliance report | Quarterly audits and organization-wide checks across a subscription |
| Resource-type focus | Keys only, secrets only, or certificates only (renewal planning, rotation tracking) |
| Emergency expired finder | Already expired items (negative days) during an incident |

Use metadata-only list operations for keys, secrets and certificates. Follow every page, and use version-list metadata
when version coverage is requested. Verify an installed tool's output contract before use; an unknown tool operation is
not a metadata-safe substitute. Report denied or incomplete coverage explicitly.

## Commands

When the client provides the Azure MCP Key Vault tools (`keyvault_key_list`, `keyvault_key_get`,
`keyvault_secret_list`, `keyvault_certificate_list`, `keyvault_certificate_get`), use them with the `vault` name and
optional `subscription` and `tenant`. Otherwise, or when they fail, time out, take longer than 30 seconds, or return an
empty response for a vault known to hold items, use the Azure CLI:

| Operation | Azure CLI command |
| --- | --- |
| List secret metadata | `az keyvault secret list --vault-name <vault-name> --query "[].{id:id,attributes:attributes}"` |
| List secret versions | `az keyvault secret list-versions --vault-name <vault-name> --name <secret-name> --query "[].{id:id,attributes:attributes}"` |
| List keys | `az keyvault key list --vault-name <vault-name>` |
| Show key metadata | `az keyvault key show --vault-name <vault-name> --name <key-name>` |
| List certificates | `az keyvault certificate list --vault-name <vault-name>` |
| Show certificate metadata | `az keyvault certificate show --vault-name <vault-name> --name <cert-name>` |

Never use `az keyvault secret show` or `az keyvault secret download` for an audit; they return values. Listing secrets
may omit certificate-managed secrets by default. Use certificate metadata for certificate expiry, and document version,
managed-item and pagination coverage in the report.

## Key Fields

- `expiresOn` (`attributes.expires` in CLI output): expiration time. Null means no expiration, which is a risk.
- `enabled`: whether the item is active.
- `notBefore`: when the item becomes valid.
- `createdOn` and `updatedOn`: item age and last rotation.
- `subject` and `issuer`: certificate metadata.

All timestamps are UTC.

## Report Format

- **Summary statistics:** total, expired, expiring and no-expiration counts per item type.
- **Critical issues:** expired items requiring immediate action.
- **Warnings:** items expiring within the threshold.
- **Risks:** items without an expiration date.
- **Recommendations:** expiration policies, rotation, and removal of disabled items.

## Remediation Priority

| Priority | Condition | Action |
| --- | --- | --- |
| Critical | Expired (less than 0 days) | Rotate immediately |
| High | Expiring in 0 to 7 days | Schedule rotation within 24 hours |
| Medium | Expiring in 8 to 30 days | Plan rotation within a week |
| Medium | No expiration set | Apply an expiration policy |
| Low | Active for more than 30 days | Monitor on the regular schedule |

Rotation, expiration policies and item removal change Azure. The agent never runs them; they ship through
`apex preview`, the current runtime's Gate 4 and `apex deploy`.

## Practices

- Audit weekly to catch issues early.
- Every item should carry an expiration date (Azure Policy recommendation).
- Configure Azure Event Grid notifications 30 days ahead.
- Typical rotation: secrets every 60 to 90 days, keys annually, certificates per CA requirements (at most one year).
- Prioritize production vaults over development and test.
- Automate rotation with Azure Functions or Logic Apps, delivered as reviewed IaC.

## Common Issues

- **Access denied:** request metadata-only access, such as Key Vault Reader, at the approved vault scope. Never escalate
  to secret-value access; report the gap.
- **Vault not found:** check the vault name and subscription context (`az account show`).
- **Null `expiresOn`:** the item has no expiration; report it as a policy risk.
