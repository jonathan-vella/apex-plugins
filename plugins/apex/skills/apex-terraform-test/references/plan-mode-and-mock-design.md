# Plan-Mode and Mock Design

Use plan-mode intent for deterministic contracts such as inputs, naming, tags, conditional resources, output shape,
and validation failures. State the expected observable result and isolate each case unless a declared dependency is the
behavior under test.

Use a mock only when accepted capability evidence confirms support for the exact provider lock. Record mocked resource
or data assumptions, asserted outcomes, and known unmodeled behavior. Mock-backed evidence does not establish provider
API behavior, timing, credentials, or live-service outcomes.

Integration intent requires an authorized environment, scoped cleanup expectations, and target-matched evidence.
Test design never authorizes execution or deployment.
