# Decision Examples

Use these as decision-shape examples, not as automatic service recommendations.

| Area | Example trade-off |
| --- | --- |
| Compute | Container Apps versus App Service for an API with variable demand. |
| Data | Azure SQL Database versus Cosmos DB for transactional consistency and scale. |
| Networking | Private endpoints versus approved public access for a data service. |
| Identity | Managed identity versus application credential for service-to-service access. |
| Integration | Service Bus versus Event Grid for ordered, durable processing. |

For each example, bind the final choice to projected requirements, cost/availability evidence, governance constraints,
and any kernel-recorded user decision.

## Example: Compute Hosting

**Question**: Which managed host satisfies burst scaling, private data access, and the team's operating model?

| Option | Fit | Trade-off | Evidence needed |
| --- | --- | --- | --- |
| Container Apps | Event-driven scaling and container portability | More platform concepts and network constraints | Scale, region, network, and price evidence |
| App Service | Familiar managed web hosting | Scaling and container controls differ | Plan/SKU, region, network, and price evidence |

The selected option must state the hosting posture and accepted SKU family, not merely the service name. Consequences
should cover identity, ingress, diagnostics, scaling behavior, cost sensitivity, and migration effort.

## Example: Data Access Posture

**Question**: Should a production data service use private access or an approved public endpoint?

| Option | Fit | Trade-off | Evidence needed |
| --- | --- | --- | --- |
| Private endpoint | Strong isolation and policy alignment | DNS, subnet capacity, routing, and added cost | Policy, topology, DNS, capacity, and price evidence |
| Restricted public endpoint | Simpler connectivity when policy permits | Greater exposure and compensating controls | Policy, threat model, firewall, identity, and approval evidence |

If accepted governance denies public access, the public option is not viable; record that constraint rather than
pretending the alternatives are equally available.
