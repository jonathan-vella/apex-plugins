> **APEX reference.** Read [execution boundaries](../../../execution-boundaries.md) first. Read-only commands stay
> within the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# github-azd.yml — Upstream Source Example

This is a non-executable source example, not an installed helper or a qualified deployment workflow. Do not copy
it into an active pipeline or run it. Native credentials, privileged diagnostics, remote mutations and local writes
need their owning task and capability. Script approval switches and CI environment approvals do not replace current Gate
4.

```yaml
name: Deploy to Azure

on:
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    if: ${{ false }} # CP-26 design only (azd, Bicep); no service-package preview exists.
    runs-on: ubuntu-latest
    environment: dev

    steps:
      - uses: actions/checkout@<reviewed-full-commit-sha>

      - name: Install azd
        uses: Azure/setup-azd@<reviewed-full-commit-sha>

      - name: Azure Login
        uses: azure/login@<reviewed-full-commit-sha>
        with:
          client-id: ${{ vars.AZURE_CLIENT_ID }}
          tenant-id: ${{ vars.AZURE_TENANT_ID }}
          subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy
# Upstream combined azd up removed: APEX never runs it.
# Planned (CP-26, Bicep only): provision preview -> approval -> bound provision;
# separate service/package-digest preview -> approval -> bound deploy.
        run: |
          echo "BLOCKED: planned CP-26/CP-28 flow is not available"
          exit 1
        env:
          AZURE_ENV_NAME: ${{ vars.AZURE_ENV_NAME }}
          AZURE_LOCATION: ${{ vars.AZURE_LOCATION }}
          AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/examples/github-azd.yml).
Load only the reference needed for the active task.
