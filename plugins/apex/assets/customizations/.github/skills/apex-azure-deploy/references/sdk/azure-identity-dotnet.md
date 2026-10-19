> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Authentication — .NET SDK Quick Reference

> Condensed from **azure-identity-dotnet**. Full patterns (ASP.NET DI,
> sovereign clouds, brokered auth, certificate credentials)
> in the **azure-identity-dotnet** plugin skill if installed.

## Install

dotnet add package Azure.Identity

## Quick Start

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```csharp
using Azure.Identity;
var credential = new DefaultAzureCredential();
```

## Best Practices

- Use DefaultAzureCredential for **local development only**. In production, use deterministic credentials
  (ManagedIdentityCredential) — see
  [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
- Reuse credential instances — single instance shared across clients
- Configure retry policies for credential operations
- Enable logging with AzureEventSourceListener for debugging auth issues

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/sdk/azure-identity-dotnet.md).
Load only the reference needed for the active task.
