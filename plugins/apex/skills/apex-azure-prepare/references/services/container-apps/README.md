> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Azure Container Apps

Serverless container hosting for microservices, APIs, and background workers.

## When to Use

- Microservices and APIs
- Background processing workers
- Event-driven applications
- Web applications (server-rendered)
- Any containerized workload that doesn't need full Kubernetes

## Service Type in azure.yaml

```yaml
services:
  my-api:
    host: containerapp
    project: ./src/my-api
    docker:
      path: ./Dockerfile
```

## Required Supporting Resources

| Resource                   | Purpose             |
| -------------------------- | ------------------- |
| Container Apps Environment | Hosting environment |
| Container Registry         | Image storage       |
| Log Analytics Workspace    | Logging             |
| Application Insights       | Monitoring          |

## Common Configurations

| Workload Type     | Ingress  | Min Replicas          | Scaling     |
| ----------------- | -------- | --------------------- | ----------- |
| API Service       | External | 1 (avoid cold starts) | HTTP-based  |
| Background Worker | None     | 0 (scale to zero)     | Queue-based |
| Web Application   | External | 1                     | HTTP-based  |

## References

- [Bicep Patterns](bicep.md)
- [Scaling Patterns](scaling.md)
- [Health Probes](health-probes.md)
- [Environment Variables](environment.md)
- [Networking](networking.md)
- [Revisions and Traffic Splitting](revisions.md)
- [Day-2 Operations](day2-operations.md)
- [Terraform Patterns](terraform.md)
