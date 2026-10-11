> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Project README Template

> **Template for project-level README files in `agent-output/{project}/`**

---

## Template Instructions

When generating a project README, agents MUST:

1. Replace all `{placeholder}` values with actual project data
2. Include ALL H2 sections in exact order
3. Update workflow progress checkboxes based on existing artifacts
4. Populate artifact table from actual files in the folder
5. Calculate completion percentage accurately
6. Include architecture preview if diagram exists

---

## Required Structure

<!-- markdownlint-disable MD033 MD041 -->

<a id="readme-top"></a>

<div align="center">

<!-- Status Badge - Choose one based on completion -->
<!-- In Progress: -->

![Status](https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge)

<!-- OR Complete: -->

![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=for-the-badge)

<!-- Step Badge -->

![Step](https://img.shields.io/badge/Step-{current-step}%20of%207-blue?style=for-the-badge)

<!-- Cost Badge (if known) -->

![Cost](https://img.shields.io/badge/Est.%20Cost-${monthly-cost}%2Fmo-purple?style=for-the-badge)

# 🏗️ {project-name}

**{project-description}**

[View Architecture](#-architecture) · [View Artifacts](#-generated-artifacts) · [View Progress](#-workflow-progress)

</div>

---

## 📋 Project Summary

| Property           | Value                |
| ------------------ | -------------------- |
| **Created**        | {created-date}       |
| **Last Updated**   | {updated-date}       |
| **Region**         | {azure-region}       |
| **Environment**    | {environment}        |
| **Estimated Cost** | {monthly-cost}/month |
| **AVM Coverage**   | {avm-percentage}%    |

---

## ✅ Workflow Progress

<!-- Visual progress bar -->

Derive each status and the percentage from verified workflow graph/session state.
Generated files are not completed steps: required validation, reviews, blocker
resolution and human approvals must be current. Preserve partial and skipped states.

```text
[{progress-bar}] {completion-percentage}% Complete
```

| Step | Phase          |                                Status                                 | Artifact                                                           |
| :--: | -------------- | :-------------------------------------------------------------------: | ------------------------------------------------------------------ |
|  1   | Requirements   | {requirements-status} | [01-requirements.md](../references/kernel-boundary.md) |
|  2   | Architecture   | {architecture-status} | [02-architecture-assessment.md](../references/kernel-boundary.md) |
|  3   | Design         | {design-status} | [03-des-\*.md](.) |
| 3.5  | Governance     | {governance-status} | [04-governance-constraints.md](../references/kernel-boundary.md) |
|  4   | Planning       | {planning-status} | [04-implementation-plan.md](../references/kernel-boundary.md) |
|  5   | Implementation | {implementation-status} | [05-implementation-reference.md](../references/kernel-boundary.md) |
|  6   | Deployment     | {deployment-status} | [06-deployment-summary.md](../references/kernel-boundary.md) |
|  7   | Documentation  | {documentation-status} | [07-documentation-index.md](../references/kernel-boundary.md) |

> **Legend**:
> ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) Complete
> | ![WIP](https://img.shields.io/badge/-WIP-yellow?style=flat-square) In Progress
> | ![Pending](https://img.shields.io/badge/-Pending-lightgrey?style=flat-square) Pending
> | ![Skip](https://img.shields.io/badge/-Skipped-blue?style=flat-square) Skipped

---

## 🏛️ Architecture

<!-- Include diagram preview if available -->
<!-- If diagram exists, include the following block -->
<div align="center">

![Architecture Diagram](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/apex-azure-artifacts/templates/{diagram-filename})

_Generated with [apex-python-diagrams](../references/kernel-boundary.md)_

</div>
<!-- End diagram block -->

### Key Resources

| Resource          | Type              | SKU              | Purpose              |
| ----------------- | ----------------- | ---------------- | -------------------- |
| {resource-1-name} | {resource-1-type} | {resource-1-sku} | {resource-1-purpose} |
| {resource-2-name} | {resource-2-type} | {resource-2-sku} | {resource-2-purpose} |

<!-- Add more resources as needed -->

---

## 📄 Generated Artifacts

<details>
<summary><strong>📁 Step 1-3: Requirements, Architecture & Design</strong></summary>

| File                                                             | Description                       |                                Status                                 | Created        |
| ---------------------------------------------------------------- | --------------------------------- | :-------------------------------------------------------------------: | -------------- |
| [01-requirements.md](../references/kernel-boundary.md)                       | Project requirements with NFRs    | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [02-architecture-assessment.md](../references/kernel-boundary.md) | WAF assessment with pillar scores | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [03-des-cost-estimate.md](../references/kernel-boundary.md)             | Azure pricing estimate            | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [03-des-diagram.py](../references/kernel-boundary.md)                         | Architecture diagram source       | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |

</details>

<details>
<summary><strong>📁 Step 4-6: Planning, Implementation & Deployment</strong></summary>

| File                                                               | Description               |                                Status                                 | Created        |
| ------------------------------------------------------------------ | ------------------------- | :-------------------------------------------------------------------: | -------------- |
| [04-governance-constraints.md](../references/kernel-boundary.md)     | Azure Policy constraints  | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [04-implementation-plan.md](../references/kernel-boundary.md)           | Bicep implementation plan | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [04-dependency-diagram.py](../references/kernel-boundary.md)             | Step 4 dependency diagram | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [04-runtime-diagram.py](../references/kernel-boundary.md)                   | Step 4 runtime diagram    | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [05-implementation-reference.md](../references/kernel-boundary.md) | Link to Bicep code        | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [06-deployment-summary.md](../references/kernel-boundary.md)             | Deployment results        | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |

</details>

<details>
<summary><strong>📁 Step 7: As-Built Documentation</strong></summary>

| File                                                     | Description                     |                                Status                                 | Created        |
| -------------------------------------------------------- | ------------------------------- | :-------------------------------------------------------------------: | -------------- |
| [07-documentation-index.md](../references/kernel-boundary.md) | Documentation master index      | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [07-design-document.md](../references/kernel-boundary.md)         | Comprehensive design document   | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [07-operations-runbook.md](../references/kernel-boundary.md)   | Day-2 operational procedures    | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [07-resource-inventory.md](../references/kernel-boundary.md)   | Complete resource inventory     | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [07-backup-dr-plan.md](../references/kernel-boundary.md)           | Backup & disaster recovery plan | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |
| [07-ab-cost-estimate.md](../references/kernel-boundary.md)       | As-built cost estimate          | ![Done](https://img.shields.io/badge/-Done-success?style=flat-square) | {created-date} |

</details>

---

## 🔗 Related Resources

| Resource            | Path                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Bicep Templates** | [`infra/bicep/{project-slug}/`](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/infra/bicep/{project-slug})                                                 |
| **Workflow Docs**   | [Published workflow guide](https://apexops.pro/concepts/workflow/)             |
| **Troubleshooting** | [Published troubleshooting guide](https://apexops.pro/guides/troubleshooting/) |

---

<div align="center">

**Generated by
[APEX](https://github.com/jonathan-vella/apex/blob/c209d8bb765681aa21dce5d3cd2a3b080dad8d5e/.github/skills/README.md) **
· [Report Issue](https://github.com/jonathan-vella/apex/issues/new)

<a href="#readme-top">⬆️ Back to Top</a>

</div>
