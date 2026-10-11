> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# SQL Database Entra Authentication

Quick reference for Azure SQL Database Entra authentication in post-deployment scenarios.

## Prerequisites

Azure SQL Server must use Entra-only authentication. The accepted administrator identity may be a user, group or
service principal; never hardcode the signed-in user. This user example is provider context for approved IaC:

```bicep
properties: {
  administrators: {
    administratorType: 'ActiveDirectory'
    principalType: 'User'
    login: principalName
    sid: principalId
    tenantId: subscription().tenantId
    azureADOnlyAuthentication: true
  }
}
```

## Connection Patterns

### Reviewed SQL Execution

The [run-sql.sh source example](../../script-examples/run-sql.sh.md) preserves upstream Go sqlcmd behavior; it is not
an installed or qualified APEX executor. Do not copy/run it as a bypass. SQL mutation needs an available owning
capability, exact preview, current Gate 4 and trusted execution; the helper's environment hash fields are not Gate 4.
Prerequisite: Go sqlcmd supporting `--authentication-method ActiveDirectoryDefault`, an Entra-authorized identity,
and network/DNS access to the approved SQL endpoint. Azure CLI does not provide a database query command.
ODBC sqlcmd is a different interface; do not silently substitute it or use SQL passwords.
If the binary, supported authentication method or credential is unavailable, stop and report a verification gap.

On 2026-09-14, official Go sqlcmd `v1.10.0` Linux ARM64 help (`sqlcmd -?`) confirmed
`--authentication-method ActiveDirectoryDefault`, `-S`, `-d`, `-b` and `-i`.
The release archive matched published SHA-256
`9faaa981f9c374f319ac796dedb4678499b8596c87d5b6c512e9b0e7a3b74f8e`.
This verifies CLI availability at that version, not credentials, connectivity or SQL execution.

The upstream helper binds `SQL_APPROVED_TARGET` to `SQL_SERVER_FQDN/SQL_DATABASE`
and `SQL_APPROVED_SHA256` to a reviewed SQL file. Those fields illustrate input checks, not current APEX authorization.
Never auto-approve a file by hashing it. Read-only SQL checks require their task's data-plane access/evidence scope;
mutation needs the full trusted deployment ceremony. Deployment readiness alone grants neither.
The helper preserves SQL failure exit status (`-b`) and never disables certificate checks.

```bash
# Run verify.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
# No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

For connectivity checks, the reviewed `verify.sql` contains `SELECT 1;`. Never log tokens or full environments.

### Connection Strings

**For .NET applications with managed identity:**

```text
Server=tcp:{server}.database.windows.net,1433;Database={database};Authentication=Active Directory Default;Encrypt=True;
```

**Required packages:**

- `Microsoft.Data.SqlClient` (v5.1.0+)
- `Azure.Identity` (for local development)

## Database Roles

| Role            | Permissions                | Use For               |
| --------------- | -------------------------- | --------------------- |
| `db_datareader` | SELECT                     | Read operations       |
| `db_datawriter` | INSERT, UPDATE, DELETE     | Write operations      |
| `db_ddladmin`   | CREATE, ALTER, DROP schema | EF migrations         |
| `db_owner`      | Full control               | Admin (use sparingly) |

## Grant Managed Identity Access

```sql
-- Create user from managed identity
CREATE USER [app-name] FROM EXTERNAL PROVIDER;

-- Grant standard application permissions
ALTER ROLE db_datareader ADD MEMBER [app-name];
ALTER ROLE db_datawriter ADD MEMBER [app-name];
```

Resolve the actual approved identity; a UAMI may have a different name from the application.
Schema permissions belong to a separately approved migration identity, not the runtime identity by default.

## Verify Current Admin

```bash
az sql server ad-admin list \
  --server "$SQL_SERVER" \
  --resource-group "$AZURE_RESOURCE_GROUP"
```

## References

- [SQL Managed Identity Access](sql-managed-identity.md)
- [EF Core Migrations](ef-migrations.md)
- [Post-Deployment Guide](post-deployment.md)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/sql-entra-auth.md).
Load only the reference needed for the active task.
