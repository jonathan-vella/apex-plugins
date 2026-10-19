> **APEX reference.** Read [execution boundaries](../../../execution-boundaries.md) first. Read-only commands stay
> within the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# azdo-azd.yml — Upstream Source Example

This is a non-executable source example, not an installed helper or a qualified deployment workflow. Do not copy
it into an active pipeline or run it. Native credentials, privileged diagnostics, remote mutations and local writes
need their owning task and capability. Script approval switches and CI environment approvals do not replace current Gate
4.

```yaml
trigger:
  branches:
    include: [main]

pool:
  vmImage: "ubuntu-latest"

stages:
  - stage: Deploy
    jobs:
      - job: DeployToAzure
        steps:
          - task: setup-azd@0

          - task: AzureCLI@2
            inputs:
              azureSubscription: "azure-service-connection"
              scriptType: "bash"
# Upstream combined azd up removed: APEX never runs it.
# Planned (CP-26, Bicep only): provision preview -> approval -> bound provision;
# separate service/package-digest preview -> approval -> bound deploy.
              inlineScript: |
                echo "BLOCKED: planned CP-26/CP-28 flow is not available"
                exit 1
            env:
              AZURE_ENV_NAME: $(AZURE_ENV_NAME)
              AZURE_LOCATION: $(AZURE_LOCATION)
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/examples/azdo-azd.yml).
Load only the reference needed for the active task.
