> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Event Hubs Recipe - Python Eval

## Test Summary

| Test              | Status  | Notes                                 |
| ----------------- | ------- | ------------------------------------- |
| Code Syntax       | ✅ PASS | Python v2 model decorator pattern     |
| Event Hub Trigger | ✅ PASS | Uses `@app.event_hub_message_trigger` |
| Batch Processing  | ✅ PASS | Cardinality.MANY for throughput       |
| Output Binding    | ✅ PASS | `@app.event_hub_output` decorator     |
| Health Endpoint   | ✅ PASS | Anonymous auth                        |

## Code Validation

```python
# Validated patterns:
# - @app.event_hub_message_trigger with consumer_group
# - @app.event_hub_output for sending events
# - List[func.EventHubEvent] for batch processing
# - Proper event metadata logging (partition, sequence)
```

## Configuration Validated

- `EventHubConnection__fullyQualifiedNamespace` - UAMI binding
- `%EVENTHUB_NAME%` - Runtime config
- `%EVENTHUB_CONSUMER_GROUP%` - Consumer group
- Uses extension bundle v4

## Test Date

2025-02-18

## Verdict

**PASS** - Event Hubs recipe correctly implements both trigger and output bindings with proper batch processing and UAMI
pattern.
