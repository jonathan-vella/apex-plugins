> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Authentication — Java SDK Quick Reference

> Condensed from **azure-identity-java**. Full patterns (workload identity,
> certificate auth, device code, sovereign clouds)
> in the **azure-identity-java** plugin skill if installed.

## Install

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.15.0</version>
</dependency>
```

## Quick Start

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](../../../apex-entra-app-registration/references/permissions-and-credentials.md)
> for production patterns.

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
var credential = new DefaultAzureCredentialBuilder().build();
```

## Best Practices

- Use DefaultAzureCredential for **local development only** (CLI, PowerShell, VS Code). In production, use
  ManagedIdentityCredential — see
  [auth-best-practices.md](../../../apex-entra-app-registration/references/permissions-and-credentials.md)
- Managed identity in production — no secrets to manage, automatic rotation
- Azure CLI for local dev — run `az login` before running your app
- Least privilege — grant only required permissions to service principals
- Token caching — enabled by default, reduces auth round-trips
- Environment variables — use for CI/CD, not hardcoded secrets
