> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# AZD Verification

Verify deployment success and application health.

## Step 1: Verify Resources

```bash
azd show
```

Expected output:

```text
Showing deployed resources:
  Resource Group: rg-myapp-dev
  Services:
    api - Endpoint: https://api-xxxx.azurecontainerapps.io
```

## Step 2: Health Check

```bash
# Read one task-selected, non-secret service URI key by name (for example SERVICE_API_URI); never dump the environment
ENDPOINT=$(azd env get-value <task-selected-service-uri-key>)

# Test endpoint
curl -f "$ENDPOINT/health" || curl -f "$ENDPOINT"
```

Expected: HTTP 200 response.

## Step 3: Post-Deployment Verification (if applicable)

For deployments with Azure SQL Database and managed identity:

### Verify SQL Access

Follow the [reviewed SQL execution guidance](sql-entra-auth.md#reviewed-sql-execution) with explicit data-plane approval.
Put this query in `verify-identity.sql`:

```sql
SELECT name, type_desc FROM sys.database_principals WHERE type = 'E';
```

```bash
# Run verify-identity.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
# No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

**Expected:** Should list the App Service or Container App managed identity.

### Verify Database Schema

For EF Core applications:

Put this query in a separately reviewed `verify-schema.sql`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';
```

```bash
# Run verify-schema.sql only through an available, authorized SQL capability bound to the approved target and reviewed file.
# No SQL executor is shipped; the source example is non-executable, so report a verification gap if none exists.
```

**Expected:** Should list application tables (not just `__EFMigrationsHistory`).

### Check Application Logs

```bash
# For App Service
az webapp log tail --name <app-name> --resource-group <resource-group>

# For Container Apps
az containerapp logs show --name <app-name> --resource-group <resource-group> --follow
```

**Look for:**

- ✅ No SQL authentication errors
- ✅ Successful database connection
- ✅ Application started successfully

## Common Issues

| Symptom                      | Cause                      | Fix                                                    |
| ---------------------------- | -------------------------- | ------------------------------------------------------ |
| HTTP 500 on startup          | SQL authentication failure | See [sql-managed-identity.md](sql-managed-identity.md) |
| "Invalid object name" errors | Migrations not applied     | See [ef-migrations.md](ef-migrations.md)               |
| Endpoint not accessible      | Service still starting     | Wait 1-2 minutes, retry                                |
| Health check fails           | Application error          | Check logs with `az webapp log tail`                   |

## References

- [Post-Deployment Steps](post-deployment.md)
- [SQL Managed Identity Access](sql-managed-identity.md)
- [EF Core Migrations](ef-migrations.md)

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/verify.md).
Load only the reference needed for the active task.
