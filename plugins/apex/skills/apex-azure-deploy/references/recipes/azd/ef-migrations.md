> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# EF Core Migrations Deployment

Apply Entity Framework Core migrations to Azure SQL Database after deployment.

Require explicit approval of the target, reviewed migrations and migration identity. Preparation/validation never
apply migrations. Use the [SQL execution contract](sql-entra-auth.md#reviewed-sql-execution) for target/hash approval.

## Detection

EF Core projects contain `Migrations/` folder or `Microsoft.EntityFrameworkCore` package reference in `.csproj`.

```bash
find . -type d -name "Migrations" 2>/dev/null
find . -name "*.csproj" -exec grep -l "Microsoft.EntityFrameworkCore" {} \;
```

## Deployment Methods

### Method 1: Reviewed azd Hook (Upstream Context)

Only automate when the approved deployment plan includes migrations. Generate and review the SQL first (Method 2).
Upstream shape for a `postprovision` hook (per-project: `infra/{iac}/{project}/azure.yaml`); no SQL executor is installed,
so this stays blocked unless an authorized migration capability exists:

```yaml
hooks:
  postprovision:
    shell: sh
    run: echo "BLOCKED: no qualified SQL executor is installed for migrations.sql" && exit 1
```

Supply approval values from the human-approved deployment process, never auto-approve current files in a hook.
`dotnet ef database update` changes data/schema and is not a direct development bypass. Any available migration
capability must bind target, identity and reviewed SQL/package inputs under the trusted ceremony; otherwise block.
The helper is a non-executable source example, not an installed or qualified executor.

### Method 2: SQL Script (Production)

Generate idempotent script for review before applying:

```bash
dotnet ef migrations script --idempotent --output migrations.sql
```

Review destructive/data changes, backup/rollback and required schema privileges. After target/file approval:

```bash
# Run migrations.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
# No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

### Method 3: Application Startup (Dev Only)

⚠️ Upstream development pattern only. Automatic startup migrations can mutate a remote database without a separate
preview; do not generate/use this pattern for APEX deployment. Prefer an explicitly reviewed separate operation.

```csharp
// Program.cs
if (app.Environment.IsDevelopment()) {
    using var scope = app.Services.CreateScope();
    scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.Migrate();
}
```

## Combined Hook: SQL Access + Migrations

The upstream combined file can illustrate a single review scope; combining steps never combines authority by default.
See [sql-managed-identity.md](sql-managed-identity.md) for SQL grant patterns.

```bash
# Run approved-grants-and-migrations.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
# No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

Review the combined file as one operation. Use a distinct migration identity for DDL; do not grant runtime DDL by default.

## Prerequisites

Install EF Core tools:

```bash
dotnet tool install --global dotnet-ef
dotnet ef --version  # Verify installation
```

## Connection String

```text
Server=tcp:{server}.database.windows.net,1433;Database={database};Authentication=Active Directory Default;Encrypt=True;
```

## Troubleshooting

| Error                               | Solution                                                                |
| ----------------------------------- | ----------------------------------------------------------------------- |
| Cannot open database                | Check firewall rules: `az sql server firewall-rule list`                |
| Login failed                        | Grant SQL access per [sql-managed-identity.md](sql-managed-identity.md) |
| Unable to create DbContext          | Add `IDesignTimeDbContextFactory` implementation                        |
| Hook fails but deployment continues | Remove `continueOnError: true` to make migrations block deployment      |

**DbContext Factory Example:**

```csharp
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext> {
    public ApplicationDbContext CreateDbContext(string[] args) {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING")
            ?? args.FirstOrDefault() ?? "Server=(localdb)\\mssqllocaldb;Database=MyDb;Trusted_Connection=True;";
        optionsBuilder.UseSqlServer(connectionString);
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
```

## Best Practices

- Use `--idempotent` flag for production scripts
- Version control Migrations/ folder
- Test locally before deploying
- Backup production databases before applying
- Keep migrations small and focused

## References

- [SQL Managed Identity Access](sql-managed-identity.md)
- [Post-Deployment Guide](post-deployment.md)
- [EF Core Migrations](https://learn.microsoft.com/ef/core/managing-schemas/migrations/)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/ef-migrations.md).
Load only the reference needed for the active task.
