# AVM And CodeGen Acceptance

Prefer Azure Verified Modules when the selected Bicep binding can meet accepted requirements. Record the module family,
version-resolution evidence, required inputs, identity, network, diagnostics, tags, and outputs as typed constraints.

An AVM module is not automatically compliant. CodeGen must bind the selected version and interface; validation must
confirm syntax, lint, security baseline, policy-compatible settings, and preview results. When a module cannot express a
requirement, record the exception, alternative implementation, rationale, and traceability before generation.

Use explicit parameters for environment-specific values and avoid secret literals. Preserve stable resource identity and
outputs needed by dependent bindings. What-if review is a required pre-deployment receipt, not an informal observation.
