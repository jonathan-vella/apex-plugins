> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# 📦 SKU Manifest - {project-name}

![Artifact](https://img.shields.io/badge/Artifact-SKU%20Manifest-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Draft-orange?style=for-the-badge)
![Schema](https://img.shields.io/badge/Schema-sku--manifest--v1-purple?style=for-the-badge)

<details open>
<summary><strong>📑 Manifest Contents</strong></summary>

- [Overview](#overview)
- [Environments](#environments)
- [Services](#services)
- [Revision History](#revision-history)
- [Open Substitutions](#open-substitutions)

</details>

> Generated/updated by {agent} at Step {step} | {date}
>
> **Companion JSON**: [`workload-decision-manifest-v1`](../references/kernel-boundary.md) — the
> machine-readable source of truth. This markdown view is a rendering
> for human review; agents read the JSON programmatically.

## Overview

| Field            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| Project          | `{project-name}`                                           |
| Default region   | `{default_region}` (per-service `regions[]` inherits this) |
| Schema version   | `sku-manifest-v1`                                          |
| Current revision | `{current_revision}`                                       |
| Last updated     | `{updated_at}`                                             |
| Environments     | `{environments[]}` (comma-separated)                       |
| Service count    | `{services.length}`                                        |

**Scope**: creative SKU decisions only — App Service plans, VMs/VMSS, SQL,
Cosmos, AKS pools, Redis, APIM, App Gateway, Storage replication tiers.

**Out of scope** (do not add to `services[]`): bandwidth, Log Analytics,
vnet, subnet, NSG, route table, public IP, diagnostics. See the `workload-decision-manifest-v1` contract.

## Environments

| Environment | In scope | Notes                    |
| ----------- | -------- | ------------------------ |
| dev         | ✅ / ❌  | {dev environment notes}  |
| test        | ✅ / ❌  | {test environment notes} |
| prod        | ✅ / ❌  | {prod environment notes} |

## Services

> Rendered from `workload-decision-manifest-v1` `services[]`. Per-environment values
> reflect `environment_overrides` on top of the base entry.

| `id`   | Service   | Size (base) | Capacity                                  | Zonal | Regions                 | SLA target / achieved             | Commitment                  | Source                                                   | Rev                   |
| ------ | --------- | ----------- | ----------------------------------------- | ----- | ----------------------- | --------------------------------- | --------------------------- | -------------------------------------------------------- | --------------------- |
| `{id}` | {service} | `{size}`    | `{mode}: {min}-{max} (default {default})` | ✅/❌ | `{primary}, {failover}` | `{sla_target}` / `{sla_achieved}` | `{type}` (`{term_years}yr`) | `user-pin` \| `architect-derived` \| `deploy-substitute` | `{last_modified_rev}` |

### Per-environment overrides

Only services with non-empty `environment_overrides` appear below.

| `id`   | Env     | Size              | Capacity | Zonal | Regions | Commitment | Notes |
| ------ | ------- | ----------------- | -------- | ----- | ------- | ---------- | ----- |
| `{id}` | `{env}` | `{override.size}` | ...      | ...   | ...     | ...        | ...   |

### Feature requirements

| `id`   | `requires[]`                                                | Verified at Step 4 |
| ------ | ----------------------------------------------------------- | ------------------ |
| `{id}` | `vnet-integration`, `private-endpoints`, `managed-identity` | ✅ / ❌            |

### Cost estimate (USD/month)

> Populated by `cost-estimate-subagent` via `manifest_writeback[]` —
> Architect never types prices from parametric knowledge.

| `id`   | `cost_estimate_monthly_usd` | Confidence (from cost JSON) |
| ------ | --------------------------- | --------------------------- |
| `{id}` | `${cost}`                   | `{confidence}`              |

### As-built actual SKUs

> Present accepted completed-operation inventory alongside `workload-decision-manifest-v1`.
> Missing actual values remain unavailable; absence does not prove drift or a live deployment.

| `id`   | Env    | Region      | Planned `size` | `actual_sku`   | Drift               |
| ------ | ------ | ----------- | -------------- | -------------- | ------------------- |
| `{id}` | `prod` | `{primary}` | `{size}`       | `{actual_sku}` | ✅ match / ⚠️ drift |

## Revision History

> Present accepted source revisions and decision/evidence identifiers, not a recall checkpoint lifecycle.

| `rev` | Step | Agent             | Created (UTC) | Summary                                | Changed `id`s | Commit  | Checkpoint |
| ----- | ---- | ----------------- | ------------- | -------------------------------------- | ------------- | ------- | ---------- |
| `1`   | `1`  | `02-Requirements` | `{ts}`        | User-pinned constraints (if any)       | `{ids}`       | `{sha}` | `{ckpt}`   |
| `2`   | `2`  | `03-Architect`    | `{ts}`        | Full SKU authoring from candidate sets | `{ids}`       | `{sha}` | `{ckpt}`   |
| `3`   | `4`  | `05-IaC Planner`  | `{ts}`        | Reconciled with governance findings    | `{ids}`       | `{sha}` | `{ckpt}`   |

## Open Substitutions

> Present accepted substitution decisions and evidence when allocation differs from the selected workload manifest.
> The owning task must invalidate dependent evidence and reapprove affected previews;
> a substitution row does not authorize a changed SKU or apply.

| `id`   | Env / Region             | Planned `size` | Substituted | Reason          | Resolution                                                            |
| ------ | ------------------------ | -------------- | ----------- | --------------- | --------------------------------------------------------------------- |
| `{id}` | `prod` / `swedencentral` | `{old}`        | `{new}`     | quota exhausted | `revert_to_plan` \| `accept_substitute` \| `change_region` \| `abort` |

> **None open** if all SKUs deployed as planned.

---

## References

- [Workload decision presentation](../references/sku-manifest-details.md)
- [Current authority boundary](../references/kernel-boundary.md)
