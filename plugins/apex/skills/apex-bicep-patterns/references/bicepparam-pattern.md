<!-- ref:bicepparam-pattern-v1 -->

# Environment-Neutral Bicep Parameters

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md). The accepted binding and CodeGen capability determine supported
parameter materialization; this reference does not introduce an environment-manifest file or deploy worker.

## Syntax

Environment-specific IDs, email addresses and secrets must not be defaults in committed modules.
For an accepted binding supporting environment-variable parameterization, Bicep's `readEnvironmentVariable()`
(CLI 0.21+) provides this syntax:

```bicep
using './main.bicep'

param projectName = readEnvironmentVariable('APEX_PROJECT')
param subscriptionId = readEnvironmentVariable('APEX_SUBSCRIPTION_ID')
param tenantId = readEnvironmentVariable('APEX_TENANT_ID')
param deployerObjectId = readEnvironmentVariable('APEX_DEPLOYER_OBJECT_ID')
param existingApiAppObjectId = readEnvironmentVariable('APEX_EXISTING_API_APP_OBJECT_ID')
param alertEmails = split(readEnvironmentVariable('APEX_ALERT_EMAILS'), ',')
param budgetMonthlyUsd = int(readEnvironmentVariable('APEX_BUDGET_MONTHLY_USD'))
```

These names are illustrative, not shipped runtime environment variables. Confirm the accepted toolchain and binding
support this mechanism; otherwise record a capability blocker rather than exporting invented inputs.
Use secure parameter references for secrets; never print them.

## Acceptance

- Derive exposed parameters from the accepted selected-track binding, not a source template.
- Keep modules environment-neutral and bind each environment's values through an authorized capability.
- Document required input names and parameter-to-source mappings in the accepted generation receipt.
- Bind validation to the exact parameter/module tree and dependency revision; compilation must use the actual values
  or safe authorized fixtures, with secrets redacted.
- Preview and Gate 4 bind the same parameter materialization used for deployment.

Do not hardcode environment GUID defaults, secret defaults, or a `prod` ternary containing subscription IDs.
A syntax/build result is not acceptance or apply approval; only kernel-accepted receipts advance the task.
