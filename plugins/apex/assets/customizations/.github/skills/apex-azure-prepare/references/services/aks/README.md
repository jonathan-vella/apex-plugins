> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Kubernetes Service (AKS)

Full Kubernetes orchestration for complex containerized workloads.

For Day-0 cluster design (Automatic vs Standard, networking, identity, node pools), use `apex-azure-kubernetes`.

## When to Use

- Complex microservices requiring Kubernetes orchestration
- Teams with Kubernetes expertise
- Workloads needing fine-grained infrastructure control
- Multi-container pods with sidecars
- Custom networking requirements
- Hybrid/multi-cloud Kubernetes strategies

## Service Type in azure.yaml

```yaml
services:
  my-service:
    host: aks
    project: ./src/my-service
    docker:
      path: ./Dockerfile
    k8s:
      deploymentPath: ./k8s
```

## Supporting Resources

The cluster needs no other resource to exist. Add each integration only when the accepted design calls for it.

| Resource                | Purpose                | Add when                                                           |
| ----------------------- | ---------------------- | ------------------------------------------------------------------ |
| Container Registry      | Image storage          | Workloads pull private images; grant the kubelet identity AcrPull  |
| Log Analytics Workspace | Container Insights     | The design enables Container Insights or other Azure Monitor logs  |
| Virtual Network         | Network isolation      | Custom networking or private cluster requirements                  |
| Key Vault               | Secrets management     | Optional; only for secrets that cannot use workload identity or Entra authentication, read through the Key Vault CSI provider add-on   |

## Node Pool Types

| Pool   | Purpose                                 |
| ------ | --------------------------------------- |
| System | Cluster infrastructure; at least 2 nodes for a production cluster with one system pool, 3 recommended for resilience across availability zones |
| User   | Application workloads, auto-scaling     |

## References

- [Bicep Patterns](bicep.md)
- [K8s Manifests](manifests.md)
- [Add-ons](addons.md)
