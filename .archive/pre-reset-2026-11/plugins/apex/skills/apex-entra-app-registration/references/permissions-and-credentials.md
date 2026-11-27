# Permissions And Credentials

## Permission Intent

Map each accepted operation to one minimum API permission requirement. Specify whether the operation acts for a signed-in
user (delegated) or without a user (application), the target resource, consent owner, and evidence for necessity.

| Condition | Decision |
| --- | --- |
| User-context operation | Model delegated permission intent |
| Background workload operation | Model application permission intent |
| Permission necessity is unknown | Return `needs_input` or a blocker |
| Consent authority is absent | Preserve a consent blocker |

Never infer elevated permissions, grant consent, or treat requested permissions as approved access.

## Access Models

| Access model | Permission and endpoint contract |
| --- | --- |
| Delegated user | Consented delegated scopes. The app acts as the signed-in user, so user-scoped endpoints such as Graph `/me` apply. |
| App-only | Application permissions with admin consent, requested through the resource's `.default` scope. There is no signed-in user, so `/me` never applies; target an explicit object instead. |
| Azure resource | Azure RBAC at the intended resource scope; Microsoft Graph consent is independent of it. |

Delegated access is the intersection of what the app was granted and what the signed-in user may do; an app granted a
broad read scope still reads only what the user can read. Application access depends on the app's permissions alone,
which is why it always needs admin consent.

## Consent

Admin consent is required for every application permission, for privileged delegated permissions, and whenever the
organization disables user consent. Record the consent owner and the evidence that consent exists; a requested
permission is not a granted one.

## Credential Posture

| Client or hosting model | Preferred posture |
| --- | --- |
| Public client | No client credential |
| Azure-hosted workload | Managed identity when the target supports it |
| CI/CD pipeline | Workload identity federation for the pipeline identity |
| External confidential workload | Federated identity credential or certificate |
| Local development | Developer sign-in through a credential chain; never a production design |
| Secret-only integration | Explicit exception, lifecycle owner, and replacement plan |

Credential chains that try several sources in turn suit local development only: they add latency, widen the credential
surface, and authenticate differently per environment. Production designs name one deterministic credential.

Rotation is additive. Add the new credential, let consumers validate it, then retire the old credential in a separate
approved step. Record rotation cadence and owner; never shorten coexistence to save a step.

Do not create, retrieve, transmit, store, rotate, or reveal secret material. Record only credential type, owner,
validity or rotation requirement, and the capability receipt needed to establish it.
