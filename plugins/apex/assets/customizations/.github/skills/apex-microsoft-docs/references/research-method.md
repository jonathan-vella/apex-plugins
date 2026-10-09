# Official Documentation Research Method

## Frame The Question

Include the Microsoft product or Azure service, feature, exact or supported version family, platform, operating system,
IaC or SDK language when relevant, task intent, environment constraint, and decision to resolve.

Good query shapes name an outcome and source type:

- `Azure Storage private endpoint DNS zone group configuration`
- `Azure VMSS flexible orchestration limitations Linux`
- `.NET supported version policy App Service Linux`
- `Azure Well-Architected reliability checklist stateful workload`

Use `overview` for concepts, `quickstart` or `tutorial` for a guided task, `reference` for exact configuration, `limits`
for service boundaries, and `version support` or `retirement` for lifecycle questions.

## Select The Source Type

| Question | Preferred official source |
| --- | --- |
| Exact property, API, SDK, limit, or supported value | Product reference for the target version |
| Setup sequence or learning task | Current quickstart or tutorial for the target platform |
| Architecture trade-off | Azure Architecture Center or Well-Architected guidance |
| Lifecycle or compatibility | Product support, release, or retirement policy |
| Runnable example | Official code-sample result plus its parent documentation |

## Retrieve Evidence

1. Search first; do not begin with a full-page fetch.
2. Keep only results on official Microsoft domains supplied by the qualified capability.
3. Rank exact product/version/platform matches above generic, archived, training, or community pages.
4. Stop at the excerpt when it directly answers the question and supplies a citable URL.
5. Fetch one page or named section when qualifiers, tables, prerequisites, or exceptions are missing from the excerpt.
6. Run code-sample search only when the user or decision needs code; bind language, SDK, and version in the query.

Do not load an entire documentation tree. A second page is justified only when the first page explicitly delegates a
material prerequisite, limit, or exception to it.

## Evaluate Applicability

Check service and feature, cloud or region scope, version, platform, API surface, publication/update metadata, preview or
GA status, prerequisites, exclusions, and whether the page describes control plane, data plane, SDK, portal, or IaC.

Documentation can establish published behavior but cannot prove that a target subscription has quota, a SKU is currently
available in a region, a policy permits it, a deployment succeeded, or a price is current. Request the owning evidence
capability for those claims.

## Handle Code Samples

- Treat samples as illustrative and inspect their stated version, dependencies, authentication, and prerequisites.
- Prefer managed identity or `DefaultAzureCredential` patterns when the official sample supports them.
- Never copy credentials, connection strings, tenant values, or deprecated authentication patterns into an artifact.
- Record gaps between sample defaults and accepted security, governance, networking, or lifecycle requirements.
- Require later compile, test, and deployment validation; sample provenance is not execution evidence.

## Resolve Conflicts

Prefer the more specific current product reference over generic architecture prose for exact behavior. Prefer the target
version's page over an unversioned sample. When two applicable official sources materially disagree, retain both URLs,
describe the conflict, and return a blocker rather than choosing silently.

## Record The Result

For every material claim, retain:

- concise paraphrased claim
- page title, URL, and relevant heading
- retrieval time and capability evidence identifier
- applicable product, service, version, platform, and scope
- decision and requirement IDs informed
- caveats, conflicts, uncertainty, and follow-up evidence needed

Quote only the short phrase needed for exact terminology. Do not retain full page content in project artifacts. Treat a
changed, unavailable, archived, or ambiguous source as missing evidence.

## Validation Loop

1. Match every material claim to a captured source.
2. Check version, platform, scope, and preview/GA qualifiers.
3. Remove claims supported only by model memory or a search-title inference.
4. Search or fetch one narrower official source when a gap is resolvable.
5. Return the remaining gap as a blocker when the qualified capability cannot resolve it.

## Do Not

- Treat a search result as approval, policy, quota, availability, or pricing evidence.
- Fetch broad documentation trees or retain raw documentation in project artifacts.
- Use third-party summaries when an official Microsoft source is required.
- Add an unqualified documentation server or fallback command to a managed client projection.
- Claim an official sample is production-ready, secure for the workload, compiled, or deployed without separate evidence.
