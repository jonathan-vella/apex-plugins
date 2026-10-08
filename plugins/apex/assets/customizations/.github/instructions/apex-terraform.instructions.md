---
description: "Consumer Terraform security, provider, and repeatability guidance"
applyTo: "**/*.tf"
---

# APEX Terraform Rules

- Prefer Azure Verified Modules and explicit provider constraints.
- Keep backend, provider, and environment inputs separate from generated resource intent.
- Use managed identity and Entra-based access patterns instead of shared keys or secrets.
- Derive names from approved workload and environment inputs.
- Validate the exact generated configuration and lock state through the APEX workflow before preview.
