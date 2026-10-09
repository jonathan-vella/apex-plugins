# Network And Observability

Use hub-spoke topology only when shared connectivity, inspection, DNS, or platform services are accepted architectural
requirements. Spokes connect to the hub under accepted routing, peering, subnet, and network-security bindings; do not
infer these choices from naming or module defaults.

Private endpoint intent is complete only when the target subresource, approved subnet, private DNS zone, and DNS zone
group are all bound. A public-access exception requires accepted risk evidence and a policy-compatible boundary.

Every governed resource needs diagnostics and metrics mapped to the accepted monitoring destination. Categories,
retention, cost, ownership, and destination are typed decisions. Generated settings and deployment outcomes require
accepted validation and operation receipts for the same scoped target.
