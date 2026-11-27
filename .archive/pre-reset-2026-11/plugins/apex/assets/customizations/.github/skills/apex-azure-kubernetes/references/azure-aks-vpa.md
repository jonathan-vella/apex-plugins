# AKS Vertical Pod Autoscaler

## Recommendation-Only Design

VPA can recommend container CPU/memory requests from observed usage. Start any proposed evaluation with
`updateMode: "Off"` so the VPA controller does not automatically update pods. **Creating the VPA resource or
enabling the AKS add-on still changes state**; recommendation-only mode does not authorize installation.

The parent skill does not enable VPA, create objects, patch deployments or auto-apply recommendations.
Compare current AKS support, version, controller availability, workload compatibility and accepted governance first.
If the add-on is absent, return an implementation proposal or unsupported-capability blocker, not an enable command.

Implementation context only, not a complete applyable manifest:

```yaml
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: "<deployment>"
  updatePolicy:
    updateMode: "Off"
```

## Reading Existing Recommendations

Only with existing approved cluster access and a granted scoped observation capability:

```bash
kubectl --context "<accepted-context>" --namespace "<namespace>" get vpa "<vpa>" \
  -o jsonpath='{.status.recommendation}'
```

Read `lowerBound`, `target`, `upperBound` and each container's name. Missing recommendations are missing evidence,
not zero requirements. The source's 24-hour collection suggestion is a minimum example, not sufficient proof of
representative peaks. Record recommendation age, collection coverage and startup/seasonality limits.

## Recommendation Interpretation

- Cross-check VPA targets with [rightsizing](./azure-aks-rightsizing.md), OOM history, throttling and latency.
- Check HPA resource metrics: VPA request updates can conflict with CPU/memory-based HPA decisions. Consider
  independent/external metrics only when supported and appropriate to the workload.
- Automatic VPA modes can recreate/evict pods or use version-dependent in-place behavior. Do not assert no downtime.
  Check PDBs, singleton/stateful workloads and current mode semantics.
- Translate a reviewed recommendation into intent for the existing implementation task, with previous requests,
  bounds, regression expectations and rollback criteria. Do not produce a live patch or claim savings.

Verify [VPA on AKS](https://learn.microsoft.com/azure/aks/vertical-pod-autoscaler)
for currently supported modes and limitations. Production remains fail-closed under the parent skill's boundary.
