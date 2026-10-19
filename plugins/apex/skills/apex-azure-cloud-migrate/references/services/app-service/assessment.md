> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Assessment Phase

Assess accepted source evidence before any code changes; submit through the active task's artifact contract.

## Prerequisites

- Accepted task evidence includes source platform configuration (Procfile, app.yaml, .ebextensions, etc.)
- Request missing evidence through the kernel; assessment does not grant source discovery or file writes

## Assessment Steps

1. **Identify Application** — Determine app type (web, API, worker), runtime, and framework
2. **Map Platform Services** — Map source services to Azure equivalents (see scenario-specific references)
3. **Map Properties** — Map compute config (instance size, scaling) to App Service Plan properties
4. **Check Dependencies** — List 3rd-party libraries and verify Azure compatibility
5. **Analyze Code** — Check for platform-specific APIs, SDKs, or patterns that need migration
6. **Map Data Services** — Identify database and storage migration paths
7. **Map Deployment** — Identify equivalent Azure deployment strategies (azd, GitHub Actions, Bicep)
8. **Review CI/CD** — Check pipeline compatibility with Azure DevOps or GitHub Actions
9. **Map Monitoring** — Map observability stack → Application Insights / Azure Monitor

## Code Preview

During assessment, show a **sneak peek** of key configuration changes:

- Startup command / Dockerfile adjustments
- App Settings mapping
- Database connection string migration (to managed identity)

This helps the user understand the migration scope before committing.

## Architecture Diagrams

When the task authorizes a supported renderer, request two standalone Python diagrams from accepted typed data:

1. **Current State** — Source platform architecture with services and integrations
2. **Target State** — Azure architecture showing equivalent App Service structure

## Assessment Report Format

These upstream headings preserve useful assessment fields, not a vNext schema or file-creation requirement.
Use the active task's allowed artifact and acceptance contract; do not write an independent report/status workflow.

```markdown
# Migration Assessment Report

## 1. Executive Summary

| Property | Value |
|----------|-------|
| **Application Name** | <name> |
| **Application Type** | Web App / API / Worker |
| **Source Platform** | <Heroku / Elastic Beanstalk / App Engine> |
| **Source Runtime** | <runtime and version> |
| **Target Platform** | Azure App Service |
| **Target Runtime** | <runtime and version> |
| **Migration Readiness** | <High / Medium / Low> |
| **Estimated Effort** | <Low / Medium / High> |
| **Assessment Date** | <date> |

## 2. Application Inventory

| # | Component | Runtime | Type | Instances | Description |
|---|-----------|---------|------|-----------|-------------|
| 1 | | | Web / Worker / Cron | | |

## 3. Service Mapping

| Source Service | Azure Equivalent | Migration Complexity | Notes |
|----------------|------------------|----------------------|-------|
| | | | |

## 4. Compute & Scaling Mapping

| # | Source Config | Value | Azure Equivalent | Azure Value | Notes |
|---|-------------|-------|------------------|-------------|-------|
| 1 | Instance type | | App Service Plan SKU | | |
| 2 | Auto-scaling | | App Service Autoscale | | |
| 3 | Health check | | Health Check feature | | |

## 5. Dependencies Analysis

| # | Package/Library | Version | Platform-Specific? | Azure Equivalent | Compatible? | Notes |
|---|----------------|---------|---------------------|------------------|-------------|-------|
| 1 | | | | | | |

## 6. Environment Variables & Configuration

| # | Source Variable | Purpose | Azure Equivalent | Auth Method | Notes |
|---|---------------|---------|------------------|-------------|-------|
| 1 | | | App Setting / Key Vault | Managed Identity / App Setting | |

## 7. Architecture Diagrams

### 7a. Current State (Source Platform)

<!-- Python-rendered standalone architecture diagram -->

### 7b. Target State (Azure)

<!-- Python-rendered standalone architecture diagram -->

## 8. Data Services Mapping

| Source Database/Storage | Azure Equivalent | Migration Path | Notes |
|------------------------|------------------|----------------|-------|
| | | | |

## 9. Networking & Security Mapping

| Source Feature | Azure Equivalent | Notes |
|---------------|------------------|-------|
| Custom domain | App Service Custom Domain | |
| SSL/TLS | App Service Managed Certificate / BYO cert | |
| VPN/VPC | VNet Integration | |

## 10. Monitoring & Observability Mapping

| Source Service | Azure Equivalent | Migration Notes |
|---------------|------------------|-----------------|
| | Application Insights | |
| | Azure Monitor Metrics | |
| | Azure Monitor Alerts | |

## 11. CI/CD & Deployment Mapping

| Source Tool | Azure Equivalent | Notes |
|------------|------------------|-------|
| | GitHub Actions / Azure DevOps | |
| | Bicep / ARM Templates | |
| | Deployment Slots | |

## 12. Recommendations

1. **Runtime**: <recommended App Service runtime stack and version>
2. **App Service Plan**: <Free / Basic / Standard / Premium v3>
3. **IaC Strategy**: <Bicep with azd / Terraform>
4. **Auth Strategy**: <Managed Identity for all service-to-service>
5. **Monitoring**: <Application Insights + Azure Monitor>

## 13. Next Steps

- [ ] Review and approve this assessment report
- [ ] Proceed to code migration (azure-cloud-migrate Phase 2)
- [ ] Hand off to apex-azure-prepare for IaC generation
```

> 💡 **Tip:** Use `mcp_azure-mcp_get_azure_bestpractices` tool to learn App Service best practices for the comparison.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/app-service/assessment.md).
Load only the reference needed for the active task.
