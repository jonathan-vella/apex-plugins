# Module Interfaces And Parameters

Read this reference when a Bicep binding introduces a reusable module or environment-specific inputs.

## Stable Module Interface

Give reusable modules a predictable contract so composition, diagnostics, identity, and downstream dependencies do not
rely on module-specific guesswork.

Required inputs normally include:

- `name`
- `location`
- `tags`
- the accepted monitoring workspace binding when the resource supports diagnostics

Required outputs normally include:

- `resourceId`
- `resourceName`
- `principalId` when managed identity is supported

When a resource has no managed identity, expose an explicitly optional or empty principal value according to the typed
binding contract. Do not invent an identity merely to satisfy a uniform output shape.

Add service-specific inputs and outputs only when a downstream binding needs them. Keep secrets out of outputs, and do
not leak generated credentials through module composition.

## Environment Inputs

Keep the generated Bicep tree environment-neutral. Environment-specific subscription IDs, tenant IDs, object IDs,
notification recipients, budget values, and existing-resource bindings must come from the accepted environment input
contract rather than literals or environment branches in `main.bicep`.

Use `.bicepparam` files as generated binding surfaces when the selected toolchain supports them. Each parameter must map
to an accepted typed input. Values resolved at deployment time remain unresolved in source; CodeGen must not fabricate a
placeholder GUID, address, secret, or recipient.

Reject these patterns:

- project-specific GUIDs or subscription IDs embedded in Bicep or parameter files
- secret defaults
- production and non-production identifiers selected by conditional literals in `main.bicep`
- parameters that are not present in the accepted IaC binding contract
- environment input names that are silently renamed between planning, CodeGen, and deployment

## Acceptance Check

Before staging CodeGen intent, verify:

- every module input traces to accepted architecture, governance, defaults, or environment intent
- every output has a known consumer or documented compatibility purpose
- required monitoring and identity bindings are explicit
- environment-specific values remain external to the generated source tree
- parameter names and types match the selected module interface
- missing deploy-time values return a blocker instead of a generated placeholder
