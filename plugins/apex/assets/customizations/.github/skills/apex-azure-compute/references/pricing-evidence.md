# Pricing Evidence

Price candidates only with `apex-azure/pricing`, command `pricing_get`. The general query, empty-result, and meter rules
are owned by the retail pricing guidance in `apex-azure-defaults`; this reference adds VM-specific comparison rules.
Match region, operating system, licensing, price type, meter, currency, and quantity before comparing prices.

## VM Queries

| Need | `pricing_get` parameters |
| --- | --- |
| Pay-as-you-go price for one size | `service: "Virtual Machines"`, `sku: "<verified SKU>"`, `region: "<billing region>"`, `price-type: "Consumption"`, and one currency |
| Family comparison | Repeat the bounded query for each shortlisted SKU; reuse identical parameter sets |
| Reservation comparison | Request a returned `Reservation` price type only when the workload comparison asks for it |

- Match the returned product, meter, unit, operating-system variant, price type, currency, and region to the candidate.
- Exclude Spot and Low Priority variants unless the requirement allows eviction.
- Follow the central contract's row-cap and completeness rules; unresolved or ambiguous meters remain unpriced.

## Comparison Basis

- An hourly price times 730 gives a monthly estimate for an always-on instance.
- A scale set adds no separate compute charge. Estimate the per-instance price at the minimum and maximum instance
  counts, and state the expected runtime between them.
- Show returned alternative prices beside pay-as-you-go only as modeled price differences; this does not establish
  commitment eligibility, utilization, or realized savings.

## Recording

A recommendation states the retrieval time, query parameters, candidate size, price basis, commitment assumption,
quantity, and uncertainty. Pricing informs the cost trade-off; it does not choose a size, prove quota, or authorize
procurement. A missing meter leaves the line unresolved, never zero.
