---
name: apex-azure-kubernetes
description: '**ANALYSIS SKILL** — Advises AKS design, identity, networking, pools and sizing. WHEN: "design AKS", "Automatic or Standard", "AKS networking", "workload identity", "rightsize AKS pods", "VPA", "AKS autoscaler", "AKS Spot", "deployment safeguards". DO NOT USE FOR: incidents (apex-azure-diagnostics), standalone VM/spend advice, cluster creation or upgrades.'
user-invocable: false
disable-model-invocation: false
---

# APEX Azure Kubernetes

Use this skill as domain advisory input to an existing architecture, planning or assessment task. It does not own a
cluster workflow. The deterministic kernel owns state, evidence acceptance, approvals and next tasks. When calling
an available `apex/*` tool, supply the current checkout's absolute `workspace`.

## Prerequisites

- Accepted task context identifies the workload, environment, approved subscription/resource scope, requirements,
  governance, networking, availability objectives, cost constraints and selected IaC track.
- For existing-cluster recommendations, identify the cluster, namespace/workload boundary, observation window,
  monitoring coverage and accepted evidence references. Do not discover or select a different target.
- Use [managed Azure defaults](../apex-azure-defaults/SKILL.md) and accepted governance for naming, tags, regions,
  security, subnet sizing and AVM pins. Obtain node SKUs from `workload-decision-manifest-v1`, not prose defaults.
- Current service, region, Kubernetes version and module documentation must support the proposed feature. Missing
  support is an unresolved assumption or blocker for the affected recommendation, not permission to guess.

## Design Method

1. Separate expensive Day-0 decisions (cluster mode, IP model, API access, identity, addressing) from Day-1 feature
   candidates. Record requirement, alternatives, trade-offs and change consequences for each decision.
2. Compare AKS Automatic's managed configuration with Standard's control of pools, networking and autoscaling.
   Automatic is an upstream starting candidate, not an unconditional default; verify Node Auto-Provisioning and
   exact AVM support against accepted requirements before recommending either mode.
3. Design networking: Azure CNI Overlay versus VNet-routable pod IPs; Cilium dataplane/network policy; restricted
   egress through UDR/firewall or an appropriate stable-egress option; private API access for the required security
   posture. Assess ingress and Gateway API routing, Istio service mesh, mTLS, canary rollout and Application Gateway
   for Containers as justified alternatives.
   Verify current support, WAF integration, DNS/LocalDNS, connected-network overlap and upgrade IP headroom.
4. Model Microsoft Entra control-plane authorization, local-account restrictions, pod federation and image access.
   Use [workload identity](./references/workload-identity.md) and [safeguards](./references/safeguards.md);
   CSI/Key Vault integration is design intent, never permission to retrieve secrets.
5. Plan separate system/user pools, system-pod isolation, topology spread, replicas, disruption budgets and probe
   behavior. Model failure-domain and system-pool capacity rather than treating a fixed node count as an SLA.
6. Compare ephemeral OS disks, supported node OS choices, KEDA/HPA, maintenance windows, supported Kubernetes/LTS
   channels and Fleet staged-rollout options. These are recommendations, not upgrades or performance proof.
7. Identify Prometheus, Container Insights, Grafana, control-plane/audit logging, retention and ingestion costs.
   Use the relevant sizing reference below; do not enable monitoring to fill an evidence gap.
8. Return bounded decisions and evidence gaps to the existing task. Quota, SKU availability and allocation remain
   assumptions at design stage unless accepted observations exist; do not invent live checks or new workflow gates.

## On-Demand References

| Topic | Load when needed |
| --- | --- |
| Pod requests, limits, historical coverage and sidecars | [Rightsizing](./references/azure-aks-rightsizing.md) |
| Recommendation-only VPA and autoscaler interaction | [VPA](./references/azure-aks-vpa.md) |
| Node capacity, scale-down and disruption constraints | [Cluster autoscaler](./references/azure-aks-autoscaler.md) |
| Interruptibility, fallback and eviction handling | [Spot pools](./references/azure-aks-spot.md) |
| OIDC, service accounts and per-service authorization | [Workload identity](./references/workload-identity.md) |
| Workload admission design checklist | [Deployment safeguards](./references/safeguards.md) |
| Observation commands and unavailable access | [CLI boundary](./references/cli-reference.md) |
| Exact source inventory and adaptations | [Upstream coverage](./references/upstream-coverage.md) |

## Boundaries

- Tool names and commands in references are capability hints, not tool grants. Use only installed, granted,
  task-scoped observation capabilities with safe projections. Preserve source, timestamp, scope, completeness,
  redactions and uncertainty; an observation is not accepted evidence until the kernel accepts it.
- No kubeconfig retrieval, credentials, keys, token reads, secret data, downloads, installs or generic execution.
  Do not run `kubectl exec`, debug pods, port forwarding, cordon/drain, apply/patch/delete, nodepool changes,
  cluster stop/start/reset, identity assignments or Kubernetes/node OS upgrades.
- Supported resource changes require the owning task's current kernel-created preview, Gate 4 approval and trusted
  execution. Current execution is Bicep through azd provision/preview/down or native Terraform with an exact saved
  plan. Application delivery and arbitrary cluster operations are not implied; production fails closed.
- Return an explicit unsupported-operation blocker for AKS runtime upgrades, workload application, direct cluster
  operations or missing trusted executors. Neither a user request nor a good design supplies an executor.
- Do not emit or modify application manifests, app source or IaC here. Illustrative YAML is implementation context
  for the authorized owner, not an instruction to apply it.
- Price proposed resources only through the granted official Azure MCP pricing capability using the
  [cap-aware pricing contract](../apex-azure-defaults/references/retail-pricing.md). Capped/partial results remain
  unpriced; no claimed discount, saving or performance gain without evidence.

## Output

Return requirement-linked Day-0/Day-1 decisions, target scope, manifest SKU references, topology/identity/network
intent, workload sizing rationale, disruption and rollback concerns, source/time/coverage, assumptions, blockers and
the kernel-provided next task. Examples of blockers: missing pod history for P95 sizing, no granted cluster observation,
unknown CIDR overlap, unverified module feature support, or a requested runtime upgrade with no supported executor.

## Official Verification

The pinned source is historical, not current lifecycle evidence. Verify changing feature/status claims against
[AKS concepts](https://learn.microsoft.com/azure/aks/concepts-clusters-workloads),
[AKS Automatic](https://learn.microsoft.com/azure/aks/intro-aks-automatic),
[CNI Overlay](https://learn.microsoft.com/azure/aks/azure-cni-overlay) and
[AKS upgrades](https://learn.microsoft.com/azure/aks/upgrade-cluster).
Record the documentation version/date and unresolved differences.
