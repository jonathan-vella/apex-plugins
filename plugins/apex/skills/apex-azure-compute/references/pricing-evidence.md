# Pricing Evidence

Price candidates with `apex-azure-pricing/get_retail_prices`. The general query, empty-result, and meter rules are owned
by the retail pricing guidance in `apex-azure-defaults`; this reference adds the VM-specific rules. Match region,
operating system, licensing, price type, meter, currency, and quantity before comparing prices.

## VM Queries

| Need | Filters |
| --- | --- |
| Pay-as-you-go price for one size | `serviceName` `Virtual Machines`, `armRegionName`, `armSkuName` such as `Standard_D4s_v5`, `priceType` `Consumption` |
| Family comparison | The same filters for each shortlisted size; one query per identical parameter set |
| Reservation comparison | `priceType` `Reservation`; read the reservation term from each row |

- The operating system is in `productName`: a name without `Windows` is the Linux price; the `Windows` variant includes
  the Windows license.
- `meterName` distinguishes Spot and Low Priority variants. Exclude them unless the requirement allows eviction.
- Use primary-meter-region rows to avoid regional duplicates.
- Filter values are case-sensitive.

## Comparison Basis

- An hourly price times 730 gives a monthly estimate for an always-on instance.
- A scale set adds no separate compute charge. Estimate the per-instance price at the minimum and maximum instance
  counts, and state the expected runtime between them.
- Show reservation or savings-plan prices beside pay-as-you-go for the baseline instance count only.

## Recording

A recommendation states the retrieval time, query parameters, candidate size, price basis, commitment assumption,
quantity, and uncertainty. Pricing informs the cost trade-off; it does not choose a size, prove quota, or authorize
procurement. A missing meter leaves the line unresolved, never zero.
