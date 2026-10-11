> **APEX reference.** Read [execution boundaries](../../execution-boundaries.md) first. Read-only commands stay within
> the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Spring Boot to Azure Container Apps Migration

> Migrate Spring Boot applications from Azure Spring Apps, VMs, or other platforms to Azure Container Apps with
> containerization, deployment, and Spring Cloud integration.

## Overview

This migration enables you to move existing Spring Boot applications from Azure Spring Apps (or any platform) to Azure
Container Apps with minimal code changes.

## Migration Scenarios

| Source Platform | Target Platform | Migration Path |
|----------------|-----------------|----------------|
| Azure Spring Apps | Azure Container Apps | Assess → Containerize → Deploy → Spring Cloud components |
| Spring Boot on VMs | Azure Container Apps | Assess → Containerize → Deploy |
| Spring Boot (other cloud) | Azure Container Apps | Assess → Containerize → Deploy |

## Service Mapping

| Spring Apps Feature | Container Apps Equivalent |
|-------------------|---------------------------|
| App Deployment | Container App |
| Service Registry (Eureka) | Managed Eureka for Spring (`eureka-server-for-spring`); alt: Dapr service invocation + internal DNS |
| Config Server | Managed Config Server for Spring (`config-server-for-spring`); alt: Azure App Configuration + Key Vault |
| Spring Cloud Gateway | Managed Gateway for Spring; alt: Azure API Management / Container Apps ingress |
| Distributed Tracing | Application Insights |
| Log Streaming | Log Analytics Workspace |

## Pre-Migration Assessment

Assess your Spring Boot application for migration readiness:

- **Local State**: Check for in-memory sessions, singletons, file-based state → [spring-assessment-guide.md](spring-assessment-guide.md#local-state-assessment)
- **File System**: Identify file writes, temp files, shared storage needs → [spring-assessment-guide.md](spring-assessment-guide.md#file-system-usage)
- **Platform Compatibility**: Verify Java 17+, Spring Boot 3.x support → [spring-assessment-guide.md](spring-assessment-guide.md#platform-compatibility)
- **External Resources**: Inventory databases, message brokers, caches → [spring-assessment-guide.md](spring-assessment-guide.md#external-resources-inventory)

## Migration Workflow

1. **Assess** — Analyze application for migration readiness
   > Report findings and the complexity rating through the active task's input contract, then stop until the kernel
   > selects the containerization stage; a chat reply does not advance the stage.
2. **Containerize** — Create Dockerfile, build image, push to ACR
3. **Provision** — Create Container Apps environment, configure logging
4. **Deploy** — Deploy container to Azure Container Apps
5. **Optimize** — Add Spring Cloud components (Config, Eureka, Gateway)

Return IaC needs to the kernel-selected preparation/CodeGen task (`apex-azure-prepare`); provisioning and deployment
are separate kernel-selected lifecycle tasks with their own preview and approval; see
[Workflow Routing](../../../SKILL.md#workflow-routing).

## Key Differences from Azure Spring Apps

| Aspect | Azure Spring Apps | Container Apps |
|--------|-------------------|----------------|
| Deployment Unit | JAR/WAR | Container Image |
| Service Discovery | Built-in Eureka | Managed Eureka component (or Dapr / DNS) |
| Configuration Management | Built-in Config Server | Managed Config Server component (or App Configuration) |
| Scaling | Auto-scaling | HTTP/CPU/Memory/Custom metrics |
| Networking | VNet injection | VNet integration + Internal ingress |

## Best Practices

- Use managed identity for Azure resource access (no connection strings)
- Store secrets in Azure Key Vault, reference via environment variables
- Use Application Insights for observability
- Enable Log Analytics for centralized logging
- Use Azure Files for persistent storage if needed

## Next Steps After Migration

After successful migration:

1. Configure Spring Cloud components (optional)
2. Set up CI/CD pipeline with GitHub Actions / Azure DevOps
3. Configure custom domains and SSL certificates
4. Implement autoscaling rules
5. Return infrastructure optimization to the kernel-selected preparation/CodeGen task

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-cloud-migrate/references/services/container-apps/spring-apps-to-aca.md).
Load only the reference needed for the active task.
