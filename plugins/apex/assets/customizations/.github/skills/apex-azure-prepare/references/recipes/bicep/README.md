> MCP names in this reference are upstream pseudo-interfaces, not current vNext tool registrations.
> Use only capabilities projected by the active task; unavailable tools are blockers, never substitutes.

> Ported from `jonathan-vella/apex@c209d8bb765681aa21dce5d3cd2a3b080dad8d5e`.
> Read the [vNext authority and command boundary](../../../references/kernel-boundary.md) before using this reference.
> Examples are design material for accepted task inputs, not permission to write, execute or advance state.
> Runtime defaults, effective policy tags, security invariants and exact AVM locks override sample values.
> Raw resources illustrate provider syntax; use AVM first and record any accepted coverage exception.

# Bicep Recipe

Standalone Bicep workflow (without AZD).

## When to Use

- IaC-first approach
- No CLI wrapper needed
- Direct ARM deployment control
- Existing Bicep modules to reuse
- Custom deployment orchestration

## Before Generation

**REQUIRED: Research best practices before generating any files.**

| Artifact         | Research Action                                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Bicep files      | Call `mcp_bicep_get_bicep_best_practices`                                                                                  |
| Bicep modules    | Call `mcp_bicep_list_avm_metadata` and follow [AVM module order](../azd/iac-rules.md#avm-module-selection-order-mandatory) |
| Resource schemas | Use `activate_azure_resource_schema_tools` if needed                                                                       |

## Generation Steps

### 1. Generate Infrastructure

Create Bicep templates in the project directory (co-located with `azure.yaml`).

→ [patterns.md](patterns.md)

**Structure:**

```text
infra/
├── main.bicep
├── main.parameters.json
└── modules/
    ├── container-app.bicep
    ├── storage.bicep
    └── ...
```

### 2. Generate Dockerfiles (if containerized)

Manual Dockerfile creation required.

## Output Checklist

| Artifact    | Path                       |
| ----------- | -------------------------- |
| Main Bicep  | `./infra/main.bicep`       |
| Parameters  | `./infra/main.parameters.json` |
| Modules     | `./infra/modules/*.bicep`  |
| Dockerfiles | `src/<service>/Dockerfile` |

## References

- [Bicep Patterns](patterns.md)

## Next

→ Update `accepted preparation artifacts` → **apex-azure-validate**
