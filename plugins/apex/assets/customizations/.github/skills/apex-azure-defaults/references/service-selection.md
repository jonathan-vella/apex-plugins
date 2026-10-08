# Service Selection And WAF Criteria

Use service classes as candidates, not predetermined recommendations. Select services only when requirements, accepted
cost/availability evidence, governance, and architecture decisions support them.

## Elicit Before Selecting

Capture workload pattern, application layers, availability and recovery objectives, compute model, relational and
non-relational data needs, storage semantics, messaging, ingress, observability, compliance, team capability, and known
SKU or commitment preferences. Treat "no preference" as permission to evaluate, not permission to pick from memory.

Do not infer compliance solely from industry, choose an enterprise tier solely from company size, or recommend
Kubernetes when operational requirements do not justify it.

## Candidate Evaluation

For each service candidate, compare:

- Requirement coverage and workload fit
- Security and identity model
- Network and data residency constraints
- Availability, recovery, and scalability objectives
- Accepted regional availability, quota, lifecycle, and cost evidence
- Operational burden, ownership, support model, and migration constraints
- Module/provider support and implementation constraints

Keep at least one viable alternative when the decision is material. Reject candidates with a reason tied to a
requirement, policy, lifecycle limitation, or WAF consequence.

## Well-Architected Questions

| Pillar | Decision prompt |
| --- | --- |
| Security | Does the candidate support the required identity, encryption, private access, and data controls? |
| Reliability | Can it meet accepted availability, RTO, RPO, and backup objectives? |
| Performance | Can it meet projected throughput, latency, and growth needs? |
| Cost | Is the selected SKU/quantity supported by accepted pricing evidence? |
| Operations | Can it provide required diagnostics, health, ownership, and maintenance behavior? |

## Lifecycle And SKU Rules

- Use accepted current evidence for service availability, runtime support, SKU features, quotas, and retirement status.
- Prefer supported GA/LTS versions for durable workloads and avoid deprecated or classic services for greenfield use.
- Treat access tier, redundancy, orchestration mode, hosting plan, and commitment as separate decisions when applicable.
- Do not convert an advisory workload matrix into a locked SKU or price.
- Return a blocker when no candidate satisfies a mandatory requirement or evidence is missing.

## Output

Record selected and rejected candidates with evidence hashes, requirement IDs, WAF consequences, and unresolved
assumptions. Do not turn an advisory service matrix into an automatic SKU decision.
