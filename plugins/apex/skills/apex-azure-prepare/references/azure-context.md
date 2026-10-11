<!-- ref:azure-context-v1 -->

# Azure Context, Confirmation and Diagnostics

Adapted from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
Read [the authority boundary](kernel-boundary.md).

## Confirmation Reuse

Obtain the accepted tenant, subscription, environment, location and confirmation/evidence identifiers from
`apex/taskContext`. Reuse unchanged confirmation. Re-ask only for a changed scope, conflicting inputs, explicit user
change, absent confirmation or invalidated evidence. A CLI default or environment variable alone is not approval.
After compaction, recover accepted kernel context rather than inferring a decision from chat or source files.

Reuse skips repeated selection questions, not required current permissions, policy, freshness or readiness checks.
Neither confirmation nor a quota observation authorizes deployment.

## Read-Only azd and CLI Context

The following observations can explain configuration mismatches:

```bash
azd env list
azd config get defaults
az account show --query "{name:name,id:id,tenantId:tenantId}" --output json
az account list --query "[].{name:name,id:id,tenantId:tenantId}" --output table
```

`azd env get-values` may reveal secrets. Use it only with the task's disclosure authorization and redact values;
never copy credential-bearing output into an artifact or transcript. Compare selected environment, subscription,
tenant and location with accepted context. A mismatch blocks dependent evidence; do not silently repair it.

For a missing choice, APEX asks in chat showing the actual subscription name/ID or location and consequences.
Do not invent a “recommended” region; use runtime defaults and accepted availability assumptions.
Local azd selection/configuration changes require an authorized workspace capability.

## Provisioning Limits

Record each proposed resource's quantity and normalized demand, including autoscale/surge. If the active task requires
quota evidence, preserve live usage/limit, scope, quota name, units, collection time and diagnostics.
Only diagnose fallback after unsupported capability is established; `BadRequest` alone is insufficient.
Unknown, stale or invalid evidence means unknown headroom, never unlimited quota.

See [binding quota diagnostics](plan-template.md#provisioning-demand-and-evidence),
[limits/quotas](resources-limits-quotas.md) and [region availability](region-availability.md).
Inventory counts apply only to documented count quotas; vCPU quotas require SKU-normalized demand and family/regional
totals. Static catalogs do not prove regional capacity. Architecture records assumptions without fabricating proof.
Changing region or requesting increased quota is a separate decision; a quota mutation still requires Gate 4.
