# Module Composition and State Boundaries

Define each module by its stable inputs, outputs, ownership boundary, dependencies, and accepted locks. Compose modules
through declared outputs and inputs; do not substitute literal resource identifiers for an interface contract.

Group resources only when they share a lifecycle and a clear responsibility. Keep cross-cutting monitoring, identity,
policy, and provider configuration at an explicit boundary unless accepted architecture says otherwise.

For a refactor, record every source address, destination address, interface change, dependency, migration receipt, and
rollback condition as typed intent. An address change is not safe until an authorized capability supplies accepted
state-transition evidence. Do not perform or prescribe state operations.
