> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Static Web Apps - Deployment

## azd Deploy (Planned Design)

Application deployment through Azure Developer CLI is planned CP-26 behavior (Bicep only, #443) and is not enabled
today; provisioning and application deployment stay separate operations. Design syntax only:

```bash
# Planned CP-26 operation; not available today. Never run directly.
azd deploy
```

## GitHub-Linked Deployments

For CI/CD builds on Azure (instead of azd deploy):

```bicep
properties: {
  repositoryUrl: 'https://github.com/owner/repo'
  branch: 'main'
  buildProperties: {
    appLocation: 'src'
    apiLocation: 'api'
    outputLocation: 'dist'
  }
}
```

## Deployment Token

> ⚠️ **Security Warning:** Do NOT expose deployment tokens in ARM/Bicep outputs. Deployment outputs are visible in Azure
> portal deployment history and logs.

**Recommended approach** - the token is never read by the agent or placed in a shell variable, command argument, log
or output. Transfer it into the secret store only through an authorized secret-handling capability projected by the
active task; if none is available, report a blocker. Reference the stored secret (for example a Key Vault reference)
from the pipeline instead of copying the value.

**Do NOT do this** (exposes token in deployment history):

```bicep
// ❌ INSECURE - token visible in deployment history
// output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
```
