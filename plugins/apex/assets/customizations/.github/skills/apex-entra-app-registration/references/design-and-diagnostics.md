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

### Sign-In Error Codes

| Code | Meaning | Classification |
| --- | --- | --- |
| `AADSTS50011` | Reply address missing or not registered for the app | Registration intent; compare exact URI and platform |
| `AADSTS50020` | User from another identity provider does not exist in the tenant | Tenant boundary; guest access is an owner decision |
| `AADSTS50059` | No tenant-identifying information in the request | Identity-boundary mismatch in the authority |
| `AADSTS50034`, `AADSTS50057` | User account not found in the directory, or disabled | Directory or user lifecycle, not app design |
| `AADSTS50053`, `AADSTS50055` | Account locked or password expired | User credential state, not app design |
| `AADSTS50058` | Session information insufficient for single sign-on | Expected before sign-in; check that the flow allows interaction |
| `AADSTS65001` | User or administrator has not consented | Consent owner and permission type |
| `AADSTS65004` | User declined consent | User decision; not a configuration defect |
| `AADSTS70000` | Invalid grant, such as an invalid refresh token | Token lifecycle; re-authentication, not registration change |
| `AADSTS70001` | Application is disabled | Registration lifecycle owner |
| `AADSTS700016` | Application not found in the tenant | Identity-boundary mismatch, or no service principal in that tenant |
| `AADSTS7000215` | Invalid client secret | Credential-lifecycle blocker |
| `AADSTS90014` | Expected field missing from the request or credential | Client compatibility or credential format |
| `AADSTS90072` | External account does not exist in the tenant, so MFA cannot be satisfied | Tenant boundary for external users |

The meanings follow the [Entra error code reference](https://learn.microsoft.com/entra/identity-platform/reference-error-codes).
Report an unlisted code as unclassified rather than guessing its meaning.

A tenant without a service principal for the application cannot sign in to it even though the registration exists;
classify that as an identity-boundary gap for the tenant owner.

Return the evidence gap, responsible owner, and required kernel-authorized next task. The read-only checks in
[troubleshooting commands](cli-commands.md#troubleshooting-commands) may run directly; configuration, consent and
credential fixes are routed changes, and SDK and HTTP remediation stays outside this skill.
