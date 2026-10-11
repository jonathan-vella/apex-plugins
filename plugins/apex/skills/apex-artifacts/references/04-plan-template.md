<!-- ref:04-plan-template-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Step 4: Implementation Plan Templates

Navigation summary only. Read the corresponding full template before current
writes: [governance](../templates/04-governance-constraints.template.md),
[implementation plan](../templates/04-implementation-plan.template.md), or
[preflight](../templates/04-preflight-check.template.md). The heading registry
owns required H2s; preserve additional full-template headings too. Routing and
completion follow the workflow graph and current approval/review state.

### 04-governance-constraints.md

```text
## 🔍 Discovery Source
## 📋 Azure Policy Compliance
## 🔄 Plan Adaptations Based on Policies
## 🚫 Deployment Blockers
## 🏷️ Required Tags
## 🔐 Security Policies
## 💰 Cost Policies
## 🌐 Network Policies
## References
```

The full governance template also includes `## 📜 Compliance Frameworks`;
preserve that additional section when writing the artifact.

### 04-implementation-plan.md

```text
## 📋 Overview
## 📦 Resource Inventory
## 🛡️ Governance Compliance Matrix
## 🗂️ Module Structure
## 🔨 Implementation Tasks
## 📤 Code-Generation Contract
## 🚀 Deployment Phases
## 🔗 Dependency Graph
## 🔄 Runtime Flow Diagram
## 🏷️ Naming Conventions
## 🔐 Security Configuration
## ⏱️ Estimated Implementation Time
## 🔒 Approval Gate
## References
```

### 04-preflight-check.md

```text
## 🎯 Purpose
## ✅ AVM Schema Validation Results
## 🔎 Parameter Type Analysis
## 🌍 Region Limitations Identified
## ⚠️ Pitfalls Checklist
## 🚀 Ready for Implementation
```
