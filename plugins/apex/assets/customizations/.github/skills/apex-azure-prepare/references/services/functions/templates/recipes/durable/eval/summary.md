> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Eval Summary

## Coverage Status

| Language   | Source | Eval | Status  |
| ---------- | ------ | ---- | ------- |
| Python     | ✅     | ✅   | PASS    |
| TypeScript | ✅     | 🔲   | Pending |
| JavaScript | ✅     | 🔲   | Pending |
| C# (.NET)  | ✅     | 🔲   | Pending |
| Java       | ✅     | 🔲   | Pending |
| PowerShell | ✅     | 🔲   | Pending |

## Results

| Test                 | Python | TypeScript | JavaScript | .NET | Java | PowerShell |
| -------------------- | ------ | ---------- | ---------- | ---- | ---- | ---------- |
| Health               | ✅     | -          | -          | -    | -    | -          |
| Orchestration starts | ✅     | -          | -          | -    | -    | -          |
| Activities complete  | ✅     | -          | -          | -    | -    | -          |
| Status query works   | ✅     | -          | -          | -    | -    | -          |

## Notes

Requires storage flags:

- `enableQueue: true`
- `enableTable: true`
