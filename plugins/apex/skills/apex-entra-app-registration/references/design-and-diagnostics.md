# Identity Design And Diagnostic Rules

Use this reference to model identity intent and classify observed failures. It does not create registrations, issue
tokens, call Microsoft Graph, grant consent, or handle credentials.

## Flow And Registration Intent

Record workload purpose, client class, interactive-user model, tenant boundary, API audience, redirect-URI class, and
the owning application before implementation begins. Use authorization code for web applications, authorization code
with PKCE for SPA or mobile public clients, device code only for supported browserless user interaction, and client
credentials for service-to-service workloads. Treat the selection as design intent, not a configured flow.

Redirect URIs must be an exact registered match and belong to the correct client platform. Unknown callback locations,
tenant model, or audience block implementation intent rather than being filled with placeholders.

## Permission And Credential Intent

Map each accepted business operation to its minimum required permission and target resource. Model delegated access
when the operation acts for a signed-in user and application access for a background workload without a user. Record
the consent owner and evidence; application permissions and privileged delegated permissions require an explicit
consent decision and must never be inferred as granted.

Public clients have no client credential. Prefer managed identity for supported Azure-hosted workloads and federation
or certificates for external confidential workloads. A secret-only design needs an explicit exception, lifecycle owner,
and replacement plan. Record credential type and rotation requirement, never credential material or identifiers.

## Diagnostic Classification

Classify a redirect mismatch by comparing the exact requested URI, registered URI, and platform class. Classify consent
or insufficient-privilege failures by checking the requested permission type, consent owner, target resource, and
accepted configuration evidence. Classify invalid-client or expired-credential failures as a credential-lifecycle
blocker. Classify application-not-found or tenant failures as an identity-boundary mismatch. Do not expose tokens or
use diagnostic observations as authority to change an application registration.

Return the evidence gap, responsible owner, and required kernel-authorized next task. Direct configuration, consent,
credential, SDK, CLI, IaC, and HTTP remediation stays outside this skill.
