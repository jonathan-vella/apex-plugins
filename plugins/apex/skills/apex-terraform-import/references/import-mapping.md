# Import Mapping And Reconciliation

Use accepted inventory evidence to describe Terraform adoption candidates. It does not authorize a cloud read,
configuration generation, state import, plan, or apply.

## Candidate Record

For every candidate, preserve:

- scoped resource identifier and inventory observation boundary;
- intended Terraform address and mapping rationale;
- exact provider lock and any accepted module lock;
- parent, child, and cross-resource dependencies;
- identity, network, diagnostics, and ownership intent; and
- expected reconciliation result and remaining-drift classification.

## Review Checklist

- Reject incomplete pages, inferred names, ambiguous resource types, and mappings without evidence.
- Keep raw-resource adoption and later AVM refactoring as distinct, reviewable stages.
- Require an explicit stable-address strategy before any stateful transition.
- Treat unexpected create, delete, replacement, or drift as a blocker for the owning authorized capability.

## Blocked Operations

Terraform import apply, state mutation, cloud inventory reads, generated import blocks, preview, and deployment remain
outside this skill.
