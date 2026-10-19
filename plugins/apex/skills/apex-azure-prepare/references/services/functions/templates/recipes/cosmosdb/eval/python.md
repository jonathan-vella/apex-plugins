> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Cosmos DB Recipe - Python Eval

## Test Summary

| Test              | Status  | Notes                                   |
| ----------------- | ------- | --------------------------------------- |
| Code Syntax       | ✅ PASS | Python v2 model decorator pattern       |
| Cosmos DB Trigger | ✅ PASS | Uses `@app.cosmos_db_trigger` decorator |
| Change Feed       | ✅ PASS | Processes DocumentList                  |
| Lease Container   | ✅ PASS | Auto-creates lease container            |

## Code Validation

```python
# Validated patterns:
# - @app.cosmos_db_trigger with container_name, database_name
# - connection="COSMOS_CONNECTION" (UAMI binding)
# - lease_container_name for change feed tracking
# - Processes func.DocumentList
```

## Configuration Validated

- `COSMOS_CONNECTION__accountEndpoint` - Cosmos endpoint
- `COSMOS_DATABASE_NAME` - Database name
- `COSMOS_CONTAINER_NAME` - Container name
- Uses extension bundle v4 (no pip package needed)

## Test Date

2025-02-18

## Verdict

**PASS** - Cosmos DB recipe correctly implements change feed trigger with proper v2 model decorators and UAMI binding pattern.
