# Kubernetes Upstream Coverage

## Authority

- Repository: `jonathan-vella/apex`.
- Exact approved commit: `c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
- Source root: `.github/skills/apex-azure-kubernetes/`.
- [Pinned tree](https://github.com/jonathan-vella/apex/tree/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-kubernetes).
- Scope: #384 CP-18 and #401 CP-21 managed domain guidance.

All eight source files were retrieved with `gh api` at the exact commit and inspected as data. No upstream commands,
scripts or workflow instructions were executed. This record adds provenance, not runtime authority.

## File Dispositions

Paths below are relative to the source root; destination paths are identical within this managed tree.

| Source file | Disposition and retained knowledge |
| --- | --- |
| `SKILL.md` | Adapted: Automatic/Standard, Day-0/Day-1 network/identity, ingress/egress/DNS, observability, pools, OS, upgrades, topology and cost options |
| `references/azure-aks-autoscaler.md` | Adapted: pool discovery, utilization, min/max rationale, profile comparisons, eviction/system-pod risks and rollback baseline |
| `references/azure-aks-rightsizing.md` | Adapted: monitoring discovery, metric names/units, live versus historical evidence, per-container/sidecar requests, P95 heuristics and limit context |
| `references/azure-aks-spot.md` | Adapted: suitability, mixed capacity, taints/tolerations, selector fallback limits, price/eviction settings and shutdown/checkpoint planning |
| `references/azure-aks-vpa.md` | Adapted: recommendation-only mode, lower/target/upper bounds, sampling and HPA/disruption consequences |
| `references/cli-reference.md` | Adapted: exact-scope safe metadata reads; credential retrieval explicitly rejected |
| `references/safeguards.md` | Adapted: all DS001–DS013 checks and source severities; policy acceptance and application consequences replace auto-fix claims |
| `references/workload-identity.md` | Adapted: identity/federation/service-account chain, projected token semantics, labels/annotations and PostgreSQL/Key Vault/Storage/AMR authorization |

## Adaptations and Exclusions

- Removed legacy numbered-agent handoffs and autonomous workflow authority. Existing tasks and deterministic kernel
  own evidence/state/approval; no registries, manifests, executors or required gates are added here.
- Replaced inline Azure region/tag/SKU/AVM defaults with canonical managed defaults, accepted governance and
  `workload-decision-manifest-v1`. Numeric pool/profile/sizing examples are explicitly conditional heuristics.
- Replaced cost-subagent routing with the official Azure MCP cap-aware pricing contract; unavailable/capped results
  remain unpriced. Quota, allocation, performance and recovery are not assumed tested.
- Excluded all mutation recipes (`az aks update/nodepool add`, VPA/PDB apply, profile reset), kubeconfig retrieval,
  automatic workload patches and shell lifecycle hooks. Retained configuration intent and risks, not execution.
- Replaced SDK code that fetches tokens/secrets or connects to databases/caches with complete identity and
  authorization considerations. No application code, Python helper, script or dependency was added.
- Corrected unsafe source inferences: hourly means are not raw-sample P95, PDBs do not prevent Spot evictions, a
  toleration does not guarantee regular fallback, and token/role metadata does not prove effective data access.
- Source feature defaults, region support, LTS/version choices, eviction timing and SDK behavior are frozen claims
  needing current official verification, never lifecycle facts established by this import.
- Supported execution stays Bicep azd provision/preview/down or native Terraform saved-plan execution under current
  kernel approval; arbitrary AKS/runtime/workload operations are unsupported and production fails closed.

No source file is silently omitted; `upstream-coverage.md` is the only new non-source reference.
