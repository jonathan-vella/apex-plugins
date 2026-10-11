> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Assessment Phase

Assess accepted source evidence before any code changes; submission uses the active task's artifact contract.

## Prerequisites

- Accepted task evidence contains Lambda runtime/code, SAM or CloudFormation details
- Request missing evidence through the kernel; the assessment does not grant workspace/source-cloud discovery

## Assessment Steps

1. **Identify Functions** — List all Lambda functions with runtimes, triggers, and dependencies
2. **Map AWS Services** — Map AWS services to Azure equivalents (see [lambda-to-functions.md](lambda-to-functions.md))
3. **Map Properties** — Map Lambda properties to Azure Functions properties
4. **Check Dependencies** — List 3rd-party libraries and verify Azure compatibility
5. **Analyze Code** — Check language support and runtime differences
6. **Map Triggers** — Identify equivalent Azure Functions triggers
7. **Map Deployment** — Identify equivalent Azure deployment strategies (CLI, Bicep, azd)
8. **Review CI/CD** — Check pipeline compatibility with Azure DevOps or GitHub Actions
9. **Map Monitoring** — Map CloudWatch → Application Insights / Azure Monitor

## Code Preview

During assessment, show a **sneak peek** of what the migrated Azure Functions code will look like for each function. Use
bindings and triggers (not SDKs) in all previews, following Azure Functions best practices. **Always use the newest
generally available (GA) language runtime listed in the Azure Functions supported languages documentation** in previews
(for example, the latest Node.js LTS or newest Python GA version). This helps the user understand the migration scope
before committing to code migration.

> ⚠️ **Binding-first rule**: Code previews MUST use `input.storageBlob()`, `output.storageBlob()`, `app.storageQueue()`,
> etc. instead of `BlobServiceClient`, `QueueClient`, or other SDK clients. Only use SDK for services that have no
> binding equivalent.

## Architecture Diagrams

When the task authorizes a supported renderer, request two standalone Python diagrams from accepted typed data:

1. **Current State** — AWS Lambda architecture with triggers and integrations
2. **Target State** — Azure Functions architecture showing equivalent structure

## Assessment Report Format

The following upstream headings preserve useful assessment fields. They are not a vNext schema or permission to write
`migration-assessment-report.md`; use the task's actual allowed output and acceptance contract.

```markdown
# Migration Assessment Report

## 1. Executive Summary

| Property                | Value                 |
| ----------------------- | --------------------- |
| **Total Functions**     | <count>               |
| **Source Platform**     | AWS Lambda            |
| **Source Runtime**      | <runtime and version> |
| **Target Platform**     | Azure Functions       |
| **Target Runtime**      | <runtime and version> |
| **Migration Readiness** | <High / Medium / Low> |
| **Estimated Effort**    | <Low / Medium / High> |
| **Assessment Date**     | <date>                |

## 2. Functions Inventory

| #   | Function Name | Runtime | Trigger Type | Memory (MB) | Timeout (s) | Description |
| --- | ------------- | ------- | ------------ | ----------- | ----------- | ----------- |
| 1   |               |         |              |             |             |             |

## 3. Service Mapping

| AWS Service          | Azure Equivalent                     | Migration Complexity | Notes |
| -------------------- | ------------------------------------ | -------------------- | ----- |
| Lambda               | Azure Functions                      |                      |       |
| API Gateway          | Azure Functions HTTP Trigger / APIM  |                      |       |
| S3                   | Azure Blob Storage                   |                      |       |
| DynamoDB             | Cosmos DB                            |                      |       |
| SQS                  | Service Bus / Storage Queue          |                      |       |
| SNS                  | Event Grid                           |                      |       |
| CloudWatch           | Application Insights / Azure Monitor |                      |       |
| IAM Roles            | Managed Identity + RBAC              |                      |       |
| CloudFormation / SAM | Bicep / ARM Templates                |                      |       |

## 4. Trigger & Binding Mapping

| #   | Function Name | AWS Trigger | Azure Trigger | AWS Inputs/Outputs | Azure Bindings | Notes |
| --- | ------------- | ----------- | ------------- | ------------------ | -------------- | ----- |
| 1   |               |             |               |                    |                |       |

## 5. Dependencies Analysis

| #   | Package/Library | Version | AWS-Specific? | Azure Equivalent | Compatible? | Notes |
| --- | --------------- | ------- | ------------- | ---------------- | ----------- | ----- |
| 1   |                 |         |               |                  |             |       |

## 6. Environment Variables & Configuration

| #   | AWS Variable | Purpose | Azure Equivalent | Auth Method                    | Notes |
| --- | ------------ | ------- | ---------------- | ------------------------------ | ----- |
| 1   |              |         |                  | Managed Identity / App Setting |       |

## 7. Architecture Diagrams

### 7a. Current State (AWS)

<!-- Python-rendered standalone architecture diagram of AWS Lambda architecture -->

### 7b. Target State (Azure)

<!-- Python-rendered standalone architecture diagram of Azure Functions architecture -->

## 8. IAM & Security Mapping

| AWS IAM Role/Policy | Azure RBAC Role | Scope | Notes |
| ------------------- | --------------- | ----- | ----- |
|                     |                 |       |       |

## 9. Monitoring & Observability Mapping

| AWS Service        | Azure Equivalent                           | Migration Notes |
| ------------------ | ------------------------------------------ | --------------- |
| CloudWatch Logs    | Application Insights                       |                 |
| CloudWatch Metrics | Azure Monitor Metrics                      |                 |
| CloudWatch Alarms  | Azure Monitor Alerts                       |                 |
| X-Ray              | Application Insights (distributed tracing) |                 |

## 10. CI/CD & Deployment Mapping

| AWS Tool       | Azure Equivalent                        | Notes |
| -------------- | --------------------------------------- | ----- |
| SAM CLI        | Azure Functions Core Tools / azd        |       |
| CloudFormation | Bicep / ARM Templates                   |       |
| CodePipeline   | Azure DevOps Pipelines / GitHub Actions |       |
| CodeBuild      | Azure DevOps Build / GitHub Actions     |       |

## 11. Project Structure Comparison

| AWS Lambda Structure                | Azure Functions Structure              |
| ----------------------------------- | -------------------------------------- |
| `template.yaml` (SAM)               | `host.json`                            |
| `handler.js / handler.py`           | `src/app.js` / `src/function_app.py`   |
| `requirements.txt` / `package.json` | `requirements.txt` / `package.json`    |
| Per-function directories (optional) | Single entry point (v4 JS / v2 Python) |
| `event` object                      | Trigger-specific parameter             |
| `context` object                    | `InvocationContext`                    |

## 12. Recommendations

1. **Runtime**: <recommended Azure Functions runtime and version>
2. **Hosting Plan**: <Flex Consumption / Premium>
3. **IaC Strategy**: <Bicep with azd / Terraform / ARM>
4. **Auth Strategy**: <Managed Identity for all service-to-service>
5. **Monitoring**: <Application Insights + Azure Monitor>

## 13. Next Steps

- [ ] Review and approve this assessment report
- [ ] Proceed to code migration (apex-azure-cloud-migrate Phase 2)
- [ ] Hand off to apex-azure-prepare for IaC generation
```

> 💡 **Tip:** Use `mcp_azure-mcp_get_azure_bestpractices` tool to learn Azure Functions project structure best practices
> for the comparison.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/functions/assessment.md).
Load only the reference needed for the active task.
