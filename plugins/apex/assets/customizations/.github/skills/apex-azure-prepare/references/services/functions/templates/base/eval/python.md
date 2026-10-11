> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Base HTTP Template - Python Eval

## Test Summary

| Test            | Status  | Notes                                     |
| --------------- | ------- | ----------------------------------------- |
| Code Syntax     | ✅ PASS | AST parse successful                      |
| Function Routes | ✅ PASS | /api/hello, /api/health defined           |
| v2 Model        | ✅ PASS | Uses `func.FunctionApp()` decorator model |
| Health Endpoint | ✅ PASS | Anonymous auth, JSON response             |

## Code Validation

```python
# Validated syntax and structure
import ast
with open('function_app.py') as f:
    ast.parse(f.read())
# ✅ Code syntax valid
```

## Test Date

2025-02-18

## Template Source

Generated from base template using `func init --python -m V2`

## Verdict

**PASS** - Base HTTP template code validates correctly for Python v2 model.
