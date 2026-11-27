---
description: "Consumer Bicep security, AVM, and repeatability guidance"
applyTo: "**/*.bicep"
---

# APEX Bicep Rules

- Prefer Azure Verified Modules where they fit the selected design.
- Use managed identity, HTTPS, current TLS baselines, and private data access patterns.
- Derive names deterministically from the workload, environment, and approved suffix inputs.
- Keep parameters environment-specific and avoid hardcoded secrets or subscription identifiers.
- Validate generated Bicep through the APEX workflow before requesting a preview.
