## Reference-Only Document Outlines

These outlines preserve useful document semantics from the source skill. They do not declare artifact kinds, renderer
bindings, workflow phases, file names, or authority to read repositories or query Azure. Use one only when a supported
custom-document capability supplies accepted values for every required slot.

### Preflight Evidence

- Purpose and validation scope
- Module or provider schema checks
- Parameter type and interface checks
- Region or service availability constraints
- Known pitfalls, pass/fail evidence, and unresolved blockers

Never infer a pass from planned configuration. Without accepted validation evidence, report the capability as absent.

### Implementation Reference

- Accepted implementation location or identifier
- File or module structure from accepted inventory
- Validation status with evidence references
- Resources represented by the implementation
- Key interfaces, decisions, limitations, and follow-up

Do not add deployment commands or claim files exist unless accepted evidence provides them.

### Documentation Package Index

- Package contents and status
- Accepted source artifacts and provenance
- Workload summary
- Related accepted resources and bounded links
- Missing package items and deferrals

### Design Document

- Purpose, audience, objectives, constraints, assumptions, and stakeholders
- Architecture overview and accepted relationships
- Networking, storage, compute, identity, security, compliance, backup, and monitoring
- Design decisions, operational implications, evidence, risks, and appendices

Only include domains represented by accepted inputs. Keep planned and observed state distinct.

### Backup And Recovery Plan

- Recovery objectives by service tier
- Backup scope, retention, restore approach, and ownership
- Failover and failback decision points
- Test schedule and accepted test evidence
- Communications, dependencies, recovery procedures, and blockers

Do not invent executable recovery commands. A missing tested procedure or owner is a blocker, not a placeholder success.

### Compliance Matrix

- Framework and scope
- Requirement-to-control-to-evidence mapping
- Gaps with severity, risk, owner, and remediation state
- Evidence collection metadata and audit trail
- Exceptions, expirations, deferrals, and residual risk

Compliance percentages require accepted numerator, denominator, and scope. Otherwise present coverage as unknown.

### Project Index

- Workload summary and status
- Accepted artifact catalog with provenance
- Architecture preview only when a supported media slot exists
- Resource summary, unresolved blockers, and related bounded links

### Lessons And Improvement View

- Accepted observations grouped by severity and workflow area
- What happened, impact, corrective action, and evidence
- Recommendations with owners and affected capability or contract
- Deferred improvements and rationale

Do not create improvement state or claim a correction was applied; project only kernel-accepted decisions.
