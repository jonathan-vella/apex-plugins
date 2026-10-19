# azd Deployment Recipe — Planned (Bicep Only, CP-26)

Read [execution boundaries](../../execution-boundaries.md) and the
[pre-deploy checklist](../../pre-deploy-checklist.md). This reference preserves azd provider guidance;
the vNext azd track is **planned**, not an available runtime feature. Return a capability blocker today.

## Prerequisites

- The task supplies accepted preparation/validation receipts, target and environment.
- `azure.yaml`, its services, hooks and Bicep/Terraform files are validated and co-located for the selected project.
- azd and provider/toolchain versions match task requirements. Missing tools return to authorized setup; do not
  install an extension/server merely because an upstream example mentions it.
- Only named non-secret environment keys are inspected. Environment changes are authorized preparation and
  invalidate previous previews.

Upstream azd supports Bicep and Terraform, but each native provider retains its own lifecycle and safety requirements.
The azd Terraform provider replans during `Deploy()` before `Apply()`; it cannot execute an existing exact-approved
saved plan. That path remains unqualified and blocked. Use the native Terraform saved-plan lifecycle, not azd.

## Provisioning and Service Delivery

The planned sequence is:

1. Read selected environment/target and verify service prerequisites.
2. The trusted provisioning preview is the planned azd preview for Bicep.
3. Approval binds that exact preview, including commit, dependencies, hashes, recipient and expiry. The current
   runtime's Gate 4 does this today; the planned lab flow approves the final deployment preview after confirmed
   intent (DECISION-036, CP-27).
4. A future supported trusted adapter must execute only the approved provisioning operation. Plain `azd provision`
   is not proof of exact-preview fidelity; unsupported providers/hooks must fail closed.
5. Build/package only under task authorization; record exact service list and package digests.
6. A **separate** preview and approval authorize service delivery.
7. A future supported trusted adapter must deploy only the approved services/packages, without rebuilding.
8. Submit scoped verification evidence and separately authorize any SQL/EF or identity work not already covered.

APEX never runs upstream's combined `azd up`, with or without `--no-prompt`. Provisioning and application delivery
cannot share one guessed preview. The provider's no-prompt option cannot grant approval.
Current `azd deploy --preview` cannot combine with `--from-package`, so do not claim the service-package approval
path exists natively. `azd pipeline config` has no native preview and needs its own explicit APEX design/approval.
The first CP-26 scope decision is still pending; these constraints must not be resolved by weakening contracts.

## Provider Command Context

These are command shapes for CP-26 implementation/design review, **not** direct agent instructions:

```bash
# Changes Azure — planned trusted provisioning only, after exact preview and current Gate 4.
azd provision --no-prompt

# Changes Azure — a different approval binds the service list and package digests.
azd deploy --no-prompt

# Changes Azure — single-service delivery still needs its own bound approval.
azd deploy api --no-prompt
```

Packaging must use the validated service language/host configuration. For Aspire limited mode, provider-generated
infrastructure may not populate required registry/managed-identity outputs. Preserve generated inputs/evidence; do not
manually invent parameters to make preview succeed. See [errors](errors.md).

## Common Mistakes

| Mistake | Correct boundary |
| --- | --- |
| Using `azd up` for APEX | Separate provision and service-delivery approvals; blocked until CP-26 lands |
| Passing `--location` to combined deployment | Accept location during preparation; inspect the selected environment |
| Missing environment or manually creating `.azure/` | Return to authorized preparation; let azd own environment layout |
| Changing region to retry an existing resource group | Its location is fixed; accept a compatible target and renew preview |
| Ignoring duplicate `azd-service-name` tags | Check only the exact group; resolve via an authorized change |
| Static-site `language: html`/`static` | Validate the provider's supported language (for example `js` with `dist: .`) |
| Local build assumes deployment architecture | Match build/target architecture and record package digests; remote build is not automatic |

## References

- [Post-deployment](post-deployment.md), [EF migrations](ef-migrations.md), [SQL identity](sql-managed-identity.md)
  and [SQL Entra auth](sql-entra-auth.md): separate operations, never implicit hook authority.
- [Functions deployment](functions-deploy.md), [verification](verify.md), [errors](errors.md).

## Port Source

Adapted from [the upstream azd recipe](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-deploy/references/recipes/azd/README.md).
