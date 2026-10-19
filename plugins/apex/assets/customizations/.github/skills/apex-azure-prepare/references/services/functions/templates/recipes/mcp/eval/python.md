> MCP names in this reference are upstream pseudo-interfaces, not current vNext tool registrations.
> Use only capabilities projected by the active task; unavailable tools are blockers, never substitutes.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../../../../../references/kernel-boundary.md) before using this
> reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# MCP Recipe Evaluation

**Date:** 2026-02-19T04:35:00Z
**Recipe:** mcp
**Language:** Python
**Status:** Historical direct-call result, superseded for protocol readiness. **UNVERIFIED: STOP.**
See the [verification gate](../README.md#verification-gate). This record did not test MCP initialization,
standard `inputSchema`, content results or SDK client negotiation. Preserve it as historical evidence only.

## Deployment

| Property       | Value                                  |
| -------------- | -------------------------------------- |
| Function App   | `func-api-jrfqkfm6l63is`               |
| Resource Group | `rg-mcp-func-dev`                      |
| Region         | eastus2                                |
| Base Template  | `functions-quickstart-python-http-azd` |

## Test Results

### Health Endpoint

```json
{ "status": "healthy", "type": "mcp", "tools": ["get_weather", "search_docs"] }
```

### tools/list

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {...}
      },
      {
        "name": "search_docs",
        "description": "Search documentation for a query",
        "parameters": {...}
      }
    ]
  },
  "id": 1
}
```

### tools/call - get_weather

```json
{
  "jsonrpc": "2.0",
  "result": {
    "city": "Seattle",
    "temperature": 72,
    "conditions": "Sunny"
  },
  "id": 2
}
```

### tools/call - search_docs

```json
{
  "jsonrpc": "2.0",
  "result": {
    "results": ["Doc 1 about Azure Functions", "Doc 2 about Azure Functions"]
  },
  "id": 3
}
```

## Functions Deployed

- `mcp_handler` - POST /api/mcp (JSON-RPC endpoint)
- `health_check` - GET /api/health

## Verdict

Historical claims below are not current acceptance evidence:

- JSON-RPC 2.0 protocol implemented
- `tools/list` returns tool definitions with schemas
- `tools/call` executes tools and returns results
- AI agent integration remains blocked pending an actual SDK client handshake and transport tests.
