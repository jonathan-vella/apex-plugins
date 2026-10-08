# Capability Receipts And Handoff

An identity decision becomes operational only after an authorized capability returns an accepted receipt. Intent is not
evidence that an application registration, permission, consent, redirect URI, or credential exists.

## Required Intent Fields

- Requirement references and active task identifier.
- Application, tenant, audience, flow, and redirect-URI design intent.
- Permission and consent intent, including the unresolved items.
- Credential posture, lifecycle owner, and validation obligation.

## Receipt Rules

Preserve the capability name, receipt identifier, status, evidence reference, and any explicit blocker. A missing,
stale, rejected, or incomplete receipt blocks downstream claims and requires kernel-directed recovery.

## Handoff

Route accepted intent to the task-envelope capability for implementation, then to the authorized validation or operations
capability. Return the next task and blocker state; do not perform or simulate the handoff.
