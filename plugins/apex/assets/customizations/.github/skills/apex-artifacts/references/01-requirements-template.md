<!-- ref:01-requirements-template-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Step 1: Requirements Template

### 01-requirements.md

```text
## 🎯 Project Overview
## 🚀 Functional Requirements
## ⚡ Non-Functional Requirements (NFRs)
## 🔒 Compliance & Security Requirements
## 💰 Budget
## 🔧 Operational Requirements
## 🌍 Regional Preferences
## 📊 Complexity Classification
## 📋 Summary for Architecture Assessment
## References
```

### Complexity Classification

The `## 📊 Complexity Classification` section must include:

- **complexity**: `simple` / `standard` / `complex`
- **Criteria**: `simple` = ≤3 resources, no custom policies, single env;
  `standard` = 4-20 resources; `complex` = 20+ resources or PCI-DSS/SOC2
- This field drives workflow optimization (fast-path for simple projects)
