# AVM And Module Binding Guidance

Prefer Azure Verified Modules or the selected track's approved provider modules. Record module choices in typed bindings,
not direct source files.

## Selection Workflow

1. Use the selected track's resolver capability to find the matching module family.
2. Select an exact stable version from accepted resolver evidence; exclude prerelease versions unless explicitly allowed.
3. Read the exact-version interface evidence and map every required input, output, child resource, and scope.
4. Bind architecture intent, policy properties, tags, identity, networking, diagnostics, recovery, and SKU constraints.
5. Check module defaults for SKU/feature conflicts and deprecated or immutable parameters.
6. Validate that every planned resource has a binding and every binding traces to a planned resource.

Record module source, exact version, resolver evidence, interface evidence, and review policy. A copied version, `latest`,
or an unverified registry path is not an acceptable pin.

## Exception Contract

Use a non-AVM implementation only when accepted resolver evidence shows no suitable module or the module cannot satisfy
an accepted requirement. Record resource type, track, scope, evidence, incompatibility, alternative, rationale, risk,
owner, and review point. The exception authorizes a later CodeGen decision; it does not authorize this skill to emit code.

## Do Not

- Fetch registries or modules directly from the skill.
- Invent a module version or claim it is current.
- Paste raw Bicep or Terraform module code into a decision artifact.
- Treat an AVM choice as proof that runtime policy or deployment validation passed.
