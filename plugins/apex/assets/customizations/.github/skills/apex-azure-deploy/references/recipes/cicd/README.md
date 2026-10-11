# CI/CD Deployment Recipe — Design Guidance

Read [execution boundaries](../../execution-boundaries.md). CI-owned production runs (CP-28, DECISION-036) and azd for
Bicep (CP-26) are **planned**; production apply is blocked until they are implemented and qualified. The examples
below are non-executable source references, not supported deploy workflows.

## Static Generation Versus Remote Configuration

Authorized CodeGen may generate `azure.yaml` and static workflow files for review. This does not create identities,
role assignments, federation, repository variables, service connections or environments.
`azd pipeline config` performs Azure, Entra and GitHub setting mutations; it requires its own preview and current Gate 4
through trusted `apex deploy`. There is no separate user-run bypass. Manual SDK/API/CLI setup follows the same boundary.
Pipeline config has **no native preview**; do not invent a preview flag or claim APEX's adapter already exists.

Use OIDC federation and least-privilege scoped roles, not client secrets in files. Tenant/client/subscription IDs are
non-secret configuration variables; tokens and secret values never enter examples or reports.
Third-party actions must use reviewed full commit SHAs. Placeholders in the examples are intentionally non-runnable.

## Approval Today and the Planned Target

Current runtime, still enforced:

1. Accepted validation and a current preview bind the commit, dependency revision, inputs and exact CI recipient.
2. The current runtime's Gate 4 is the deployment approval; GitHub/Azure DevOps environment checks, `--yes` style
   switches and OIDC job identity are not approval.
3. Any existing qualification handoff is recipient-bound and one-hop. The CI recipient accepts the approved preview;
   it cannot create, refresh, replace or forward approval, replan, or substitute packages.
4. Execution returns run evidence through `submitEvidence`. Stale/expired/mismatched handoffs or changed inputs block.

Planned target (DECISION-036, CP-28 [#457](https://github.com/jonathan-vella/apex-vnext/issues/457)): production is
opt-in and CI-owned. GitHub Actions owns the execution run and preview, and the kernel verifies a candidate-bound
human review receipt before apply. OIDC job identity or an environment pause is not that receipt. This is not shipped
behavior; do not document guessed accept/import commands as runtime support. Today's references preserve the upstream
workflow shape; the adapters belong to their tracked kernel work.
azd Terraform's provisioning path replans before apply and is not a valid saved-plan executor. Current azd service
preview cannot combine with `--from-package`. Those paths stay unqualified; Terraform uses the native CLI under DECISION-036.

## Upstream Examples

| Example | Useful context and limitations |
| --- | --- |
| [GitHub azd](examples/github-azd.yml.md) | OIDC, selected environment and variables; combined deployment removed |
| [GitHub Bicep](examples/github-bicep.yml.md) | Infrastructure inputs/outputs; direct create step is not an approved operation |
| [Azure DevOps azd](examples/azdo-azd.yml.md) | Service connection and environment shape; not a supported production executor |
| [Azure DevOps multistage](examples/azdo-multistage.yml.md) | Dev/prod separation; stage approvals are not kernel approval |

GitHub workflow generation must not enable automatic push-to-production deployment. Azure DevOps references retain
useful upstream context but do not establish vNext production execution support. Service connections, variable groups,
protected environments and identity provisioning are remote configuration, not static generation.

## References

- [Verification](verify.md) - resource and endpoint observations, not approval.
- [Errors](errors.md) - logs, federation, permissions and pipeline diagnosis.

## Port Source

Adapted from [the upstream CI/CD recipe](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/cicd/README.md).
