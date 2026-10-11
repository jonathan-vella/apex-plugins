# Naming And Binding Guidance

Use projected run identity, selected environment, and accepted governance constraints as naming inputs. Keep names
deterministic and traceable to the active run.

## Input Contract

Record the semantic workload name, environment, resource purpose, service constraint profile, and kernel-projected
uniqueness token. Do not use physical tenant, subscription, principal, or secret values as name material.

## Naming Procedure

1. Apply accepted policy casing, prefixes, suffixes, and prohibited-term rules.
2. Choose the CAF-style abbreviation projected for the resource family.
3. Normalize only as the service permits: lowercase, remove or replace separators, and restrict the character set.
4. Reserve space for the environment and run-stable uniqueness token before truncating the semantic portion.
5. Validate final length, start/end characters, global uniqueness requirements, and sibling-name collisions.
6. Record the pattern, normalized result, truncation rule, uniqueness source, and evidence in the typed binding.

Generate one stable uniqueness token per deployment identity and pass it to every binding that needs global uniqueness.
Do not generate unrelated random suffixes per module because that breaks cross-resource traceability and replacement
analysis.

## Constraint Profiles

| Resource family | Binding treatment |
| --- | --- |
| Storage account and registry | Remove separators, use lowercase alphanumerics, preserve suffix room, verify uniqueness. |
| Key Vault and SQL server | Use lowercase alphanumerics and allowed hyphens, preserve suffix room, verify uniqueness. |
| Resource group and network | Keep a readable project/environment/purpose pattern within accepted provider limits. |
| Reserved network resources | Use the exact provider-required name only when the matching resource is in scope. |

Illustrative patterns are `kv-{short-workload}-{env}-{suffix}` and `st{shortworkload}{env}{suffix}`. They are not
availability claims and do not override an accepted organization pattern.

## Abbreviation And Length Hints

These hints come from the Cloud Adoption Framework abbreviation list. Confirm each binding against the provider naming
rules for the exact resource type; an accepted organization pattern always wins.

| Resource | CAF abbreviation | Binding note |
| --- | --- | --- |
| Resource group | `rg` | Readable project, environment and purpose segments. |
| Virtual network and subnet | `vnet`, `snet` | Reserved subnet names override the pattern when the matching service is in scope. |
| Network security group | `nsg` | One per subnet unless governance or service support says otherwise. |
| Key Vault | `kv` | Short limit; globally unique; reserve room for the uniqueness token. |
| Storage account | `st` | Short limit; lowercase letters and digits only, no separators; globally unique. |
| Log Analytics workspace | `log` | Readable pattern. |
| Application Insights | `appi` | Readable pattern. |
| User-assigned managed identity | `id` | Name by workload purpose, not by principal. |
| Container app and environment | `ca`, `cae` | Check the shorter container-app limit before appending segments. |
| API Management | `apim` | Globally unique endpoint name. |
| Azure Cosmos DB | `cosmos` | Globally unique account endpoint name. |

Shorten the semantic portion first, then the environment segment, and never the uniqueness token. Template compilation
does not reject an overlong or invalid name; only accepted validation or deployment evidence proves a name is valid.

## Collision And Change Handling

- If truncation makes two semantic names equal, increase disambiguation through the selected naming capability.
- If accepted availability evidence rejects a global name, request a new kernel-owned token; do not improvise digits.
- Treat a changed naming input as replacement-risk evidence and surface it before code generation.
- Preserve established names for existing resources unless an accepted migration decision authorizes replacement.

## Binding Output

Record the naming pattern, uniqueness mechanism, maximum-length handling, and any governance exception in the typed
binding. Do not generate shell commands, persist suffix files, or claim a name is available without an accepted
availability or deployment receipt.
