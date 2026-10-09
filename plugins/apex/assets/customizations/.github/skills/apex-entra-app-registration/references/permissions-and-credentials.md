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

## Credential Posture

| Client or hosting model | Preferred posture |
| --- | --- |
| Public client | No client credential |
| Azure-hosted workload | Managed identity when the target supports it |
| External confidential workload | Federated identity credential or certificate |
| Secret-only integration | Explicit exception, lifecycle owner, and replacement plan |

Do not create, retrieve, transmit, store, rotate, or reveal secret material. Record only credential type, owner,
validity or rotation requirement, and the capability receipt needed to establish it.
