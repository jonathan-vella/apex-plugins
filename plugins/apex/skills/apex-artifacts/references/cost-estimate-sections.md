<!-- ref:cost-estimate-sections-v1 -->

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Cost Estimate — Section Templates

## Navigation

- Required Header Template
- Cost At-a-Glance Template
- Decision Summary Template
- Visual Standards
- Required Section Templates

Detailed examples complement the canonical templates in `templates/`.
Rules and enforcement live in the instruction file and templates.

## Required Header Template

```markdown
# Azure Cost Estimate: {Project Name}

**Generated**: {YYYY-MM-DD}
**Region**: {primary-region}
**Environment**: {Production|Staging|Development}
**Azure MCP Tools Used**: {actual guarded commands used, e.g. apex-azure/pricing (pricing_get), apex-azure/optimization (optimization_recommendation_list)}
**Architecture Reference**: {relative link to assessment doc}
```

## Cost At-a-Glance Template

Include immediately after the header:

````markdown
## 💵 Cost At-a-Glance

> **Estimated Monthly Total: ~$X,XXX** | Annual: ~$XX,XXX
>
> ```
> Cost basis: {proposed-resource retail estimate|as-built configuration estimate} | Actual spend: Not available
> ```
>
> | Status            | Indicator                    |
> | ----------------- | ---------------------------- |
> | Cost Estimate     | {price source and retrieval date} |
> | Recommendations   | {Advisor results or Not assessed} |
> | Compliance        | ✅ {e.g., PCI-DSS aligned}   |
````

If the customer supplied a budget, show it as an input and compare it only with this estimate. Do not present budget
utilization, historical spend, or a cost trend; those billing records are not available here.

## Decision Summary Template

Immediately after Cost At-a-Glance, include 2-3 bullet summary:

- Confirmed scope/SKU inputs, distinguished from final architecture approval
- What's deferred (intentionally not paying for yet)
- What requirement change would trigger a redesign

Include a confidence line:

```markdown
**Confidence**: High|Medium|Low
**Expected Variance**: ±X% (1 sentence why)
```

## Visual Standards

### Status Indicators

| Status         | Indicator | Usage                                 |
| -------------- | --------- | ------------------------------------- |
| Estimate       | 📊        | Modeled from stated quantities and returned price evidence |
| Recommendation | 💡        | Optimization suggestions              |
| Savings        | 💰        | Money saved                           |
| High risk      | 🔴        | Potential to materially increase cost |
| Medium risk    | 🟡        | Could increase cost under growth      |
| Low risk       | 🟢        | Predictable                           |

### Category Icons

| Category            | Emoji |
| ------------------- | ----- |
| Compute             | 💻    |
| Data Services       | 💾    |
| Networking          | 🌐    |
| Messaging           | 📨    |
| Security/Management | 🔐    |

### Scenario Indicators

Use indicators only for explicit workload scenarios or modeled estimates; Azure MCP does not provide a historical spend
trend or forecast.

## Required Section Templates

### 1. ✅ Decision Summary

```markdown
## ✅ Decision Summary

- ✅ Confirmed inputs: {scope and SKU choices approved before pricing; not final architecture approval}
- ⏳ Deferred: {what is explicitly not included yet}
- 🔁 Redesign Trigger: {what change forces SKU/region redesign}

**Confidence**: High|Medium|Low
**Expected Variance**: ±X% (1 sentence why)
```

### 2. 🔁 Requirements → Cost Mapping

Map business requirements and NFRs to concrete SKU decisions.

```markdown
## 🔁 Requirements → Cost Mapping

| Requirement | Architecture Decision | Cost Impact  | Mandatory |
| ----------- | --------------------- | ------------ | --------- |
| SLA 99.9%   | Use {service/SKU}     | +$X/month 📈 | Yes       |
| RTO/RPO     | {backup/DR choice}    | +$X/month    | No        |
| Compliance  | {WAF/PE/CMK choice}   | +$X/month 📈 | Yes       |
```

### 3. 📊 Top 5 Estimated Cost Drivers

```markdown
## 📊 Top 5 Estimated Cost Drivers

| Rank | Resource | Monthly Estimate | % of Estimated Total | Notes |
| ---- | -------- | ---------------- | -------------------- | ----- |
| 1️⃣   | ...      | $...             | ...                  | ...   |

> 💡 **Recommendation**: A returned, evidence-backed action to investigate
```

### 4. Summary

```markdown
## Summary

| Metric              | Value             |
| ------------------- | ----------------- |
| 💵 Monthly Estimate | $X - $Y           |
| 📅 Annual Estimate  | $X - $Y           |
| 🌍 Primary Region   | swedencentral     |
| 💳 Pricing Type     | List Price (PAYG) |
| ⭐ WAF Score        | X.X/10 (or TBD)   |
| 🎯 Target Users     | N concurrent      |
```

Add a short "Business Context" narrative (2-5 lines).

### 5. Architecture Overview

Include both subsections:

1. Cost distribution (table + optional image)
2. Key design decisions affecting cost

```markdown
## 🏛️ Architecture Overview

### Cost Distribution

| Category         | Monthly Estimate (USD) | Share |
| ---------------- | ---------------------: | ----: |
| 💻 Compute       |                535 |   39% |
| 💾 Data Services |                466 |   34% |
| 🌐 Networking    |                376 |   27% |

![Estimated Monthly Cost Distribution](../references/kernel-boundary.md)
```

### Key Design Decisions Affecting Cost

| Decision | Cost Impact    | Business Rationale | Status   |
| -------- | -------------- | ------------------ | -------- |
| ...      | +$.../month 📈 | ...                | Required |

### 6. 🧾 What We Are Not Paying For (Yet)

Make trade-offs explicit so stakeholders see conscious deferrals.

```markdown
## 🧾 What We Are Not Paying For (Yet)

> Examples: multi-region active-active, private endpoints for all
> services, premium HA cache, DDoS Standard
```

### 7. ⚠️ Cost Risk Indicators

```markdown
## ⚠️ Cost Risk Indicators

| Resource | Risk Level | Issue | Mitigation |
| -------- | ---------- | ----- | ---------- |
| ...      | 🔴 High    | ...   | ...        |

> **⚠️ Watch Item**: One sentence on biggest budget uncertainty
```

### 8. 🎯 Quick Decision Matrix

```markdown
## 🎯 Quick Decision Matrix

_"If you need X, expect to pay Y more"_

| Requirement | Additional Cost | SKU Change | Notes |
| ----------- | --------------- | ---------- | ----- |
| ...         | +$.../month     | ...        | ...   |
```

### 9. 🧩 Change Control (Top 3 Change Requests)

Standardize the 3 most likely changes and their delta.

```markdown
## 🧩 Change Control

| Change Request      | Delta     | Notes                |
| ------------------- | --------- | -------------------- |
| Add multi-region DR | +$X/month | From decision matrix |
| Add WAF             | +$X/month | From decision matrix |
| Upgrade DB tier     | +$X/month | From decision matrix |
```

### 10. 💰 Savings Opportunities

Always include a savings section. Use one of three states:

**State 1 — Estimated**: When comparable price evidence supports it, show a modeled difference and state its assumptions.
**State 2 — Not Quantified**: When the pricing run focused on baseline consumption only, say so.
**State 3 — Not Applicable**: When the evaluated pricing model has no applicable alternative in returned evidence.

> [!CAUTION]
> **Never show `$0.00` savings rows.** Zero-dollar rows imply the platform found no opportunities when the real state is
> "not evaluated." Use State 2 ("Not Quantified in This Run") instead.

```markdown
## 💰 Savings Opportunities

<!-- STATE 1: Estimated -->

> ### Modeled Price Difference: $X/year
>
> | Price Type | Monthly Price | Annual Price | Modeled Difference |
> | ---------- | ------------- | ------------ | ------------------ |
> | {returned alternative} | $... | $... | $... |

<!-- STATE 2: Not Quantified -->

> ### Savings: Not Quantified in This Run
>
> This estimate covers baseline retail consumption pricing only; commitment utilization and realized savings are not
> available from the guarded Azure MCP integration.
>
> Alternative price types may be compared only when returned meter evidence matches the proposed workload.

<!-- STATE 3: Not Applicable -->

> ### Savings: Not Applicable
>
> {Explain why — e.g., consumption-only pricing}
```

### Additional Optimization Strategies

| Recommendation | Modeled Difference | Evidence | Notes |
| -------------- | ------------------ | -------- | ----- |
| ...            | ...                | ...      | ...   |

### 11. Detailed Cost Breakdown

Break down by category, include subtotals.

```markdown
## 🧾 Detailed Cost Breakdown

### 💻 Compute Services

| Resource | SKU | Qty | $/Hour | $/Month | Notes |
| -------- | --- | --- | ------ | ------- | ----- |

**💻 Compute Subtotal**: ~$X/month
```

### 12. 📋 Monthly Cost Summary

Include:

- A category summary table
- An ASCII bar distribution (simple, readable)

### 13. 🧮 Base Run Cost vs Growth-Variable Cost

Make variance drivers explicit.

```markdown
## 🧮 Base Run Cost vs Growth-Variable Cost

| Cost Type       | Drivers     | Examples         | How It Scales           |
| --------------- | ----------- | ---------------- | ----------------------- |
| Base run        | fixed SKUs  | App Service, SQL | step-changes (upgrades) |
| Growth-variable | usage-based | egress, logs     | linear with usage       |
```

### 14. 🌍 Regional Comparison

Include the primary region and at least one alternative.
Add one sentence explaining why the primary was chosen.

### 15. 🔧 Environment Strategy (FinOps)

Explicitly state prod vs non-prod sizing and auto-shutdown.

```markdown
## 🔧 Environment Strategy (FinOps)

- Production: {HA/zone strategy, baseline capacity}
- Non-prod: {smaller SKUs, single instance, auto-shutdown}
```

### 16. 🔄 Environment Cost Comparison

If multiple environments, include the table.
If single environment, state "single environment".

### 17. 🛡️ Cost Guardrails

Tie the estimate to operational enforcement.

```markdown
## 🛡️ Cost Guardrails

| Guardrail      | Threshold   | Action                   |
| -------------- | ----------- | ------------------------ |
| Budget alert   | 80% / 100%  | Notify / block approvals |
| DB utilization | >80%        | Review tier/queries      |
| Log ingestion  | >X GB/day   | Tune sampling/retention  |
| Egress         | >X GB/month | Investigate CDN/traffic  |
```

### 18. 📝 Testable Assumptions

List 3-5 assumptions most likely to change spend.

```markdown
## 📝 Testable Assumptions

| Assumption     | Why It Matters     | How to Measure    | Threshold  |
| -------------- | ------------------ | ----------------- | ---------- |
| Egress < 100GB | keeps costs low    | Cost Mgmt+metrics | >100 GB/mo |
| Logs < 5 GB/mo | avoids ingestion $ | LA usage          | >5 GB/mo   |
```

### 19. 📊 Pricing Data Accuracy

Required bullets:

- Usage basis (e.g., 730 hours/month)
- Pricing type (PAYG list price unless otherwise stated)
- Data/egress assumptions
- Prices queried date

```markdown
## 📊 Pricing Data Accuracy

> **📊 Data Source**: Prices from Azure Retail Prices API via
> guarded Azure MCP
>
> ✅ **Included**: Retail list prices (PAYG)
>
> ❌ **Not Included**: EA discounts, CSP pricing, negotiated
> rates, Azure Hybrid Benefit
>
> 💡 For official quotes, validate with Azure Pricing Calculator
```

### 20. 🔗 References

Always include links to:

- Azure Pricing Calculator
- Azure Retail Prices API
- Any assessment/plan/docs used
