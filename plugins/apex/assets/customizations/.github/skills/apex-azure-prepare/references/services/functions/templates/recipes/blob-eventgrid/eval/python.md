> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Blob + EventGrid Recipe - Python Eval

## Test Summary

| Test              | Status  | Notes                             |
| ----------------- | ------- | --------------------------------- |
| Code Syntax       | ✅ PASS | Python v2 model decorator pattern |
| EventGrid Trigger | ✅ PASS | Uses `@app.event_grid_trigger`    |
| Blob Input        | ✅ PASS | `@app.blob_input` for reading     |
| Blob Output       | ✅ PASS | `@app.blob_output` for writing    |
| Event Filtering   | ✅ PASS | Filters BlobCreated events        |

## Code Validation

```python
# Validated patterns:
# - @app.event_grid_trigger for blob events
# - @app.blob_input with {data.url} binding
# - @app.blob_output for processed output
# - EventGrid event parsing
```

## Configuration Validated

- `BlobConnection__blobServiceUri` - UAMI binding
- EventGrid subscription for blob events
- Uses extension bundle v4

## Grounding Source

[Azure-Samples/functions-quickstart-python-azd-eventgrid-blob](https://github.com/Azure-Samples/functions-quickstart-python-azd-eventgrid-blob)

## Test Date

2025-02-18

## Verdict

**PASS** - Blob + EventGrid recipe correctly implements event-driven blob processing following the official AZD template
patterns.
