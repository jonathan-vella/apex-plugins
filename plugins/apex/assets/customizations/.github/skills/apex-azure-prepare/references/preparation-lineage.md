# Preparation Lineage and Binding

## Evidence Flow

The preparation lifecycle maintains a one-way evidence chain:

1. Accepted requirements establish outcomes, constraints, and acceptance intent.
2. Architecture decisions explain the selected service, identity, networking, resilience, and operational approach.
3. The implementation plan turns those decisions into logical resources, dependencies, ownership, controls, and
   verification obligations.
4. A selected IaC binding expresses the track-specific module, provider, API, parameter, and state details needed for
   a bounded generation capability.

Every artifact must retain requirement IDs and accepted evidence references. An unresolved policy, quota, availability,
cost, ownership, or environment input remains unresolved; it must not become an assumed implementation value.

## Artifact Boundaries

| Artifact | Owns | Must Not Own |
| --- | --- | --- |
| Architecture | Decision rationale and material trade-offs | Provider syntax or direct resource definitions |
| Plan | Logical resources, controls, dependencies, and acceptance obligations | Track-specific implementation syntax |
| IaC binding | Track-specific module and configuration intent | New architecture or policy decisions |
| Generated batch | Kernel-authorized implementation output | Approval, validation, or deployment authority |

## Handoff to Validation

Preparation is complete only when the task's required artifacts are staged and accepted, the selected binding is
unambiguous, and all known constraints have a trace. This is evidence of preparation, not proof that the output is
valid, current, or deployable. Validation independently checks that claim.

## Direct-Operation Transformation

When a request asks to create infrastructure, configure Azure, or execute an IaC workflow, express the requested
outcome as a requirement or plan change. Route implementation through the kernel-selected binding and authorized
generation capability. Never translate it into a shell command, a direct file write, or an Azure operation.
