# Functions Upgrade Assessment

## Contents

- [Purpose and prerequisites](#purpose-and-prerequisites)
- [Assessment sequence](#assessment-sequence)
- [Caller-owned assessment shape](#caller-owned-assessment-shape)

## Purpose and Prerequisites

Apply the parent skill and global rules. An existing app's plan, runtime, OS, resource IDs, dependencies and target
intent must be accepted or explicitly unknown. Observation capabilities must already be available and granted.
The source's CLI version/extension prerequisites are historical; do not install tools or extensions to fill gaps.

No app setting values, secrets, deployment packages or certificates are read/downloaded. Project source metadata
may be assessed only when already supplied under the task's read scope; this skill never edits application code.

## Assessment Sequence

1. Identify source app/plan, OS, region, runtime/version and the exact target plan requirement.
2. Compare target region/cloud, runtime, programming model and version support with current official documentation.
   Availability is an assumption until evidenced; assessment does not add a new live gate.
3. Inventory slots and deployment strategy, certificate scope/usage, custom domains, built-in auth, CORS, HTTP/TLS,
   access restrictions and private network dependencies. Names/metadata only, not sensitive configuration values.
4. Examine trigger/binding metadata, especially polling Blob triggers, extension bundle versions, checkpoints,
   leases, duplicate processing, consumer groups and timer ownership.
5. Map current/target managed identity principals and required management/data permissions. Never automatically
   grant permissions or copy identity assumptions to a newly created system-assigned principal.
6. Map dependencies and code ownership. No source-control presence or deployment package means a delivery
   prerequisite gap; do not recover/download package contents.
7. Return compatibility results and the recommended bounded plan, including app/data operations that have no
   supported executor. An eligible Linux scan is only one signal, not whole-application readiness.

## Caller-Owned Assessment Shape

Use these dimensions within the caller's existing artifact. They retain the source's ten report sections without
creating a mandatory standalone Markdown file or independent workflow.

### 1. Executive Summary

Record app/resource IDs, resource group, source/target plan, region/cloud, runtime/version, OS, assessment date,
business goal and recommendation state: `compatible on supplied evidence`, `needs investigation`, `incompatible`
or `not assessed`. Never use "ready to execute" when only compatibility was assessed.

### 2. Compatibility Checks

| Dimension | Record |
| --- | --- |
| Region/cloud | Current support citation, observation if available, allocation uncertainty |
| Language/runtime version | Current target support and package/native dependency implications |
| Programming model | .NET isolated versus in-process and any required source remediation |
| OS | Windows-to-Linux assumptions, paths, libraries, filesystem and deployment differences |
| Slots | Existing slots, unsupported target behavior and alternative delivery ownership |
| Certificates | Metadata/scope/limits and reconfiguration ownership, never certificate contents |
| Blob triggers | Polling versus Event Grid, extension support and processing semantics |

For each, use `supported`, `incompatible`, `unknown` or `not applicable`, with evidence and scope.
Do not turn a frozen language-support table or absent scan result into a pass.

### 3. App Settings Inventory

Record **setting name**, `retain/rebuild/replace/drop/unknown`, rationale and owner.
Names-only projection is required even for apparently harmless settings; values may include credentials.
Do not copy `AzureWebJobsStorage` or old hosting settings. Use the detailed Flex reference's mapping.

### 4. Managed Identities

Record accepted identity type/resource ID/client ID/principal mapping as permitted, current roles/data policies,
target intent and unresolved authorization. New system-assigned identities require separately planned roles.
Reusing a user-assigned identity requires accepted ownership and scope; no assignment is performed.

### 5. Application Configurations

Cover CORS, custom domains, HTTP behavior, HTTPS/TLS, client certificates, network/access restrictions, VNet/private
endpoints/DNS and built-in authentication. Record only safe projected metadata; no provider/client secrets.
Highlight behavior differences and the operation/owner needed for each proposed change.

### 6. Trigger and Binding Analysis

Per function/trigger, record source metadata, state ownership, ordering/retry/idempotency behavior, migration risk,
parallel-consumer effect and mitigation. Proposal to create queues/consumer groups/subscriptions is not execution.

### 7. Dependent Services

Map upstream/downstream resource IDs, auth/data/network contracts, failure and recovery impact, current evidence,
required mitigation and owner. Include external clients, telemetry, storage and deployment access.

### 8. Blockers and Warnings

Separate incompatible target features from unknown evidence and unsupported executors.
Examples: in-process .NET without an accepted isolation plan; unknown native Linux compatibility; an unavailable
data/trigger cutover capability; absent accepted source principal or dependencies.
Warnings explain impact and owner; no numeric risk score or artificial new gate is required.

### 9. Recommendations

State the workload-manifest target, accepted identity/network/security intent, monitoring, scale/concurrency
assumptions, lifecycle urgency with current citations and cost evidence or explicit unpriced items.
Document expected functionality, performance and recovery evaluation as future work, not completed tests.

### 10. Next Steps

Return remediation decisions to the existing task, identify infrastructure versus application/data delivery owners,
provide rollback/reconciliation criteria and list unsupported execution blockers.
No kernel acceptance, approval or deployment result is inferred from this report.

Verify [Functions hosting](https://learn.microsoft.com/azure/azure-functions/functions-scale)
and [Consumption-to-Flex migration](https://learn.microsoft.com/azure/azure-functions/migration/migrate-plan-consumption-to-flex).
