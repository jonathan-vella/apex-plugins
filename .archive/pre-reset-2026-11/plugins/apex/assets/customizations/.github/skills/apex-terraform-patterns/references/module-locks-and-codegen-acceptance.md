# Module Locks And CodeGen Acceptance

Prefer an accepted Azure Verified Module when its locked interface can satisfy the approved requirements. Record the
module family, exact module lock, exact provider lock, required inputs, identity, network, diagnostics, tags, and
dependent outputs as typed constraints. A lock is valid only when its supporting capability receipt is accepted and
matches the active target and binding.

An AVM selection is not automatically compliant. CodeGen must return an authorized receipt for the locked bindings;
validation must return accepted evidence for syntax, security baseline, policy compatibility, and preview criteria. When
a module cannot express a requirement, record the exception, alternative intent, rationale, and traceability before
requesting generation.

Use typed parameters for environment-specific values and never carry secret literals in intent. Preserve stable resource
identity and required outputs for dependent bindings. Missing, stale, mismatched, or unavailable evidence is a blocker.
