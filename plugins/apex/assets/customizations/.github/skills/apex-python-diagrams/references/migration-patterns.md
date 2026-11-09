# Migration Figure Guidance

Reference-only: a migration diagram is not a current executable migration capability. Ordinary accepted architecture
can show current/target component dependencies, but no script execution or cutover authority follows.

## Preserve These Boundaries

1. Identify source/current state, target/intended state and the evidence date of each.
2. Separate discovery/assessment, replication/copy, verification, cutover, stabilization and rollback decisions.
3. Mark workload versus platform ownership and trust boundaries; do not copy source approvals into the target.
4. Distinguish online replication, bulk import, dual-write and traffic shift; each has different consistency and
   data-loss implications.
5. Show fallback conditions and manual decision ownership, not a guaranteed automatic rollback arrow.

| Pattern | Data needed before depicting it |
| --- | --- |
| Rehost | Source/target identity, dependency inventory, network/access and validation scope |
| Replatform | Changed service/runtime bindings, compatibility constraints and preserved interfaces |
| Refactor | Explicit accepted component/interface changes, not inferred application code |
| Blue/green or staged traffic | Independent environments, approved routing mechanism, health criteria and reversal limits |
| Database/data migration | Source/target schema, consistency/lag, replication ownership, verification and recovery objectives |

Do not state downtime, completion dates, capacity, restored data or successful failback without source evidence.
Durations and milestones are assumptions unless accepted task data establishes them.

For Functions/Redis lifecycle assessments, load `apex-azure-upgrade`; cross-cloud adaptation uses
`apex-azure-cloud-migrate`. Neither this reference nor a diagram authorizes app edits, data copying or live cutover.
