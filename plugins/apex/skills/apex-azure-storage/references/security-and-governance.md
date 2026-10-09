# Storage Security And Governance

Use managed identity and Entra authorization in preference to shared keys and long-lived SAS. Require HTTPS and modern
TLS, disable public Blob access unless a specific accepted exception exists, and use private endpoints and private DNS
for production data services when the policy and network design require it.

Map accepted governance effects to typed resource properties, diagnostics, tags, lifecycle, and exception records. Do
not treat an AVM selection or a template property as proof of policy compliance; validator and deployment evidence remain
required.

Record data classification, encryption needs, network path, identity roles, retention, backup, recovery targets, and
operational ownership. Missing policy, classification, or recovery intent blocks a completed storage design.
