# Compiler And Provider Gotchas

Read this reference before accepting a new AVM binding and when build, preview, and apply results disagree.

## Exact Module Schema Wins

AVM parameter names, nested object fields, required values, and outputs can change between module versions. Inspect the
schema for the exact selected version before authoring its binding. Do not copy parameter shapes from model memory, an
older project, or documentation for another version.

Record the inspected inputs and outputs in validation evidence. If the exact schema cannot be inspected, return a
blocker rather than guessing.

AVM use also requires these checks:

- pin the version selected by the authorized resolver
- verify output names before creating downstream dependencies
- confirm required policy tags survive any module-internal tag merge
- verify diagnostics are emitted by the module or by an explicit companion binding
- wrap a module to override incompatible defaults; record an exception before replacing AVM with a raw resource

## Bicep Language Constraints

- `utcNow()` is valid only as a parameter default. Do not use it in a variable or resource expression.
- A child resource `parent` must be calculable at deployment start. A module output is not a static parent name; use a
  parameter-derived existing resource and an explicit dependency when ordering is otherwise lost.
- A subscription-scope module called from a resource-group deployment requires an explicit subscription scope.
- An `existing` resource reference does not prove that its creating module has completed. Add an explicit dependency
  when a child or extension resource targets something created in the same deployment.

## Identity And RBAC

Keep identity creation separate from target-resource authorization. Putting a target resource's role assignment inside
the identity module can create a dependency cycle when each module needs the other's output. Place the assignment with
the target resource and use the identity principal output as an input.

A runtime managed identity is not a data-plane administrator. Use a dedicated administration principal for SQL or other
data-plane administration, then grant the runtime identity only the application permissions it needs. Deploy-time
principal IDs remain required environment inputs; CodeGen must not invent or bake them into parameter files.

## Validation Green, Apply Red

A successful build or preview does not prove resource-provider compatibility. Review the rendered resource properties
when an AVM default may be SKU-dependent. Reject premium-only networking, zone, quarantine, trust, or data-endpoint
properties on a lower tier unless the exact provider contract supports them.

For scheduled query rules, validate KQL against the target table schema. Bicep treats the query as an opaque string and
preview does not run the service query parser. Ingestion quota alert queries against `_LogOperation` must use that
table's columns rather than fields copied from `AzureActivity`, `AzureDiagnostics`, or application tables.

## Service Topology Traps

- AKS egress mode must match the accepted topology: subnet NAT gateway, AKS-managed NAT gateway, explicit default route
  to an operator-managed firewall, or load balancer are different designs. Fixed-size pools must not carry autoscaling
  bounds, and a control-plane identity using an existing VNet needs the accepted network role assignment.
- An Application Gateway backend pool may be empty until its real backend exists. Never use a loopback address as a
  placeholder.
- MySQL private endpoint and delegated-subnet injection are different, mutually exclusive topologies. A shared private
  endpoint subnet is not a delegated MySQL subnet. Treat read-only authentication settings and other post-deployment
  operations as deployment tasks, not writable Bicep properties.
- A database major-version upgrade is an isolated lifecycle operation. Do not combine it with unrelated property
  changes. Resolve supported versions from current service evidence rather than retaining a version literal here.
- Subscription-scoped cost alerts require a scope-compatible view and module scope.
- Automation schedules cannot attach to an unpublished runbook. Keep publish-and-link work as an explicit
  post-deployment task when the resource provider requires it.

## Repair Loop

1. Classify the failure as Bicep language, exact module schema, rendered-template, or provider apply-time behavior.
2. Check the exact selected schema and accepted architecture/SKU evidence.
3. Correct the typed binding or record an explicit module exception; do not add a speculative property.
4. Re-run the owning build, lint, security, policy, and preview validators.
5. Proceed only when the new receipts are current; an apply-only limitation remains a documented deployment risk or
   blocker.
