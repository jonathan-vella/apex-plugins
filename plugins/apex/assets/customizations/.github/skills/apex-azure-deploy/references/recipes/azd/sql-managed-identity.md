> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# SQL Managed Identity Access

Grant Azure managed identities database permissions on Azure SQL with Entra authentication.

## Prerequisites

- Azure SQL Server with Entra ID admin configured
- Verified system-assigned or user-assigned application identity
- Your account is Entra ID admin on SQL Server
- [Reviewed SQL execution contract](sql-entra-auth.md#reviewed-sql-execution), including Go sqlcmd and target/file approval

## Quick Grant

Create a reviewed `grant-runtime.sql` using the verified identity name, escaping SQL identifiers/literals.
Do not interpolate untrusted shell values. Resolve duplicate display names before granting access.

```sql
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'approved-runtime-identity')
  CREATE USER [approved-runtime-identity] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [approved-runtime-identity];
ALTER ROLE db_datawriter ADD MEMBER [approved-runtime-identity];
```

```bash
# Run grant-runtime.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
# No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

## Database Roles

| Role            | Permissions                | Use For               |
| --------------- | -------------------------- | --------------------- |
| `db_datareader` | SELECT                     | Read-only queries     |
| `db_datawriter` | INSERT, UPDATE, DELETE     | CRUD operations       |
| `db_ddladmin`   | CREATE, ALTER, DROP schema | EF migrations         |
| `db_owner`      | Full control               | Admin (use sparingly) |

**Standard app:** Reader/writer as required. Grant DDL separately to an approved migration identity, not runtime by default.
**Read-only app:** Only `db_datareader`.

## Automate with azd Hook

Only add a grant hook when explicitly approved in the deployment plan. No SQL executor is installed (the shared helper
is a non-executable source example), so a hook needs an available authorized SQL capability whose target/file approval
comes from the human-approved deployment process, never computed in the hook. Upstream `postprovision` shape in
`azure.yaml` (per-project: `infra/{iac}/{project}/azure.yaml`), blocked until such a capability exists:

```yaml
hooks:
  postprovision:
    shell: sh
    run: echo "BLOCKED: no qualified SQL executor is installed for grant-runtime.sql" && exit 1
```

An authorized executor must fail on missing/stale approval or SQL errors. Never use `continueOnError` for grants.

## Verification

Place this read-only query in a separately reviewed `verify-roles.sql`:

```sql
    SELECT dp.name AS UserName, dr.name AS RoleName
    FROM sys.database_principals dp
    JOIN sys.database_role_members drm ON dp.principal_id = drm.member_principal_id
    JOIN sys.database_principals dr ON drm.role_principal_id = dr.principal_id
    WHERE dp.name = N'approved-runtime-identity';
  ```

  ```bash
  # Run verify-roles.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
  # No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

Expected: identity and roles match the approved set, with no unintended schema permissions.

## Troubleshooting

| Error                                | Solution                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| "Cannot find the user"               | Verify identity exists: `az webapp identity show` or `az containerapp identity show` |
| "Principal does not have permission" | Check you're Entra admin: `az sql server ad-admin list`                              |
| "Login failed for user"              | Run CREATE USER commands from this guide                                             |

**Idempotent Script Pattern:**

```sql
-- Check if user exists before creating
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'my-app')
  CREATE USER [my-app] FROM EXTERNAL PROVIDER;

-- Check role membership before adding
IF NOT EXISTS (
  SELECT 1 FROM sys.database_role_members drm
  JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
  JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
  WHERE r.name = 'db_datareader' AND m.name = 'my-app'
)
  ALTER ROLE db_datareader ADD MEMBER [my-app];
```

## References

- [SQL Entra Authentication](sql-entra-auth.md)
- [EF Core Migrations](ef-migrations.md)
- [Post-Deployment Guide](post-deployment.md)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/sql-managed-identity.md).
Load only the reference needed for the active task.
