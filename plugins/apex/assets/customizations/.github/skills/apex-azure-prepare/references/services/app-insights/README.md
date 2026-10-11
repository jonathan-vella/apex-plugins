> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# App Insights

Azure Application Insights for telemetry, monitoring, and APM.

## When to Add

- User wants observability/monitoring
- User mentions telemetry, tracing, or logging
- Production apps needing health visibility

## Implementation

> **→ Invoke the `appinsights-instrumentation` skill**
>
> This skill has detailed guides for:
>
> - Auto-instrumentation (ASP.NET Core on App Service)
> - Manual instrumentation (Node.js, Python, C#)
> - Bicep templates and CLI scripts

## Quick Reference

| Aspect     | Value                           |
| ---------- | ------------------------------- |
| Resource   | `Microsoft.Insights/components` |
| Depends on | Log Analytics Workspace         |
| SKU        | PerGB2018 (consumption-based)   |

## Architecture Notes

- Create in same resource group as the app
- Connect to centralized Log Analytics Workspace
- Use connection string (not instrumentation key) for new apps
