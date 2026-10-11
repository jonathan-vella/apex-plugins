> **APEX reference.** Read [execution boundaries](../execution-boundaries.md) first. Read-only commands stay within the
> accepted task scope.
> Mutation examples are provider context, never direct agent instructions; they need a fresh preview, current Gate 4 and
> trusted execution.
> CP-26 azd/pipeline operations are planned, not available. Examples do not create kernel artifacts, approvals or
> native-provider lifecycle authority.

# Network Policy Troubleshooting

Use this guide when pod-to-pod or pod-to-service traffic is selectively blocked and the symptom points at ingress or
egress filtering.

```bash
# List all policies in the namespace - check both ingress and egress
kubectl get networkpolicy -n <ns> -o yaml

# Check for a default-deny policy (blocks everything unless explicitly allowed)
kubectl get networkpolicy -n <ns> -o jsonpath='{range .items[?(@.spec.podSelector=={})]}{.metadata.name}{"\n"}{end}'
```

**AKS network policy engine check:** Azure NPM (Azure CNI): `kubectl get pods -n kube-system -l k8s-app=azure-npm`.
Calico: `kubectl get pods -n calico-system`.

Policy audit: source labels, destination labels, destination ingress rules, and source egress rules must all line up.
With default-deny, explicitly allow UDP/TCP 53 to kube-dns.

## Port Source

Adapted from [the pinned upstream
file](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-diagnostics/references/aks/network-policy.md).
Load only the reference needed for the active task.
