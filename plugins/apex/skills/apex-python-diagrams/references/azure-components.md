# Azure Component Semantics

Use accepted component IDs, service labels, ARM types and dependencies. The runtime draws labeled nodes, not an
external `diagrams.azure.*` icon catalog. An upstream class name or icon is not proof of a resource, binding or tool.

| Category | Distinctions to preserve |
| --- | --- |
| Compute | AKS cluster versus node pool; VM versus VM scale set; App Service plan versus site |
| Networking | VNet/subnet containment, ingress, routing, DNS and private endpoints are different relationships |
| Database | SQL/Cosmos/cache instances, replicas and failover intent; do not draw inferred live replication |
| Storage | Account/service/container/share boundaries and intended redundancy; redundancy is not backup |
| Integration | Queue versus topic/subscription, Event Grid delivery versus Event Hubs streaming |
| Security | Key Vault reference, network boundary and policy control; never draw secret values |
| Identity | User/service/managed identities and authorization edges; no physical principal identifiers or tokens |
| AI/ML | Inference endpoint versus training/job/storage dependency; no invented model deployment |
| Analytics | Ingestion, durable lake, transformation and serving flows; distinguish data from control plane |
| IoT | Device/ingestion/processing boundaries and trust; do not include real device credentials |
| DevOps | Source/build/deploy relationships as intended handoff, never automatic approval |
| Web | Public entry, frontend/API and downstream services only if accepted |
| Monitoring | Telemetry producer, collection and analysis; a drawn diagnostic edge is not verified observability |

Choose the exact accepted service label even when the upstream library has a similar old class name. Check lifecycle
facts with current official evidence if a material service replacement is proposed; do not silently rewrite intent.

Do not infer Azure defaults, SKU, region, tags or resource names from a chart. Their owner is the accepted
workload-decision manifest and the managed defaults/governance contract. Supplied platform references remain visibly
distinct from managed workload resources.

Missing type/edge/ownership input is a clarification or unsupported-data blocker, not an invitation to guess.
