# Azure Quick Review Assessment

Azure Quick Review (azqr) assessment workflow ported from the upstream `azure-quick-review.md`. An azqr scan only reads
resource configuration; it may run directly against the approved scope. Its findings are observations until accepted
as evidence, and every fix it suggests changes Azure and is routed (see
[remediation patterns](remediation-patterns.md)).

## Prerequisites

- Azure authentication for the intended tenant: Azure CLI (`az login`), or a service principal or managed identity in
  a pipeline.
- `Reader` at least on the target subscription or management group.
- azqr, through the Azure MCP server's azqr tool when the client provides it, or the
  [azqr CLI](https://azure.github.io/azqr/docs/).

## Step 1: Determine the Scan Scope

| Scope | Use case | Required information |
| --- | --- | --- |
| Subscription | Full subscription assessment | Subscription ID |
| Resource group | Targeted assessment | Subscription ID and resource group name |
| Management group | Enterprise-wide assessment | Management group ID |
| Specific service | Deep dive on one resource type | Subscription ID and service abbreviation |

Take the scope from the task context; never widen it.

## Step 2: Run the Scan

With the Azure MCP server's azqr tool:

```text
mcp_azure-mcp_extension_azqr
  subscription: <subscription-id>
  resource-group: <optional-rg-name>
```

Or run `azqr scan` with the same subscription and resource group scope; see the azqr documentation for the current scope
flags. Both forms are read-only.

## Step 3: Analyze the Results

The scan produces an Excel workbook with these sheets:

| Sheet | Contents | Priority |
| --- | --- | --- |
| Recommendations | All recommendations with impacted resource count | High |
| ImpactedResources | Resources with specific issues to address | High |
| Inventory | All scanned resources with SKU, tier and SLA details | Medium |
| Advisor | Azure Advisor recommendations | Medium |
| DefenderRecommendations | Microsoft Defender for Cloud findings | High |
| Azure Policy | Non-compliant resources per Azure Policy | Medium |
| Costs | Three-month cost history by subscription | Low |
| Defender | Defender plan status and tiers | Medium |
| OutOfScope | Resources not scanned | Low |

Focus on:

1. High-severity recommendations from ImpactedResources.
2. Defender recommendations (security-critical).
3. Advisor recommendations (reliability and performance).
4. Policy non-compliance (governance).

## Step 4: Categorize Findings

| Category | Examples | Severity |
| --- | --- | --- |
| Security | Public endpoints, missing encryption, no private endpoints | Critical |
| Reliability | No zone redundancy, single instance, no backup | High |
| Performance | Undersized SKUs, missing caching, no CDN | Medium |
| Cost | Orphaned resources, oversized SKUs, unused reservations | Medium |
| Operations | Missing diagnostics, no alerts, no tags | Low |

## Step 5: Remediation Guidance

For each high-priority finding:

1. Explain the risk in plain language.
2. Show the remediation as the IaC change and the equivalent CLI from [remediation patterns](remediation-patterns.md).
   The fix ships through `apex preview`, Gate 4 and `apex deploy`; the agent never
   applies it.
3. Estimate effort and impact.

## Step 6: Summary

```markdown
## Compliance Assessment Summary

**Scope:** [Subscription/RG/MG name]
**Scanned:** [Date/Time]
**Resources Analyzed:** [Count]

### Key Findings

| Severity | Count | Top Issues   |
| -------- | ----- | ------------ |
| Critical | X     | [List top 3] |
| High     | X     | [List top 3] |
| Medium   | X     | [List top 3] |

### Recommended Actions

1. **[Issue]** - [Brief remediation, routed through apex deploy]
2. **[Issue]** - [Brief remediation, routed through apex deploy]
3. **[Issue]** - [Brief remediation, routed through apex deploy]

### Next Steps

- [ ] Address critical security findings
- [ ] Review and remediate high-severity items
- [ ] Schedule a follow-up scan to verify fixes
```

## Supported Services

azqr supports more than 70 Azure resource types, including AKS, API Management, App Configuration, App Service,
Container Apps, Cosmos DB, Container Registry, Key Vault, Load Balancer, Azure Database for MySQL and PostgreSQL, Azure
Cache for Redis, Service Bus, Azure SQL Database, Storage Accounts, Virtual Machines and Virtual Networks.

## Troubleshooting

| Issue | Symptom | Resolution |
| --- | --- | --- |
| Permission denied | 403 errors during the scan | Verify `Reader` on the scope; report the coverage gap rather than requesting broader access |
| Not authenticated | `AADSTS` errors | Ask the user to sign in with `az login` for the intended tenant; never switch identity automatically |
| Slow scan | Scan takes very long | Use resource-group scope |

## Documentation

- [Azure Quick Review documentation](https://azure.github.io/azqr/docs/)
- [Azure Proactive Resiliency Library](https://aka.ms/aprl)
