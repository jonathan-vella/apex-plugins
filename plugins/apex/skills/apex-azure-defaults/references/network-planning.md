# Network Planning Guidance

Plan networking when a selected service requires VNet attachment, private endpoints, delegated subnets, internal
ingress, gateways, firewalls, private DNS, or controlled egress. Accepted governance network constraints always win.

## Required Inputs

- New or existing VNet decision and accepted scope
- Address spaces already used by connected networks
- Service/SKU network requirements and current documentation evidence
- Connectivity, ingress, egress, DNS, inspection, peering, and hybrid requirements
- Growth, scale, availability-zone, environment, and ownership expectations

An existing VNet requires accepted inventory or validation evidence. A user-supplied resource ID alone does not prove
address space, region, reachability, ownership, or available capacity.

## Planning Workflow

1. Derive required subnets from selected services and accepted topology; do not start from a fixed subnet count.
2. Record each subnet's purpose, address prefix, delegation, NSG, route table, service endpoints, and policy behavior.
3. Validate containment, pairwise non-overlap, connected-network overlap, usable capacity, and growth headroom.
4. Check exact service/SKU minimums against accepted current documentation; record both minimum and chosen headroom.
5. Add private DNS zones and VNet links for every private endpoint domain represented by accepted service evidence.
6. Account for billable gateways, firewalls, NAT, private endpoints, peering, DNS, and egress in cost inputs.
7. Reconcile the plan with governance and return conflicts as blockers.

## Durable Constraints

- Azure reserves addresses in each subnet; calculate usable capacity rather than comparing total addresses.
- Use exact reserved subnet names only when the matching service is in scope.
- Keep private-endpoint subnets distinct when policy, routing, scale, or ownership requires isolation.
- Apply the accepted delegation for delegated services; do not place incompatible delegations in one subnet.
- Private endpoint network-policy behavior must be explicit and supported by accepted service evidence.
- Attach NSGs and route tables according to accepted governance and service support; never assume universal support.
- Prefer an AKS networking mode supported for greenfield use and size from nodes, maximum pods, surge, and growth.
- NAT Gateway associates with workload subnets and does not imply a dedicated subnet.

## Capacity Evidence

For each subnet record total addresses, provider-reserved addresses, current demand, scale ceiling, surge demand, private
endpoint count, and remaining headroom. If any service-specific minimum, overlap check, or existing-VNet fact is
unavailable, mark the network decision blocked rather than auto-selecting a CIDR.

## Output

Return a typed network plan with evidence identifiers, topology assumptions, DNS ownership, cost-bearing resources,
exceptions, and unresolved dependencies. This skill does not probe VNets, allocate CIDRs, or create network resources.
