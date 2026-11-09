# Architecture Pattern Interpretation

These patterns preserve the upstream topology questions. They are not deployment templates or a menu that overrides
accepted Architecture. The supported renderer consumes accepted components and `dependsOn`; it does not execute the
upstream Python `Diagram`/`Cluster` snippets or infer network/data-flow semantics absent from the contract.

| Pattern | Relationships to verify | Common misleading shortcut |
| --- | --- | --- |
| Three-tier web | External entry → frontend/API → accepted data dependencies; separate identity/secret references | Adding CDN, gateway, cache or public storage merely because a reference uses them |
| AKS microservices | Ingress, cluster, registry, messaging/data and monitoring boundaries | Treating registry pull or telemetry edges as workload-to-workload traffic |
| Serverless/event-driven | Event source → trigger/processing → output; queue/topic versus event notification | Drawing synchronous success for asynchronous delivery or assuming exactly-once behavior |
| Data platform | Sources → ingestion → durable storage → transform → serving | Mixing metadata orchestration with payload movement; inventing an analytics tier |
| Hub/spoke networking | Supplied hub, workload spokes/subnets, transit, DNS and private endpoints | Claiming authority to create or modify an ALZ hub or platform route |
| Private endpoint | Consumer route/DNS → private endpoint → service boundary | Treating a private endpoint as proof public access is disabled or DNS resolves correctly |
| Multi-region | Region groups, entry/failover intent, replicated data and recovery dependencies | Displaying active-active/automatic failover or tested recovery without accepted evidence |
| Hybrid/integration | On-premises trust boundary, approved connectivity, Azure entry and data services | Inventing an ExpressRoute/VPN circuit, bandwidth or security posture |

## Readability and Fidelity

- Keep graph direction consistent and label exceptional reverse/data/control relationships.
- Group by the accepted boundary (workload, environment, region or ownership); do not create a cluster hierarchy
  that implies a real subnet/resource group when none is accepted.
- Prefer explicit node-to-node edges over ambiguous grouped list edges. A dependency arrow is not automatically
  a packet path, IAM grant, encryption guarantee or availability promise.
- Separate security/reference dependencies from processing/data flow in any future renderer that supports both.
- Identify omitted components/truncated labels and link their full accepted source hashes rather than silently
  dropping material relationships.

Example: accepted `api.dependsOn = ["store"]` means the topology retains the `store` dependency of `api`. It does not
establish an observed endpoint, network port, managed-identity role assignment or healthy connection.

If the user needs unsupported layout controls, icons, network overlays or a dedicated runtime-sequence view,
return a renderer capability gap instead of editing SVG/PNG/Python after generation.
