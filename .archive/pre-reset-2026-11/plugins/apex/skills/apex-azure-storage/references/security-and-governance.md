# Storage Security And Governance

Use managed identity and Entra authorization in preference to shared keys and long-lived SAS; disable shared-key
access when governance and every consumer allow it. Require HTTPS and the runtime-projected TLS floor, keep anonymous
Blob access disabled unless a specific accepted exception exists, and use private endpoints and private DNS for
production data services when the policy and network design require it.

Each storage sub-resource the workload uses, such as blob, file, queue, table, or the Data Lake endpoint, needs its own
private endpoint and matching private DNS zone. Plan subnet capacity and DNS ownership for every one of them.

Map accepted governance effects to typed resource properties, diagnostics, tags, lifecycle, and exception records. Do
not treat an AVM selection or a template property as proof of policy compliance; validator and deployment evidence remain
required.

Record data classification, encryption needs, network path, identity roles, soft delete and versioning needs, retention,
backup, recovery targets, and operational ownership. Missing policy, classification, or recovery intent blocks a
completed storage design.
