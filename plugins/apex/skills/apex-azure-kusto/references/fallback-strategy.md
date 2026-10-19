> **APEX reference.** Read [execution boundaries](execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

<!-- ref:fallback-strategy-v1 -->

# Fallback Strategy: Azure CLI Commands

Use scoped read-only CLI fallback when a Kusto tool is unavailable. Authentication failure or denied access is
a blocker, not permission to switch identities. A timeout requires a narrower bounded query, not an expanded scan.

## CLI Command Reference

| Operation      | Azure CLI Command                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------- |
| List clusters  | `az kusto cluster list --resource-group <rg-name>`                                                |
| List databases | `az kusto database list --cluster-name <cluster> --resource-group <rg-name>`                      |
| Show cluster   | `az kusto cluster show --name <cluster> --resource-group <rg-name>`                               |
| Show database  | `az kusto database show --cluster-name <cluster> --database-name <db> --resource-group <rg-name>` |

## KQL Query via Azure CLI

For ordinary bounded KQL, use the Kusto data-plane query API. Resolve the accepted cluster URL and token audience
from the task/cloud context; do not assume an ARM token can query ADX. The POST method here is read-only only for
query KQL, not ingestion, export or management commands.

```bash
az rest --method post \
  --url "https://<cluster>.<region>.kusto.windows.net/v1/rest/query" \
  --resource "<accepted-ADX-token-audience>" \
  --body "{ \"db\": \"<accepted-database>\", \"csl\": \"<bounded-read-only-kql>\" }"
```

## When to Fallback

Switch to Azure CLI when:

- MCP tool returns timeout error (queries > 60 seconds)
- MCP tool returns "service unavailable" or connection errors
- Authentication differences only when the fallback identity is already authorized for the same scope
- Empty tool response requiring a bounded verification query; never infer empty data from an empty response

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-kusto/references/fallback-strategy.md).
Load only the reference needed for the active task.
