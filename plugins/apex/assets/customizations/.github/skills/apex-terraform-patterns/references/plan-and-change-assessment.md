# Plan and Change Assessment

Assess accepted plan evidence by its declared actions, target scope, and locked provider or module context.
Do not infer an action from configuration or perform a preview.

| Action class | Assessment intent |
| --- | --- |
| Create | Confirm the target is in scope and its governance evidence is current. |
| In-place update | Confirm the changed properties and dependent interfaces are accepted. |
| Replace | Escalate downtime, data, identity, network, and rollback consequences for approval. |
| Delete | Require explicit ownership, recovery, and approval evidence before handoff. |
| Read | Treat it as observation only; it does not establish desired-state acceptance. |

## Stateful and Drift Signals

Treat replacements or deletions of data, identity, network, and secret-bearing resources as blockers until an
authorized capability records the required recovery and approval evidence. A broad update set can indicate a
provider-schema, collection-order, or configuration-drift difference; record the uncertainty instead of assuming it
is harmless.

## Handoff

Record the receipt identifier, target, exact locks, action summary, accepted exceptions, and unresolved risks.
CodeGen and validation capabilities own preview generation, provider inspection, and any stateful follow-up.
