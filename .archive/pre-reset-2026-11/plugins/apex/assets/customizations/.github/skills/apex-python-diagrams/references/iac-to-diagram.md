# IaC-to-Diagram Interpretation

Use accepted Architecture and logical-resource intent as the source of current diagrams. IaC can provide bounded
implementation context only when the kernel's accepted handoff binds its tree/hash; arbitrary source code is not
accepted evidence or permission to run it.

## Interpretation Checklist

1. Identify the selected IaC track, accepted source hash, logical-resource manifest and ownership.
2. Map physical descriptors to accepted logical IDs. Keep modules/containers distinct from deployed child resources.
3. Preserve explicit dependencies, scope and existing/supplied resource references; do not infer ownership from a
   resource name, module address or diagram cluster.
4. Separate variables/parameters/outputs from resolved resource values. An unresolved expression is unknown, not
   a literal endpoint, subnet or connection.
5. Cross-check accepted component/edge facts with the intended figure. Report missing resources, ambiguous IDs,
   truncated edges or unsupported notation to the owning stage.

| Source | What not to assume |
| --- | --- |
| Bicep module | The module container is an ARM resource or every child is workload-owned |
| Terraform address | A block proves actual applied state or grants ownership over related addresses |
| ARM expression | A concatenated name/reference is resolved without compiler/provider evidence |
| IaC output | The endpoint exists, is reachable or can safely be disclosed |
| Imported archetype | Its `.apex` history, diagram code and approvals belong to the consumer |

Never execute Bicep/Terraform/Python, read saved plans/state/secrets or run regex/code extraction as a substitute
producer. Unsupported code-to-network/runtime/ERD conversion needs an explicit typed producer/renderer before a
managed output can be claimed. Changes to IaC do not silently rewrite accepted architecture; use the normal confirmed
change/invalidation path and preserve manual-file conflicts.
