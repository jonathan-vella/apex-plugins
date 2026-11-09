# AKS Deployment Safeguards

## Interpretation

The source's DS001–DS013 labels are a workload design checklist, not proof of the currently assigned Azure Policy
initiative or its effects. Compare the accepted policy contract, current initiative definitions, exemptions and
cluster configuration. Do not assert compliance because a manifest resembles this list.

No auto-fix executor is imported. Findings are advisory input to the existing implementation task; this skill does
not alter manifests, admission settings or policies. Error/warning labels below preserve **source classifications**,
not effective enforcement in the target cluster.

| Source rule | Source severity | Design check |
| --- | --- | --- |
| DS001 | Error | Every container declares appropriate CPU/memory requests and limits |
| DS002 | Warning | Liveness probe reflects actual process health |
| DS003 | Warning | Readiness probe controls whether the workload should receive traffic |
| DS004 | Error | `runAsNonRoot` is set at both pod and container level as required by effective policy |
| DS005 | Error | No host networking (`hostNetwork`) |
| DS006 | Error | No host process namespace (`hostPID`) |
| DS007 | Error | No host IPC namespace (`hostIPC`) |
| DS008 | Error | No privileged containers |
| DS009 | Error | Pin approved image versions/digests; no `latest` or untagged mutable images |
| DS010 | Warning | Multiple replicas with workload-appropriate PDB/topology design |
| DS011 | Error | Containers set `allowPrivilegeEscalation: false` |
| DS012 | Warning | Containers use `readOnlyRootFilesystem: true` with explicit writable mounts if needed |
| DS013 | Warning | Disable the default service-account token mount unless Kubernetes API access is justified |

## Application Consequences

- Requests and limits need [workload sizing evidence](./azure-aks-rightsizing.md), not arbitrary quantities.
- Prefer HTTP/TCP probes where appropriate. A manifest's possible `exec` probe is implementation context only;
  it never authorizes this skill to execute in a container. Avoid expensive dependency checks in liveness probes.
- The source's minimum two replicas is a starting availability heuristic, not a zone-failure guarantee.
  PDBs and replicas do not prevent involuntary node/Spot failure.
- Nonroot/read-only-root settings may expose application write-path assumptions. The owner can design bounded
  ephemeral writable volumes for caches/runtime files without relaxing the whole root filesystem. Consider data
  sensitivity and volume loss on restart; do not add shell helpers or write local files to test this.
- Image digest selection and signatures require trusted supply-chain evidence; the skill cannot repair an unknown
  image tag by guessing a version.
- Workload Identity uses a separate projected volume and can coexist with
  `automountServiceAccountToken: false`; see [identity](./workload-identity.md).
- A requested policy exception is an unresolved governance decision, never a bypass or automatic exemption.

## Output

Return each applicable rule, relevant resource/container, observed configuration, accepted policy reference,
uncertainty, application consequence and proposed owner action. Mark unobserved fields unknown, not compliant.
No blanket "all safeguards passed" claim follows from this checklist.

Verify [AKS deployment safeguards](https://learn.microsoft.com/azure/aks/deployment-safeguards)
and [Azure Policy for Kubernetes](https://learn.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes).
