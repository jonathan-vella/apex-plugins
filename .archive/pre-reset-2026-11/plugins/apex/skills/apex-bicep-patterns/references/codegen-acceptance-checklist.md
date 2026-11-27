# CodeGen Acceptance Checklist

Use this checklist after Bicep generation and before accepting validator or preview evidence.

## Intent And Governance

- [ ] Every generated resource traces to accepted requirements and architecture intent.
- [ ] Applicable policy effects map to generated properties or an explicit blocker.
- [ ] Environment-specific values come from the accepted environment input contract.
- [ ] No secret, placeholder identifier, recipient, subscription, tenant, or principal is embedded in source.

## Modules And Composition

- [ ] AVM is used when the selected module can satisfy the accepted intent.
- [ ] Every module version has authorized resolution evidence and its exact schema was inspected.
- [ ] Module inputs and outputs follow the accepted interface and match the exact selected schema.
- [ ] Resource names satisfy service constraints without changing stable identity unexpectedly.
- [ ] Optional modules guard dependent outputs and resources consistently.
- [ ] Existing resource references have explicit dependencies when their targets are created in the same deployment.

## Security And Identity

- [ ] HTTPS, transport security, identity, network access, and data-access settings match the accepted baseline.
- [ ] Role assignments use the narrowest accepted scope and the intended principal type.
- [ ] Runtime identities are not promoted to data-plane administrators.
- [ ] Public access or credential-based exceptions have accepted, current dispositions.

## Network And Operations

- [ ] Address spaces and service CIDRs do not overlap.
- [ ] Private endpoint bindings include the correct subresource, subnet, DNS zone, VNet link ownership, and zone group.
- [ ] Diagnostics target the accepted monitoring destination and include supported log and metric categories.
- [ ] SKU-sensitive properties are compatible with the selected tier in the rendered template.
- [ ] Query-based alert text is valid for the target table schema.
- [ ] Post-deployment requirements are recorded rather than represented as unsupported resource properties.

## Validation Loop

- [ ] Formatting, build, lint, security, policy, and provider-readiness checks pass.
- [ ] Preview contains no unexplained deletion, SKU downgrade, public-access change, authentication change, or identity
      removal.
- [ ] Generated parameters compile against the generated entrypoint.
- [ ] Validation receipts bind the current source tree, module locks, target, inputs, and dependency revision.
- [ ] Any correction was followed by a fresh full validation pass; stale receipts were not reused.

Return a blocker with the failing checklist item and required owner when any mandatory item cannot be proven.
