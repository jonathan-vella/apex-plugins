# Business Process and Swimlane Guidance

Reference-only: the current runtime has no typed swimlane producer/renderer. Do not create files or execute Graphviz.
Use this reference to identify required data and to explain the blocker for a requested workflow chart.

## Data Required

| Element | Required meaning |
| --- | --- |
| Lane | Named accountable actor/team/system, not an inferred permission grant |
| Activity | One observable action with owner, input and output |
| Decision | A bounded predicate with labeled outcomes, including failure/timeout |
| Handoff | Explicit sender/recipient and evidence or message transferred |
| Start/end | Scope boundary and distinct success, cancellation and partial/failure outcomes |

Sequence activities in one direction; place cross-lane handoffs on explicit edges. Keep system automation separate
from human decisions and a decision diamond separate from a task box. Show joins only when their synchronization
meaning is known; parallel branches are not automatically all-or-nothing transactions.

For APEX process views, the kernel workflow owns stages, gates, task IDs and stop points. Do not draw an extra
approval step, erase required review, treat lab readiness as human approval or authorize a role through lane membership.
Retry/recovery arrows must come from accepted operation semantics, not a generic "try again" loop.

Example: owner requests → human confirms intent → kernel validates → operator receives a bounded task.
An unanswered request has no completion edge. A declined approval is not silently routed into execution.

A future renderer would need actor/action/condition IDs, complete edges and status/source lineage. Until registered,
return those missing capabilities rather than emitting a substitute Mermaid or Python workflow.
