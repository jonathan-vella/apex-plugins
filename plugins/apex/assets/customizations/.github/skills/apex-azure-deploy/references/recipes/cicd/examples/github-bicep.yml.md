> **APEX reference.** Read [execution boundaries](../../../execution-boundaries.md) first. Read-only commands stay
> within the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# github-bicep.yml — Upstream Source Example

This is a non-executable source example, not an installed helper or a qualified deployment workflow. Do not copy
it into an active pipeline or run it. Native credentials, privileged diagnostics, remote mutations and local writes
need their owning task and capability. Script approval switches and CI environment approvals do not replace current Gate
4.

```yaml
name: Deploy Infrastructure

on:
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

concurrency:
  group: deploy-${{ vars.ENVIRONMENT }}
  cancel-in-progress: false

jobs:
  deploy:
    if: ${{ false }} # Design example only; blocked until the planned CI-owned production flow (CP-28) is qualified.
    runs-on: ubuntu-latest
    # Environment reviewers supplement but never replace current Gate 4.
    environment: ${{ vars.ENVIRONMENT }}
    defaults:
      run:
        working-directory: infra/bicep/${{ vars.PROJECT_NAME }}

    steps:
      - uses: actions/checkout@<reviewed-full-commit-sha>

      - uses: azure/login@<reviewed-full-commit-sha>
        with:
          client-id: ${{ vars.AZURE_CLIENT_ID }}
          tenant-id: ${{ vars.AZURE_TENANT_ID }}
          subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}

      # Upstream provider shape only. A future adapter must execute only the exact approved preview.
      - uses: azure/arm-deploy@<reviewed-full-commit-sha>
        with:
          scope: subscription
          subscriptionId: ${{ vars.AZURE_SUBSCRIPTION_ID }}
          region: <accepted-region>
          template: infra/bicep/${{ vars.PROJECT_NAME }}/main.bicep
          parameters: environmentName=${{ vars.ENVIRONMENT }}
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/examples/github-bicep.yml).
Load only the reference needed for the active task.
