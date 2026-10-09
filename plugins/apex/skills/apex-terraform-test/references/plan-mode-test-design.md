# Plan-Mode Test Design

Plan-mode tests give deterministic evidence for configuration contracts without creating infrastructure. They do not
prove provider behavior or authorize apply-mode execution.

## Coverage Checklist

- Test required inputs, naming, tags, conditional resources, output contracts, and validation failures.
- Use mock-backed cases only for provider-independent behavior under the accepted provider lock.
- Make each assertion describe one observable accepted contract and an actionable failure condition.
- Keep scenarios isolated unless a declared dependency is the behavior being tested.
- Record fixture provenance and the provider/module locks used to interpret the result.

## Example Intent

An accepted test specification can state: given a private-endpoint-enabled binding, the generated configuration must
expose the approved private DNS dependency and reject a missing subnet input. The authorized test capability owns the
test file, execution, and receipt.

## Boundaries

Apply-mode tests, real-provider integration, environment access, cleanup, and publishing remain blocked without an
explicit authorized capability and accepted environment evidence.
