> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Authentication — TypeScript SDK Quick Reference

> Condensed from **azure-identity-ts**. Full patterns (sovereign clouds,
> device code flow, custom credentials, bearer token provider)
> in the **azure-identity-ts** plugin skill if installed.

## Install

npm install @azure/identity

## Quick Start

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```typescript
import { DefaultAzureCredential } from "@azure/identity";
const credential = new DefaultAzureCredential();
```

## Best Practices

- Use DefaultAzureCredential for **local development only** (CLI, PowerShell, VS Code). In production, use
  ManagedIdentityCredential — see
  [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
- Never hardcode credentials — use environment variables or managed identity
- Prefer managed identity — no secrets to manage in production
- Scope credentials appropriately — use user-assigned identity for multi-tenant scenarios
- Handle token refresh — Azure SDK handles this automatically
- Use ChainedTokenCredential for custom fallback scenarios

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/sdk/azure-identity-ts.md).
Load only the reference needed for the active task.
