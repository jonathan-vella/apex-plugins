# Test Design

Prefer deterministic unit coverage for naming, tags, conditional resources, output contracts, and variable validation.
Use negative cases to prove that invalid inputs are rejected. Assertions should state the observable contract, expected
condition, and actionable failure meaning; they must not depend on incidental ordering or model-inferred attributes.

Use mock-backed tests for provider-independent logic when an accepted capability confirms mock support under the exact
provider lock. Mock results validate declared behavior, not live Azure behavior. Keep scenarios isolated unless an
accepted dependency is the behavior being tested.

Request integration coverage only when the task explicitly requires live behavior and the task envelope supplies an
authorized environment capability. Scope inputs, resource identity, cleanup expectations, and evidence to the accepted
target. Missing authorization or a missing capability is a blocker.
