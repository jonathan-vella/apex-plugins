> Read the [vNext authority and command boundary](../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# App Configuration — Python SDK Quick Reference

> Condensed from **azure-appconfiguration-py**. Full patterns (feature flags,
> snapshots, read-only settings, async client, labels)
> in the **azure-appconfiguration-py** plugin skill if installed.

## Install

pip install azure-appconfiguration azure-identity

## Quick Start

> **Auth:** `DefaultAzureCredential` is for local development. See
> [auth-best-practices.md](../../../apex-entra-app-registration/references/permissions-and-credentials.md)
> for production patterns.

```python
from azure.appconfiguration import AzureAppConfigurationClient
from azure.identity import DefaultAzureCredential
client = AzureAppConfigurationClient(base_url="https://<name>.azconfig.io", credential=DefaultAzureCredential())
```

## Best Practices

- Use labels for environment separation (dev, staging, prod)
- Use key prefixes for logical grouping (app:database:_, app:cache:_)
- Make production settings read-only to prevent accidental changes
- Create snapshots before deployments for rollback capability
- Use Entra ID instead of connection strings in production
- Refresh settings periodically in long-running applications
- Use feature flags for gradual rollouts and A/B testing
