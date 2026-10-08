# Capacity Operational Checklist

## Mapping And Scope

- Confirm the provider-specific quota resource from accepted evidence. An ARM
  resource type is not a reliable quota-resource name.
- Compare only records for the same subscription, provider, region, resource
  family, observation policy, and requested demand.
- Separate quota capacity from service hard limits and regional availability;
  none of these establishes deployment approval.

## Decision

- Compute remaining capacity from the observed limit, usage, and requested
  demand, then retain each source value in the decision record.
- Treat nonpositive remaining capacity as a blocker. Treat an unsupported or
  unavailable quota surface as indeterminate, not unlimited capacity.
- Do not compare region alternatives whose evidence freshness or scope differs.

## Handoff

Route capacity gaps to an authorized planning or quota-request path. This skill
does not request an increase, select a subscription, or promise allocation.
