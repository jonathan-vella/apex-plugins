---
description: "Consumer azd manifest co-location and environment naming rules"
applyTo: "**/azure.yaml"
---

# APEX azure.yaml Rules

- Keep each workload's `infra.path` inside its workload directory.
- Use an environment name that identifies both workload and lifecycle stage.
- Do not point `infra.path` at the consumer repository root.
- Keep Bicep and Terraform workload paths separate.
- Treat deployment execution as an APEX-governed operation, not an instruction-driven command.
