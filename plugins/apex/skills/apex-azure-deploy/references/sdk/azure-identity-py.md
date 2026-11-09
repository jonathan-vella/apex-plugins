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
> [auth-best-practices.md](../../../apex-entra-app-registration/references/permissions-and-credentials.md)
> for production patterns.

```python
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
```

## Best Practices

- Use DefaultAzureCredential for **local development only** (CLI, PowerShell, VS Code). In production, use
  ManagedIdentityCredential — see
  [auth-best-practices.md](../../../apex-entra-app-registration/references/permissions-and-credentials.md)
- Never hardcode credentials — use environment variables or managed identity
- Prefer managed identity in production Azure deployments
- Use ChainedTokenCredential when you need a custom credential order
- Close async credentials explicitly or use context managers
- Set AZURE_CLIENT_ID env var for user-assigned managed identities
- Exclude unused credentials to speed up authentication
