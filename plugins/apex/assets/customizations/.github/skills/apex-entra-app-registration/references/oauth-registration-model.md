# OAuth And Registration Model

Model identity before requesting an implementation capability. The design artifact must identify the workload purpose,
client class, users or services that authenticate, target API audience, tenant boundary, and redirect-URI class.

## Flow Selection

| Workload | Default intent | Constraints to record |
| --- | --- | --- |
| Web app | Authorization code | Redirect URI ownership and session boundary |
| SPA or mobile app | Authorization code with PKCE | Public-client posture and redirect URI class |
| Browserless user workflow | Device code only when interaction is supported | User consent and device interaction boundary |
| Service-to-service | Client credentials | Application permission and workload identity posture |

Do not describe token requests, generate protocol values, or claim that a flow is configured. The selected flow is a
traceable design choice that an authorized capability may later implement and validate.

## Redirect URI Intent

Record the owning application, URI class, environment boundary, and exact-match requirement. Unknown redirect URIs
block implementation intent; do not substitute placeholders or broaden accepted callback locations.

## Tenant And Audience

Record whether the application is single-tenant, multi-tenant, or otherwise restricted, and name the intended API
audience. Treat both as user-owned decisions when requirements lack evidence.
