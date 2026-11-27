# Timeline and Gantt Guidance

Reference-only: the current runtime does not produce arbitrary timeline/Gantt figures.

## Required Accepted Data

- Stable activity/milestone IDs, accountable owners and dependencies.
- Explicit date/time or relative-time basis, timezone and units.
- Known start/end versus uncertain duration or planned window.
- Real progress/actual completion evidence separate from target estimates.
- Critical ordering and concurrent work only where supported by dependencies.

Use a clear axis and legend, distinguish milestones from intervals and avoid presenting estimated progress as
observed status. An activity with no duration cannot be assigned a convenient bar width and called scheduled.
Never generate a deadline, migration downtime or recovery duration from a generic workload pattern.

Dependency arrows must not create a second APEX state machine. Kernel tasks/gates own progression; a calendar
visualization cannot approve work, infer a resource reservation or bypass stop points.

A future renderer would need a typed schedule source, supported date semantics and deterministic layout/output
receipts. Until then, report the missing capability and retain user-stated planning assumptions without inventing a chart.
