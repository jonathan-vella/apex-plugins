# Import Assessment

Start with accepted inventory evidence that is complete for the declared subscription, resource-group, resource-type,
and result boundary. Treat each observed resource as a candidate until its mapping, dependencies, ownership boundary,
and required configuration are accepted. Do not infer resource facts from names or incomplete inventory pages.

For every candidate, record the scoped resource identifier, intended Terraform address, resource mapping evidence,
exact provider lock, exact module lock when adoption uses a module, required identity, network and diagnostics intent,
and reconciliation criteria. Preserve parent-child and cross-resource dependencies so the authorized capability can
sequence adoption safely.

Raw resource mapping may be a temporary accepted stage when an AVM binding cannot yet represent the resource. Record
the target module transition, rationale, and stable-address strategy as typed intent. Missing mapping evidence, an
unresolved lock, or an unavailable authorized capability is a blocker.
