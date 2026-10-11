> **APEX reference.** Read [execution boundaries](../../../execution-boundaries.md) first. Read-only commands stay
> within the accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# azdo-multistage.yml — Upstream Source Example

This is a non-executable source example, not an installed helper or a qualified deployment workflow. Do not copy
it into an active pipeline or run it. Native credentials, privileged diagnostics, remote mutations and local writes
need their owning task and capability. Script approval switches and CI environment approvals do not replace current Gate
4.

```yaml
stages:
  - stage: Dev
    condition: false # Upstream context only; no qualified APEX CI recipient.
    jobs:
      - deployment: DeployDev
        environment: dev
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: "azure-dev"
                    scriptType: "bash"
# Upstream combined azd up removed: APEX never runs it.
# Planned (CP-26, Bicep only): provision preview -> approval -> bound provision;
# separate service/package-digest preview -> approval -> bound deploy.
                    inlineScript: |
                      echo "BLOCKED: planned CP-26/CP-28 flow is not available"
                      exit 1

  - stage: Prod
    condition: false # Production apply remains blocked; environment approval is not Gate 4.
    dependsOn: Dev
    jobs:
      - deployment: DeployProd
        environment: prod # Configure approval in Azure DevOps
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: "azure-prod"
                    scriptType: "bash"
# Upstream combined azd up removed: APEX never runs it.
# Planned (CP-26, Bicep only): provision preview -> approval -> bound provision;
# separate service/package-digest preview -> approval -> bound deploy.
                    inlineScript: |
                      echo "BLOCKED: planned CP-26/CP-28 flow is not available"
                      exit 1
```

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/examples/azdo-multistage.yml).
Load only the reference needed for the active task.
