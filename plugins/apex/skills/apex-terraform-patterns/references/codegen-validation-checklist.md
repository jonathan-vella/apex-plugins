<!-- ref:codegen-validation-checklist-terraform-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Terraform CodeGen Validation Checklist

Evaluate these criteria through the current CodeGen task; only the kernel accepts completion.

## Preflight & Governance

- [ ] Preflight evidence accepted and fresh for the exact target and source revision
- [ ] Governance compliance map complete — all Deny policies satisfied

## AVM & Code Structure

- [ ] AVM-TF modules used for all available resources
- [ ] Module versions match exact semver pins in the approved plan/contract; no implicit upgrades
- [ ] One root random suffix is passed to children; effective policy tag keys, casing and values are preserved
- [ ] `project_name` is a required variable with no default value
- [ ] Zero hardcoded project-specific values (see `apex-terraform.instructions.md`)

## Security Baseline

- [ ] Security baseline applied (TLS 1.2, HTTPS, managed identity)

## Deployment Artifacts

- [ ] Bootstrap templates provided where required, but never executed during CodeGen or validation-only
- [ ] Deployment entrypoint matches the accepted binding; no legacy script bypass
- [ ] Shared-state phase conditions are cumulative, preserving earlier resource addresses and resources
- [ ] Accepted implementation reference and source-tree receipt available
- [ ] Budget, notifications, Action Group routing and anomaly detection satisfy the canonical cost-monitoring contract

## Review Gates

- [ ] Required Terraform validation passed; a validator PASS does not grant deployment approval
- [ ] Required current reviews follow the kernel task's evidence and gate obligations
- [ ] Optional deeper review never replaces required review or gate evidence
- [ ] Resolve blocking findings through the owning task, not an independent Challenger protocol
- [ ] Request a human handoff if a required reviewer is unavailable; never fabricate approval
- [ ] Complete the accepted implementation reference and handoff even when optional review is skipped
