> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# SQL Recipe - Python Eval

## Test Summary

| Test            | Status  | Notes                                   |
| --------------- | ------- | --------------------------------------- |
| Code Syntax     | ✅ PASS | Python v2 model decorator pattern       |
| SQL Input       | ✅ PASS | Uses `@app.sql_input` decorator         |
| SQL Output      | ✅ PASS | Uses `@app.sql_output` decorator        |
| SQL Trigger     | ✅ PASS | Change tracking with `@app.sql_trigger` |
| Health Endpoint | ✅ PASS | Anonymous auth                          |

## Code Validation

```python
# Validated patterns:
# - @app.sql_input for reading data
# - @app.sql_output for writing data
# - @app.sql_trigger for change detection
# - Parameterized queries with @param
```

## Configuration Validated

- `SqlConnectionString` - Connection string or UAMI
- Table/view names configurable
- Uses SQL extension bundle

## Grounding Source

[Azure-Samples/functions-quickstart-python-azd-sql](https://github.com/Azure-Samples/functions-quickstart-python-azd-sql)

## Test Date

2025-02-18

## Verdict

**PASS** - SQL recipe correctly implements input, output, and trigger bindings following the official AZD template patterns.
