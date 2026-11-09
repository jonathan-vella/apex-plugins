# Authentication and Runtime Sequence Guidance

Reference-only: the current renderer has no typed runtime-sequence source or custom sequence output.

## Sequence Semantics

- Name each participant, trust boundary and accountable owner from accepted design.
- Order request, authentication, token issuance, API call, authorization, response and error branches distinctly.
- Distinguish browser/server/workload flows and control-plane versus data-plane authorization.
- Use labels for protocol/action and data classification, never actual tokens, credentials or sensitive payloads.
- A dependency edge does not establish message order, mutual authentication or network reachability.

## Identity Patterns to Preserve

| Pattern | Relevant distinctions |
| --- | --- |
| Interactive authorization code | User agent, client, identity provider, callback and code exchange; PKCE/consent only if accepted |
| Managed identity/workload identity | Workload, credential/token boundary, federated subject and resource audience; no embedded secret |
| Service-to-service access | Token acquisition versus resource authorization and least-privilege assignment scope |
| External OIDC federation | Issuer, subject/audience trust and relying party; authentication is not deployment approval |
| API gateway/backend | Gateway checks versus backend enforcement, retries and failure responses |

No sign-in, app registration, consent, role assignment, token retrieval or kubeconfig collection is authorized to
draw a flow. Missing issuer/audience/scope decisions require clarification through the owning stage.

For the actual identity decision, use the managed Entra registration or Azure RBAC guidance. A future sequence
renderer would need ordered typed messages, participants and branches; do not infer them from prose or run code.
