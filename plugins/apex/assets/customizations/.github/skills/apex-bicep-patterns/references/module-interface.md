<!-- ref:module-interface-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Module Interface — Canonical Example

> The standard module-interface contract every Bicep module in this
> repo follows. Loaded by `apex-bicep-patterns` SKILL.md when authoring
> a new module or auditing an existing one for shape compliance.

```bicep
// modules/storage.bicep — every module follows this contract
@description('Storage account name')
param name string
param location string
param tags object
param logAnalyticsWorkspaceName string

output resourceId string = storageAccount.id
output resourceName string = storageAccount.name
output principalId string? = storageAccount.identity.?principalId
```

**Inputs (required)**: `name`, `location`, `tags`, `logAnalyticsWorkspaceName`.

**Outputs (required)**: `resourceId`, `resourceName`, `principalId` (nullable: use the safe-access operator
`.?principalId` so modules without managed identity return null instead of a synthesized empty identifier;
consumers guard role assignments on a non-null value).

**Why this contract**: keeps `main.bicep` composable, makes diagnostic settings wiring
mechanical (always pass `logAnalyticsWorkspaceName`), and gives downstream RBAC modules a
predictable principal-id source.
