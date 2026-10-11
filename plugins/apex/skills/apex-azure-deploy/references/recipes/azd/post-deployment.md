> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Post-Deployment Steps

Assess required post-provisioning configuration. Uncovered SQL grants, migrations and settings are separately
previewed/Gate 4-approved operations, not automatic post-deployment actions.

> Require accepted provisioning evidence and separate operation authority. CP-26 azd is planned/unqualified;
> APEX never runs `azd up`.

## When to Apply

Post-deployment steps are required when your deployment includes:

| Scenario                                        | Required Actions                                       |
| ----------------------------------------------- | ------------------------------------------------------ |
| **ASP.NET Core + Azure SQL + Managed Identity** | Grant managed identity SQL access, apply EF migrations |
| **App Service + Azure SQL + Entra auth**        | Grant App Service identity database permissions        |
| **Container Apps + SQL Database**               | Configure managed identity access, run migrations      |

## ASP.NET Core + EF Core + Azure SQL

Complete workflow for apps using Entity Framework with Azure SQL Database.

### Prerequisites

- Accepted successful provisioning receipt for the exact native-provider operation
- App Service or Container App has system-assigned managed identity enabled
- Azure SQL Server configured with Entra ID admin
- EF Core project with migrations

### Step 1: Grant Managed Identity SQL Access

Grant the App Service or Container App's managed identity permissions on the SQL database.

See [SQL Managed Identity Access](sql-managed-identity.md) for detailed SQL scripts and examples.

**Quick Template:**

```bash
# Inspect only the accepted non-secret service name; never evaluate environment output as shell code.
APP_NAME=$(azd env get-value SERVICE_API_NAME)

# Connect as Entra admin and grant permissions
# See sql-managed-identity.md for connection patterns
```

### Step 2: Apply EF Core Migrations

Apply Entity Framework migrations to create database schema.

See [EF Core Migrations](ef-migrations.md) for deployment patterns and troubleshooting.

**Quick Options:**

| Method         | Command                                                                                    | Use When                    |
| -------------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| **azd hook**   | Add `postprovision` hook in `azure.yaml` (per-project: `infra/{iac}/{project}/azure.yaml`) | Automated deployments       |
| **Manual**     | `dotnet ef database update`                                                                | One-time or troubleshooting |
| **SQL Script** | `dotnet ef migrations script --idempotent`                                                 | Pre-generated scripts       |

### Step 3: Verify Deployment

```bash
# Get app endpoint
ENDPOINT=$(azd env get-value SERVICE_API_URI)

# Health check
curl -f "$ENDPOINT/health" || echo "Health check failed"

# Test database connectivity
curl -f "$ENDPOINT/api/test-db" || echo "Database connection failed"
```

**Expected Result:**

- HTTP 200 from health endpoint
- No SQL authentication errors in logs
- Application starts successfully

## Common Issues

| Error                                                  | Cause                                   | Solution                                                   |
| ------------------------------------------------------ | --------------------------------------- | ---------------------------------------------------------- |
| `Login failed for user '<token-identified principal>'` | Managed identity not granted SQL access | Follow [sql-managed-identity.md](sql-managed-identity.md)  |
| `Cannot open database`                                 | Network/DNS or permissions block access | Check approved private endpoint/DNS and identity; do not open public access |
| `Invalid object name`                                  | Migrations not applied                  | Run EF migrations per [ef-migrations.md](ef-migrations.md) |
| `No such table`                                        | Schema missing                          | Apply migrations or check connection string database name  |

## Best Practices

1. **Review hooks** — Hook side effects must be explicitly covered by preview/approval; uncovered work remains separate
2. **Use idempotent scripts** — Generate SQL with `dotnet ef migrations script --idempotent`
3. **Verify incrementally** — Test SQL access, then migrations, then endpoint
4. **Log safely** — Bound and redact evidence; never dump secrets, tokens, SQL data or full environments

## References

- [SQL Managed Identity Access](sql-managed-identity.md)
- [EF Core Migrations](ef-migrations.md)
- [Verification Steps](verify.md)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/post-deployment.md).
Load only the reference needed for the active task.
