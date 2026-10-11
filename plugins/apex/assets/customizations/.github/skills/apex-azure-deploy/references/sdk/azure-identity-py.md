> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Authentication — Python SDK Quick Reference

> Condensed from **azure-identity-py**. Full patterns (async,
> ChainedTokenCredential, token caching, all credential types)
> in the **azure-identity-py** plugin skill if installed.

## Install

```bash
pip install azure-identity
```

## Quick Start

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
> for production patterns.

```python
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
```

## Best Practices

- Use DefaultAzureCredential for **local development only** (CLI, PowerShell, VS Code). In production, use
  ManagedIdentityCredential — see
  [auth-best-practices.md](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-entra-app-registration/references/auth-best-practices.md)
- Never hardcode credentials — use environment variables or managed identity
- Prefer managed identity in production Azure deployments
- Use ChainedTokenCredential when you need a custom credential order
- Close async credentials explicitly or use context managers
- Set AZURE_CLIENT_ID env var for user-assigned managed identities
- Exclude unused credentials to speed up authentication

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/sdk/azure-identity-py.md).
Load only the reference needed for the active task.
