# Integration Service Figure Guidance

Use accepted architecture dependencies for the current topology. Specialized integration-flow figures are
reference-only until their contracts and renderers exist.

| Service/concept | Distinguish in the design |
| --- | --- |
| Service Bus queue | Competing consumption, settlement, dead-letter handling and idempotency |
| Service Bus topic | Publish/subscribe fanout and each accepted subscription/filter |
| Event Grid | Event notification, routing/filtering and delivery retries, not durable stream replay |
| Event Hubs | Partitioned stream, consumer groups, retention/replay and checkpoint ownership |
| Logic Apps | Orchestration/connector boundary, identity and external-service dependencies |
| Functions | Trigger, processing, output binding and failure path, not just a generic compute box |
| API Management | Gateway/policy/authentication boundary versus backend authorization |
| Data Factory | Control/orchestration versus the actual payload path |

Label synchronous requests, asynchronous events and batch/data movement separately in any future supported flow
view. Do not depict exactly-once delivery, ordered processing, guaranteed latency or error recovery from service names.

Retain accepted identities, private networking and supplied platform ownership without exposing keys, callback URLs
containing secrets or customer payloads. Failure routes and dead-letter/replay handling are design assumptions unless
separate evidence establishes observed behavior.

Example: an accepted topic and two subscriptions imply two distinct consumer dependencies, not one competing queue.
If the accepted source only supplies a generic `dependsOn` edge, render only that relation.

No message sends/receives, connector configuration, data export, deployment or privileged inspection is authorized.
