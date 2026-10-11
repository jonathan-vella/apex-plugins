# Network Planning Guidance

Plan networking when a selected service requires VNet attachment, private endpoints, delegated subnets, internal
ingress, gateways, firewalls, private DNS, or controlled egress. Accepted governance network constraints always win.

Services that always require a VNet include Application Gateway, Application Gateway for Containers, AKS, virtual
machines and scale sets, internal-mode API Management, Bastion, Azure Firewall, VPN and ExpressRoute gateways, and NAT
Gateway. Any private endpoint or regional VNet integration also triggers the plan. The address space and subnet plan
are user-owned decisions: confirm them through the kernel input request, and never default them silently. Production
cannot defer the plan.

## Required Inputs

- New or existing VNet decision and accepted scope
- Address spaces already used by connected networks
- Service/SKU network requirements and current documentation evidence
- Connectivity, ingress, egress, DNS, inspection, peering, and hybrid requirements
- Growth, scale, availability-zone, environment, and ownership expectations

An existing VNet requires accepted inventory or validation evidence. A user-supplied resource ID alone does not prove
address space, region, reachability, ownership, or available capacity. The read-only probe in
[existing VNet validation](azure-cli-and-azd.md#existing-vnet-validation) checks the ID and live address prefixes.

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

## Sizing Starting Points

Use these as starting points for the plan, then confirm the current minimum on the linked Microsoft Learn page before
binding. Prefer the recommended size for greenfield; the minimum is a floor, not a target.

| Subnet | Minimum | Recommended | Notes |
| --- | --- | --- | --- |
| [Application Gateway v2](https://learn.microsoft.com/azure/application-gateway/configuration-infrastructure#size-of-the-subnet) | `/26` | `/24` | `/24` leaves autoscale headroom. |
| [API Management, VNet-injected](https://learn.microsoft.com/azure/api-management/virtual-network-concepts#subnet-size) | `/28` | `/27` | Larger for multiple units or zone redundancy. |
| [AKS, Azure CNI Overlay](https://learn.microsoft.com/azure/aks/azure-cni-overlay) | Formula | Maximum nodes plus surge | Node subnet holds node and internal frontend IPs; pods use a separate non-overlapping CIDR. |
| [AKS, Azure CNI without overlay](https://learn.microsoft.com/azure/aks/configure-azure-cni) | `/22` | `/22` or larger | Every pod consumes a VNet IP; prefer Overlay for new clusters. Kubenet is retiring and is not a greenfield option. |
| [Private endpoints](https://learn.microsoft.com/azure/private-link/disable-private-endpoint-network-policy) | `/29` | `/27` | Count endpoint IP configurations, not endpoint resources. |
| [App Service VNet integration](https://learn.microsoft.com/azure/app-service/configure-vnet-integration-enable) | `/28` | `/26` | Delegated to `Microsoft.Web/serverFarms`. |
| VM or VMSS workload | `/29` | `/27` | Grow toward `/24` for large scale sets. |
| [Azure Bastion](https://learn.microsoft.com/azure/bastion/configuration-settings#subnet) | `/26` | `/26`, `/24` with host scaling | Reserved name `AzureBastionSubnet`. |
| [Azure Firewall](https://learn.microsoft.com/azure/firewall/firewall-faq#what-are-the-subnet-requirements) | `/26` | `/26` | Reserved name `AzureFirewallSubnet`. |
| [VPN or ExpressRoute gateway](https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings#gwsub) | `/27` | `/26` | Reserved name `GatewaySubnet`; `/26` when both gateways share the VNet. |
| [Application Gateway for Containers](https://learn.microsoft.com/azure/application-gateway/for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller) | `/24` | `/24` | Delegated to `Microsoft.ServiceNetworking/trafficControllers`. |

## Capacity Evidence

Usable IPv4 capacity per subnet is `2^(32 - prefix) - 5`: Azure reserves the network, gateway, two DNS, and broadcast
addresses. A `/29` therefore has three usable addresses. Check containment and pairwise overlap on parsed networks, not
on prefix text, and keep a spare block of at least `/27` for growth.

For each subnet record total addresses, provider-reserved addresses, current demand, scale ceiling, surge demand, private
endpoint count, and remaining headroom. If any service-specific minimum, overlap check, or existing-VNet fact is
unavailable, mark the network decision blocked rather than auto-selecting a CIDR.

## Output

Return a typed network plan with evidence identifiers, topology assumptions, DNS ownership, cost-bearing resources,
exceptions, and unresolved dependencies. This skill does not probe VNets, allocate CIDRs, or create network resources.
